import mongoose from "mongoose";
import Course from "../models/course.model.js";
import EnrollmentCourse from "../models/enrollment.model.js";
import { catchAsyncHandler } from "../middlewares/error_middleware.js";
import Notification from "../models/notifications.model.js";
import env from "../config/env.js";

const uploadsBaseUrl = `${env.appUrl}/uploads`;
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// 1. GET ALL COURSES
// 1. GET ALL COURSES (With Search & Filter)
export const getAllCourses = catchAsyncHandler(async (req, res) => {
  const {
    search,
    category,
    level,
    page = 1,
    limit = 12,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const query = {};

  if (search) {
    const normalizedSearch = String(search).trim().slice(0, 100);
    if (normalizedSearch) {
      query.title = { $regex: escapeRegex(normalizedSearch), $options: "i" };
    }
  }

  if (category && category !== "all") {
    query.category = category;
  }

  if (level && level !== "all") {
    query.level = level;
  }

  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedLimit = Math.min(Math.max(Number(limit) || 12, 1), 100);
  const allowedSortFields = ["createdAt", "title", "rating", "students"];
  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
  const sort = { [safeSortBy]: sortOrder === "asc" ? 1 : -1 };

  const [courses, total] = await Promise.all([
    Course.find(query)
      .populate("courseCreatedBy", "name email user_type")
      .sort(sort)
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit),
    Course.countDocuments(query),
  ]);

  const courseIds = courses.map((course) => course._id);
  const enrollmentCounts = await EnrollmentCourse.aggregate([
    { $match: { courseId: { $in: courseIds } } },
    { $group: { _id: "$courseId", count: { $sum: 1 } } },
  ]);
  const countByCourseId = new Map(
    enrollmentCounts.map(({ _id, count }) => [_id.toString(), count]),
  );

  const payload = courses.map((course) => ({
    ...course.toObject(),
    students: countByCourseId.get(course._id.toString()) || 0,
    imageUrl: course.image ? `${uploadsBaseUrl}/${course.image}` : null,
  }));

  return res.status(200).json({
    message:
      payload.length > 0
        ? "Courses fetched successfully!"
        : "No courses found matching criteria.",
    data: payload,
    meta: {
      page: parsedPage,
      limit: parsedLimit,
      total,
      totalPages: Math.ceil(total / parsedLimit),
    },
  });
});

// 2. GET COURSE BY ID
export const getCourseById = catchAsyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Course ID" });
  }

  const course = await Course.findById(id).populate(
    "courseCreatedBy",
    "name email user_type",
  );

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  const students = await EnrollmentCourse.countDocuments({ courseId: course._id });

  const courseData = {
    ...course.toObject(),
    students,
    imageUrl: course.image
      ? `${uploadsBaseUrl}/${course.image}`
      : null,
  };

  return res.status(200).json({
    message: "Course found",
    data: courseData,
  });
});

// 3. CREATE COURSE
export const createCourse = catchAsyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    duration,
    level,
  } = req.body;

  const courseCreatedBy = req.user?._id;

  if (!courseCreatedBy) {
    return res.status(401).json({ message: "Unauthorized: Missing user ID" });
  }

  const imageFile = req.file?.filename || null;

  const newCourse = new Course({
    title: title.trim(),
    description: description.trim(),
    category,
    duration,
    level,
    courseCreatedBy,
    image: imageFile,
  });

  await newCourse.save();
  await newCourse.populate("courseCreatedBy", "name email");

  await Notification.create({
    userId: courseCreatedBy,
    message: `New course "${newCourse.title}" has been published.`,
    type: "course",
    link: `/courses/${newCourse._id}`,
  });

  return res.status(201).json({
    message: "Course created successfully",
    data: {
      ...newCourse.toObject(),
      imageUrl: newCourse.image
        ? `${uploadsBaseUrl}/${newCourse.image}`
        : null,
    },
  });
});

// 4. UPDATE COURSE
export const updateCourseById = catchAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Course ID" });
  }

  const existingCourse = await Course.findById(id);
  if (!existingCourse) {
    return res.status(404).json({ message: "Course not found" });
  }

  const canEdit =
    req.user?.user_type === "admin" ||
    existingCourse.courseCreatedBy?.toString() === userId?.toString();

  if (!canEdit) {
    return res
      .status(403)
      .json({ message: "Forbidden: You can only edit your own courses." });
  }

  const updateData = {};
  for (const field of ["title", "description", "category", "duration", "level"]) {
    if (req.body[field] !== undefined) {
      updateData[field] = typeof req.body[field] === "string"
        ? req.body[field].trim()
        : req.body[field];
    }
  }
  if (req.file?.filename) {
    updateData.image = req.file.filename;
  }

  const updatedCourse = await Course.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  await Notification.create({
    userId,
    message: `Course "${updatedCourse.title}" has been updated.`,
    type: "course",
    link: `/courses/${updatedCourse._id}`,
  });

  return res.status(200).json({
    message: "Course updated successfully",
    data: {
      ...updatedCourse.toObject(),
      imageUrl: updatedCourse.image
        ? `${uploadsBaseUrl}/${updatedCourse.image}`
        : null,
    },
  });
});

// 5. DELETE COURSE
export const deleteCourseById = catchAsyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Course ID" });
  }

  const existingCourse = await Course.findById(id);
  if (!existingCourse) {
    return res.status(404).json({ message: "Course not found" });
  }

  const canDelete =
    req.user?.user_type === "admin" ||
    existingCourse.courseCreatedBy?.toString() === req.user?._id?.toString();

  if (!canDelete) {
    return res
      .status(403)
      .json({ message: "Forbidden: You can only delete your own courses." });
  }

  const deletedCourse = await Course.findByIdAndDelete(id);

  await Notification.create({
    userId: req.user?._id,
    message: `Course "${deletedCourse.title}" has been deleted.`,
    type: "course",
    link: `/courses/${deletedCourse._id}`,
  });

  return res.status(200).json({
    message: "Course deleted successfully",
    data: deletedCourse,
  });
});
