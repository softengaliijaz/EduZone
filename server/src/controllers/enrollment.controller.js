import mongoose from "mongoose";
import EnrollmentCourse from "../models/enrollment.model.js";
import Course from "../models/course.model.js";
import User from "../models/auth.model.js";
import { catchAsyncHandler } from "../middlewares/error_middleware.js";
import Notification from "../models/notifications.model.js";

export const enrollInCourse = catchAsyncHandler(async (req, res) => {
  try {
    const { userId: userIdFromBody, courseId } = req.body;
    const requesterId = req.user?._id?.toString();
    const requesterRole = req.user?.user_type;

    const userId = requesterRole === "admin" ? userIdFromBody || requesterId : requesterId;

    if (!userId || !courseId) {
      return res
        .status(400)
        .json({ error: "User ID and Course ID are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID." });
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: "Invalid course ID." });
    }

    if (requesterRole !== "student" && requesterRole !== "admin") {
      return res.status(403).json({ error: "Only students can enroll in courses." });
    }

    const [student, course] = await Promise.all([
      User.findById(userId).select("user_type"),
      Course.findById(courseId).select("_id"),
    ]);
    if (!student || student.user_type !== "student") {
      return res.status(400).json({ error: "Enrollment requires a valid student account." });
    }
    if (!course) {
      return res.status(404).json({ error: "Course not found." });
    }

    const existing = await EnrollmentCourse.findOne({ userId, courseId });

    if (existing) {
      return res.status(409).json({
        message: "User already enrolled in this course",
      });
    }

    let enrollment;
    try {
      enrollment = await EnrollmentCourse.create({ userId, courseId });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ message: "User already enrolled in this course" });
      }
      throw error;
    }

    const populatedEnrollment = await EnrollmentCourse.findById(enrollment._id)
      .populate("courseId", "title description duration level")
      .populate("userId", "name email");

    if (!populatedEnrollment.courseId) {
      console.error("❌ Course not found for enrollment:", enrollment.courseId);
      return res.status(500).json({
        error: "Enrollment saved, but course data not found during population",
      });
    }

    await Notification.create({
      userId,
      message: `You have enrolled in "${populatedEnrollment.courseId.title}".`,
      type: "enrollment",
      link: `/courses/${courseId}`,
    });

    const studentCount = await EnrollmentCourse.countDocuments({ courseId });

    return res.status(201).json({
      message: `Enrollment successful in course: ${populatedEnrollment.courseId.title}`,
      data: populatedEnrollment,
      studentCount,
    });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    return res
      .status(500)
      .json({ error: "Server error", message: error.message });
  }
});

export const getEnrolledCoursesByUserId = catchAsyncHandler(
  async (req, res) => {
    try {
      const { userId } = req.params;
      const requesterId = req.user?._id?.toString();
      const isPrivileged = ["admin", "instructor"].includes(req.user?.user_type);

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      if (!isPrivileged && requesterId !== userId) {
        return res.status(403).json({ error: "Forbidden access" });
      }

      const enrollments = await EnrollmentCourse.find({ userId })
        .populate("courseId", "title description duration level image")
        .populate("userId", "name email");

      if (!enrollments.length) {
        return res.status(200).json({
          message: "No enrollments found for this user.",
          data: [],
        });
      }

      return res.status(200).json({
        message: "User's enrolled courses fetched successfully",
        data: enrollments,
      });
    } catch (error) {
      console.error("Error:", error);
      return res
        .status(500)
        .json({ error: "Server error", message: error.message });
    }
  },
);

