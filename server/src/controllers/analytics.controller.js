import Course from "../models/course.model.js";
import User from "../models/auth.model.js";
import Blog from "../models/blog.model.js";
import EnrollmentCourse from "../models/enrollment.model.js";
import Lesson from "../models/lesson.model.js";
import Assignment from "../models/assignment.model.js";
import Notification from "../models/notifications.model.js";
import { catchAsyncHandler } from "../middlewares/error_middleware.js";
import { sendSuccess } from "../utils/api_response.js";

const monthLabel = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

const buildEmptyMonths = (count = 6) => {
  const now = new Date();
  return Array.from({ length: count }).map((_, index) => {
    const current = new Date(
      now.getFullYear(),
      now.getMonth() - (count - 1 - index),
      1,
    );
    return {
      key: `${current.getFullYear()}-${current.getMonth() + 1}`,
      label: monthLabel(current),
      value: 0,
    };
  });
};

const mapMonthlyCounts = (
  items = [],
  dateSelector = (item) => item.createdAt,
) => {
  const months = buildEmptyMonths(6);
  const map = new Map(months.map((month) => [month.key, { ...month }]));

  items.forEach((item) => {
    const date = new Date(dateSelector(item));
    if (Number.isNaN(date.getTime())) return;
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    const month = map.get(key);
    if (month) month.value += 1;
  });

  return Array.from(map.values()).map(({ label, value }) => ({ label, value }));
};

export const getAdminAnalytics = catchAsyncHandler(async (_req, res) => {
  const [
    users,
    courses,
    blogs,
    enrollments,
    lessons,
    assignments,
    notifications,
  ] = await Promise.all([
    User.find({}, "user_type createdAt"),
    Course.find({}, "students rating createdAt"),
    Blog.find({}, "createdAt"),
    EnrollmentCourse.find({}, "progress completed createdAt"),
    Lesson.find({}, "createdAt"),
    Assignment.find({}, "createdAt"),
    Notification.find({}, "createdAt"),
  ]);

  const counts = {
    students: users.filter((user) => user.user_type === "student").length,
    instructors: users.filter((user) => user.user_type === "instructor").length,
    admins: users.filter((user) => user.user_type === "admin").length,
    courses: courses.length,
    blogs: blogs.length,
    enrollments: enrollments.length,
    lessons: lessons.length,
    assignments: assignments.length,
    notifications: notifications.length,
  };

  const avgProgress =
    enrollments.length > 0
      ? Math.round(
          enrollments.reduce(
            (sum, enrollment) => sum + (enrollment.progress || 0),
            0,
          ) / enrollments.length,
        )
      : 0;

  const completionRate =
    enrollments.length > 0
      ? Math.round(
          (enrollments.filter((enrollment) => enrollment.completed).length /
            enrollments.length) *
            100,
        )
      : 0;

  const averageCourseRating =
    courses.length > 0
      ? Number(
          (
            courses.reduce((sum, course) => sum + (course.rating || 0), 0) /
            courses.length
          ).toFixed(2),
        )
      : 0;

  return sendSuccess(res, {
    message: "Admin analytics fetched successfully.",
    data: {
      counts,
      performance: {
        averageCourseRating,
        averageProgress: avgProgress,
        completionRate,
      },
      trends: {
        users: mapMonthlyCounts(users),
        enrollments: mapMonthlyCounts(enrollments),
        courses: mapMonthlyCounts(courses),
      },
    },
  });
});

export const getInstructorAnalytics = catchAsyncHandler(async (req, res) => {
  const instructorId = req.user._id;

  const courses = await Course.find(
    { courseCreatedBy: instructorId },
    "_id title createdAt",
  );
  const courseIds = courses.map((course) => course._id);

  const [enrollments, lessons, assignments] = await Promise.all([
    EnrollmentCourse.find(
      { courseId: { $in: courseIds } },
      "userId progress completed createdAt",
    ),
    Lesson.find({ courseId: { $in: courseIds } }, "createdAt"),
    Assignment.find({ courseId: { $in: courseIds } }, "createdAt"),
  ]);

  const uniqueStudents = new Set(
    enrollments.map((enrollment) => enrollment.userId.toString()),
  );

  const averageProgress =
    enrollments.length > 0
      ? Math.round(
          enrollments.reduce(
            (sum, enrollment) => sum + (enrollment.progress || 0),
            0,
          ) / enrollments.length,
        )
      : 0;

  return sendSuccess(res, {
    message: "Instructor analytics fetched successfully.",
    data: {
      counts: {
        courses: courses.length,
        students: uniqueStudents.size,
        enrollments: enrollments.length,
        lessons: lessons.length,
        assignments: assignments.length,
      },
      performance: {
        averageProgress,
        completionRate:
          enrollments.length > 0
            ? Math.round(
                (enrollments.filter((enrollment) => enrollment.completed)
                  .length /
                  enrollments.length) *
                  100,
              )
            : 0,
      },
      trends: {
        enrollments: mapMonthlyCounts(enrollments),
        courses: mapMonthlyCounts(courses),
      },
    },
  });
});

export const getStudentAnalytics = catchAsyncHandler(async (req, res) => {
  const studentId = req.user._id;
  const enrollments = await EnrollmentCourse.find(
    { userId: studentId },
    "courseId progress completed createdAt",
  ).populate("courseId", "title duration level");

  const enrolledCourseIds = enrollments
    .map((enrollment) => enrollment.courseId?._id)
    .filter(Boolean);

  const upcomingAssignments = await Assignment.find({
    courseId: { $in: enrolledCourseIds },
    dueDate: { $gte: new Date() },
  })
    .sort({ dueDate: 1 })
    .limit(5)
    .select("title dueDate courseId")
    .populate("courseId", "title");

  const averageProgress =
    enrollments.length > 0
      ? Math.round(
          enrollments.reduce(
            (sum, enrollment) => sum + (enrollment.progress || 0),
            0,
          ) / enrollments.length,
        )
      : 0;

  const completedCourses = enrollments.filter(
    (enrollment) => enrollment.completed,
  ).length;

  return sendSuccess(res, {
    message: "Student analytics fetched successfully.",
    data: {
      counts: {
        enrolledCourses: enrollments.length,
        completedCourses,
        inProgressCourses: Math.max(enrollments.length - completedCourses, 0),
        upcomingAssignments: upcomingAssignments.length,
      },
      performance: {
        averageProgress,
        completionRate:
          enrollments.length > 0
            ? Math.round((completedCourses / enrollments.length) * 100)
            : 0,
      },
      trends: {
        enrollments: mapMonthlyCounts(enrollments),
      },
      courses: enrollments,
      upcomingAssignments,
    },
  });
});
