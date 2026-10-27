import express from "express";
const router = express.Router();

import {
  checkAuth,
  authorizeRoles,
} from "../middlewares/auth_middleware.js";
import validateRequest from "../middlewares/validate_request.js";
import { validateCreateCourseBody } from "../validators/course.validators.js";

import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourseById,
  deleteCourseById,
} from "../controllers/course.controller.js";

import {
  enrollInCourse,
  unEnrollFromCourse,
  getEnrolledCoursesByUserId,
  getEnrolledCoursesByStudentName,
  getAllEnrolledStudents,
  updateCourseEnrollment,
} from "../controllers/enrollment.controller.js";

import { upload } from "../middlewares/multer.js";

//--///////////////////////////////////////////////
// Course Routes
//--///////////////////////////////////////////////
router.get("/", getAllCourses);
router.get("/:id", getCourseById);
router.post(
  "/create-course",
  checkAuth,
  authorizeRoles("admin", "instructor"),
  upload.single("image"),
  validateRequest(validateCreateCourseBody),
  createCourse,
);
router.post(
  "/",
  checkAuth,
  authorizeRoles("admin", "instructor"),
  upload.single("image"),
  validateRequest(validateCreateCourseBody),
  createCourse,
);
router.put(
  "/:id",
  checkAuth,
  authorizeRoles("admin", "instructor"),
  upload.single("image"),
  updateCourseById,
);
router.delete(
  "/:id",
  checkAuth,
  authorizeRoles("admin", "instructor"),
  deleteCourseById,
);

//--///////////////////////////////////////////////
// Enrollment Routes
//--///////////////////////////////////////////////
router.post("/user/enrollments", checkAuth, enrollInCourse);
router.post("/enrollments", checkAuth, enrollInCourse);

router.get("/user/enrollments/:userId", checkAuth, getEnrolledCoursesByUserId);
router.get("/enrollments/:userId", checkAuth, getEnrolledCoursesByUserId);

router.get(
  "/user/enrollments/search/:name",
  checkAuth,
  getEnrolledCoursesByStudentName,
);

router.get(
  "/user/enrollments",
  checkAuth,
  authorizeRoles("admin", "instructor"),
  getAllEnrolledStudents,
);

router.put(
  "/user/enrollments/:id",
  checkAuth,
  authorizeRoles("admin", "instructor"),
  updateCourseEnrollment,
);
router.put("/enrollments/:id", checkAuth, updateCourseEnrollment);

router.delete(
  "/user/enrollments/:id",
  checkAuth,
  authorizeRoles("admin", "instructor"),
  unEnrollFromCourse,
);

export default router;
