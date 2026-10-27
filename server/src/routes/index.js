// ==========================
// User-related Routers
// ==========================
import userRouter from "./users.routes.js";
import attendanceRouter from "./attendance.routes.js";

// ==========================
// Auth Routers
// ==========================
import authRouter from "./auth.routes.js";

// ==========================
// Course-related Routers
// ==========================
import courseRouter from "./course.routes.js";
import lessonRouter from "./lesson.routes.js";
import assignmentRouter from "./assignment.routes.js";

// ==========================
// Educational Benefits
// ==========================
import benefitRouter from "./edu-benefits.routes.js";

// ==========================
// Blog Routers
// ==========================
import blogRouter from "./blog.routes.js";

// ==========================
// Post Interactions
// ==========================
import commentRouter from "./comments.routes.js";
import likeRouter from "./likes.routes.js";
import ratingRouter from "./rating.routes.js";

// ==========================
// Contact & Info
// ==========================
import contactRouter from "./contact-us.routes.js";
import privacyPolicyRouter from "./privacy-policy.routes.js";
import termsConditionsRouter from "./terms-conditions.routes.js";

// ==========================
// Utility Routers
// ==========================
import todoRouter from "./todo.routes.js";

// ==========================
// Notifications
// ==========================
import notificationRouter from "./notifications.routes.js";
import analyticsRouter from "./analytics.routes.js";
import adminRouter from "./admin.routes.js";

const registeredRouters = (app) => {
  // User
  app.use("/api/users", userRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/attendance", attendanceRouter);

  // Auth
  app.use("/api/auth", authRouter);

  // Courses
  app.use("/api/courses", courseRouter);
  app.use("/api/lessons", lessonRouter);
  app.use("/api/assignments", assignmentRouter);

  // Educational Benefits
  app.use("/api/benefits", benefitRouter);

  // Blog
  app.use("/api/blogs", blogRouter);

  // Post Interactions
  app.use("/api/comments", commentRouter);
  app.use("/api/likes", likeRouter);
  app.use("/api/ratings", ratingRouter);

  // Contact & Info
  app.use("/api/contact", contactRouter);
  app.use("/api/privacy-policy", privacyPolicyRouter);
  app.use("/api/terms-conditions", termsConditionsRouter);

  // Utilities
  app.use("/api/todos", todoRouter);

  // Notifications
  app.use("/api/notifications", notificationRouter);

  // Analytics
  app.use("/api/analytics", analyticsRouter);
};

export default registeredRouters;
