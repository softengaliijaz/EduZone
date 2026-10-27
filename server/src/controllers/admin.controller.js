import mongoose from "mongoose";
import User from "../models/auth.model.js";
import Course from "../models/course.model.js";
import Enrollment from "../models/enrollment.model.js";
import Attendance from "../models/attendance.model.js";
import Lesson from "../models/lesson.model.js";
import { catchAsyncHandler } from "../middlewares/error_middleware.js";

const idString = (id) => id.toString();

export const getAdminStudents = catchAsyncHandler(async (_req, res) => {
  const students = await User.find({ user_type: "student" })
    .select("name email bio profile_picture_url createdAt")
    .sort({ createdAt: -1 })
    .lean();
  const studentIds = students.map((student) => student._id);
  const enrollmentSummaries = await Enrollment.aggregate([
    { $match: { userId: { $in: studentIds } } },
    {
      $group: {
        _id: "$userId",
        enrolledCourses: { $sum: 1 },
        completedCourses: { $sum: { $cond: ["$completed", 1, 0] } },
        averageProgress: { $avg: { $ifNull: ["$progress", 0] } },
      },
    },
  ]);
  const summaryByStudent = new Map(
    enrollmentSummaries.map((summary) => [idString(summary._id), summary]),
  );

  return res.status(200).json({
    message: "Student directory loaded",
    data: students.map((student) => {
      const summary = summaryByStudent.get(idString(student._id));
      return {
        ...student,
        learning: {
          enrolledCourses: summary?.enrolledCourses || 0,
          completedCourses: summary?.completedCourses || 0,
          averageProgress: Math.round(summary?.averageProgress || 0),
        },
      };
    }),
  });
});

export const getAdminInstructors = catchAsyncHandler(async (_req, res) => {
  const instructors = await User.find({ user_type: "instructor" })
    .select("name email bio profile_picture_url createdAt")
    .sort({ createdAt: -1 })
    .lean();
  const instructorIds = instructors.map((instructor) => instructor._id);
  const courses = await Course.find({ courseCreatedBy: { $in: instructorIds } })
    .select("_id courseCreatedBy")
    .lean();
  const courseIds = courses.map((course) => course._id);
  const enrollmentCounts = courseIds.length
    ? await Enrollment.aggregate([
        { $match: { courseId: { $in: courseIds } } },
        { $group: { _id: "$courseId", learners: { $sum: 1 } } },
      ])
    : [];
  const learnersByCourse = new Map(
    enrollmentCounts.map((item) => [idString(item._id), item.learners]),
  );
  const totalsByInstructor = new Map();
  for (const course of courses) {
    const instructorId = idString(course.courseCreatedBy);
    const totals = totalsByInstructor.get(instructorId) || {
      courses: 0,
      learners: 0,
    };
    totals.courses += 1;
    totals.learners += learnersByCourse.get(idString(course._id)) || 0;
    totalsByInstructor.set(instructorId, totals);
  }

  return res.status(200).json({
    message: "Instructor directory loaded",
    data: instructors.map((instructor) => ({
      ...instructor,
      teaching: totalsByInstructor.get(idString(instructor._id)) || {
        courses: 0,
        learners: 0,
      },
    })),
  });
});

export const getAdminUserRecords = catchAsyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID." });
  }

  const user = await User.findById(id)
    .select("name email bio user_type profile_picture_url createdAt")
    .lean();
  if (!user) return res.status(404).json({ message: "User not found." });

  if (user.user_type === "student") {
    const [enrollments, attendance] = await Promise.all([
      Enrollment.find({ userId: id })
        .populate({
          path: "courseId",
          select: "title category level duration courseCreatedBy",
          populate: { path: "courseCreatedBy", select: "name" },
        })
        .sort({ enrollmentDate: -1 })
        .lean(),
      Attendance.find({ student: id })
        .populate("course", "title category")
        .sort({ sessionDate: -1 })
        .lean(),
    ]);
    const progressTotal = enrollments.reduce(
      (total, enrollment) => total + (enrollment.progress || 0),
      0,
    );

    return res.status(200).json({
      message: "Student learning records loaded",
      data: {
        user,
        type: "student",
        summary: {
          enrolledCourses: enrollments.length,
          completedCourses: enrollments.filter((item) => item.completed).length,
          averageProgress: enrollments.length
            ? Math.round(progressTotal / enrollments.length)
            : 0,
          attendanceRecords: attendance.length,
        },
        enrollments,
        attendance,
      },
    });
  }

  if (user.user_type === "instructor") {
    const courses = await Course.find({ courseCreatedBy: id })
      .sort({ createdAt: -1 })
      .lean();
    const courseIds = courses.map((course) => course._id);
    const [enrollmentCounts, lessonCounts] = courseIds.length
      ? await Promise.all([
          Enrollment.aggregate([
            { $match: { courseId: { $in: courseIds } } },
            { $group: { _id: "$courseId", learners: { $sum: 1 } } },
          ]),
          Lesson.aggregate([
            { $match: { courseId: { $in: courseIds } } },
            { $group: { _id: "$courseId", lessons: { $sum: 1 } } },
          ]),
        ])
      : [[], []];
    const learnerMap = new Map(enrollmentCounts.map((item) => [idString(item._id), item.learners]));
    const lessonMap = new Map(lessonCounts.map((item) => [idString(item._id), item.lessons]));
    const enrichedCourses = courses.map((course) => ({
      ...course,
      students: learnerMap.get(idString(course._id)) || 0,
      lessons: lessonMap.get(idString(course._id)) || 0,
    }));

    return res.status(200).json({
      message: "Instructor teaching records loaded",
      data: {
        user,
        type: "instructor",
        summary: {
          courses: courses.length,
          learners: enrichedCourses.reduce((total, course) => total + course.students, 0),
          lessons: enrichedCourses.reduce((total, course) => total + course.lessons, 0),
        },
        courses: enrichedCourses,
      },
    });
  }

  return res.status(400).json({
    message: "Detailed admin records are available for students and instructors.",
  });
});