export const getEnrolledCoursesByStudentName = catchAsyncHandler(
  async (req, res) => {
    try {
      const { name } = req.params;

      const enrollments = await EnrollmentCourse.find()
        .populate({
          path: "userId",
          match: { name: { $regex: name, $options: "i" } },
          select: "name email",
        })
        .populate("courseId", "title description");

      const filtered = enrollments.filter((e) => e.userId !== null);

      if (!filtered.length) {
        return res
          .status(404)
          .json({ error: "No students found with that name" });
      }

      return res.status(200).json({
        message: `Enrollments for student(s) with name: ${name}`,
        data: filtered,
      });
    } catch (error) {
      console.error("Error:", error);
      return res
        .status(500)
        .json({ error: "Server error", message: error.message });
    }
  },
);

export const getAllEnrolledStudents = catchAsyncHandler(async (req, res) => {
  try {
    const enrollments = await EnrollmentCourse.find()
      .populate("userId", "name email")
      .populate("courseId", "title description");

    if (!enrollments.length) {
      return res.status(200).json({
        message: "No enrollments found",
        data: [],
      });
    }

    return res.status(200).json({
      message: "All enrolled students fetched successfully",
      data: enrollments,
    });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ error: "Server error", message: error.message });
  }
});

export const updateCourseEnrollment = catchAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;
    const enrollmentToUpdate = await EnrollmentCourse.findById(id).populate(
      "courseId",
      "courseCreatedBy title",
    );

    if (!enrollmentToUpdate) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    const canUpdate =
      req.user?.user_type === "admin" ||
      enrollmentToUpdate.userId?.toString() === req.user?._id?.toString() ||
      enrollmentToUpdate.courseId?.courseCreatedBy?.toString() ===
        req.user?._id?.toString();

    if (!canUpdate) {
      return res.status(403).json({
        error: "Forbidden: You cannot update this enrollment.",
      });
    }

    const safeProgress =
      progress === undefined ? enrollmentToUpdate.progress : Number(progress);

    if (!Number.isFinite(safeProgress) || safeProgress < 0 || safeProgress > 100) {
      return res.status(400).json({ error: "Progress must be between 0 and 100." });
    }

    const normalizedProgress = safeProgress;

    const enrollment = await EnrollmentCourse.findByIdAndUpdate(
      id,
      {
        progress: normalizedProgress,
        completed: normalizedProgress >= 100,
      },
      { new: true },
    )
      .populate("courseId", "title")
      .populate("userId", "_id");

    if (!enrollment) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    // Notify student of progress update
    await Notification.create({
      userId: enrollment.userId._id,
      message: `Your progress for "${enrollment.courseId.title}" has been updated.`,
      type: "enrollment",
      link: `/courses/${enrollment.courseId._id}`,
    });

    return res.status(200).json({
      message: "Enrollment updated successfully",
      data: enrollment,
    });
  } catch (error) {
    console.error("Error updating enrollment:", error);
    return res
      .status(500)
      .json({ error: "Server error", message: error.message });
  }
});

export const unEnrollFromCourse = catchAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const enrollmentToDelete = await EnrollmentCourse.findById(id).populate(
      "courseId",
      "courseCreatedBy title",
    );

    if (!enrollmentToDelete) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    const canDelete =
      req.user?.user_type === "admin" ||
      enrollmentToDelete.userId?.toString() === req.user?._id?.toString() ||
      enrollmentToDelete.courseId?.courseCreatedBy?.toString() ===
        req.user?._id?.toString();

    if (!canDelete) {
      return res.status(403).json({
        error: "Forbidden: You cannot remove this enrollment.",
      });
    }

    const enrollment = await EnrollmentCourse.findByIdAndDelete(id)
      .populate("courseId", "title")
      .populate("userId", "_id");

    if (!enrollment) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    await Notification.create({
      userId: enrollment.userId._id,
      message: `You have unenrolled from "${enrollment.courseId.title}".`,
      type: "enrollment",
      link: `/courses/${enrollment.courseId._id}`,
    });

    return res.status(200).json({ message: "Unenrollment successful" });
  } catch (error) {
    console.error("Error during unenrollment:", error);
    return res
      .status(500)
      .json({ error: "Server error", message: error.message });
  }
});
