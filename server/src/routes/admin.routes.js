import express from "express";
import { checkAuth, authorizeRoles } from "../middlewares/auth_middleware.js";
import {
  getAdminInstructors,
  getAdminStudents,
  getAdminUserRecords,
} from "../controllers/admin.controller.js";

const router = express.Router();
router.use(checkAuth, authorizeRoles("admin"));

router.get("/students", getAdminStudents);
router.get("/instructors", getAdminInstructors);
router.get("/users/:id/records", getAdminUserRecords);

export default router;
