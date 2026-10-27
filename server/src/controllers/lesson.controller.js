import mongoose from "mongoose";
import { catchAsyncHandler } from "../middlewares/error_middleware.js";
import Lesson from "../models/lesson.model.js";
import Course from "../models/course.model.js";
import EnrollmentCourse from "../models/enrollment.model.js";
import Notification from "../models/notifications.model.js";

const populateCourse = { path: "courseId", select: "title courseCreatedBy" };

const canManageCourse = (user, course) =>
  user?.user_type === "admin" ||
  course?.courseCreatedBy?.toString() === user?._id?.toString();

const canReadLesson = async (user, lesson) => {
  const course = lesson.courseId;
  if (canManageCourse(user, course)) return true;
  if (lesson.isPreview) return true;
  return Boolean(
    await EnrollmentCourse.exists({ userId: user._id, courseId: course._id }),
  );
};

export const createLesson = catchAsyncHandler(async (req, res) => {
  const { title, content, videoUrl, duration, isPreview, courseId } = req.body;

  if (typeof title !== "string" || title.trim().length < 1) {
    return res.status(400).json({ message: "Title is required." });
  }
  if (typeof content !== "string" || content.trim().length < 10) {
    return res.status(400).json({ message: "Content must be at least 10 characters long." });
  }
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({ message: "Valid course ID is required." });
  }

  const course = await Course.findById(courseId).select("courseCreatedBy title");
  if (!course) return res.status(404).json({ message: "Course not found." });
  if (!canManageCourse(req.user, course)) {
    return res.status(403).json({ message: "You cannot manage lessons for this course." });
  }

  const lesson = await Lesson.create({
    title: title.trim(),
    content: content.trim(),
    videoUrl,
    duration,
    isPreview: Boolean(isPreview),
    courseId,
  });
  await Notification.create({
    userId: req.user._id,
    message: `New lesson "${lesson.title}" has been created.`,
    type: "lesson",
    link: `/lessons/${lesson._id}`,
  });
  return res.status(201).json({ message: "Lesson created successfully", data: lesson });
});

export const getAllLessons = catchAsyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.courseId) {
    if (!mongoose.Types.ObjectId.isValid(req.query.courseId)) {
      return res.status(400).json({ message: "Invalid course ID." });
    }
    filter.courseId = req.query.courseId;
  }
  const lessons = await Lesson.find(filter).populate(populateCourse);
  const readableLessons = [];
  for (const lesson of lessons) {
    if (lesson.courseId && await canReadLesson(req.user, lesson)) {
      readableLessons.push(lesson);
    }
  }
  return res.status(200).json({
    message: "Lessons fetched successfully",
    data: readableLessons,
  });
});

export const getLessonById = catchAsyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid lesson ID." });
  }
  const lesson = await Lesson.findById(req.params.id).populate(populateCourse);
  if (!lesson || !lesson.courseId) {
    return res.status(404).json({ message: "Lesson not found.", data: null });
  }
  if (!(await canReadLesson(req.user, lesson))) {
    return res.status(403).json({ message: "Enrollment is required to access this lesson." });
  }
  return res.status(200).json({ message: "Lesson fetched", data: lesson });
});

export const updateLesson = catchAsyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid lesson ID." });
  }
  const lesson = await Lesson.findById(req.params.id).populate(populateCourse);
  if (!lesson) return res.status(404).json({ message: "Lesson not found.", data: null });
  if (!canManageCourse(req.user, lesson.courseId)) {
    return res.status(403).json({ message: "You cannot manage lessons for this course." });
  }

  const { title, content, videoUrl, duration, isPreview, courseId } = req.body;
  if (title !== undefined) {
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ message: "Title cannot be empty." });
    }
    lesson.title = title.trim();
  }
  if (content !== undefined) {
    if (typeof content !== "string" || content.trim().length < 10) {
      return res.status(400).json({ message: "Content must be at least 10 characters long." });
    }
    lesson.content = content.trim();
  }
  if (videoUrl !== undefined) lesson.videoUrl = videoUrl;
  if (duration !== undefined) lesson.duration = duration;
  if (isPreview !== undefined) lesson.isPreview = Boolean(isPreview);
  if (courseId !== undefined) {
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID." });
    }
    const targetCourse = await Course.findById(courseId).select("courseCreatedBy");
    if (!targetCourse) return res.status(404).json({ message: "Course not found." });
    if (!canManageCourse(req.user, targetCourse)) {
      return res.status(403).json({ message: "You cannot manage lessons for this course." });
    }
    lesson.courseId = courseId;
  }

  await lesson.save();
  await Notification.create({
    userId: req.user._id,
    message: `Lesson "${lesson.title}" has been updated.`,
    type: "lesson",
    link: `/lessons/${lesson._id}`,
  });
  return res.status(200).json({ message: "Lesson updated successfully", data: lesson });
});

export const deleteLesson = catchAsyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid lesson ID." });
  }
  const lesson = await Lesson.findById(req.params.id).populate(populateCourse);
  if (!lesson) return res.status(404).json({ message: "Lesson not found.", data: null });
  if (!canManageCourse(req.user, lesson.courseId)) {
    return res.status(403).json({ message: "You cannot manage lessons for this course." });
  }
  await lesson.deleteOne();
  await Notification.create({
    userId: req.user._id,
    message: `Lesson "${lesson.title}" has been deleted.`,
    type: "lesson",
    link: "/lessons",
  });
  return res.status(200).json({ message: "Lesson deleted successfully", data: lesson });
});
