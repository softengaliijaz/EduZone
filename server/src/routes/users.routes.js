import express from "express";
import {
  handleGetAllUsers,
  handleGetAllUsersByRole,
  createUser,
  handleGetUserById,
  handleDeleteUserById,
  handleUpdateUserById,
} from "../controllers/users.controller.js";
import {
  checkAuth,
  authorizeRoles,
} from "../middlewares/auth_middleware.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.get("/", checkAuth, authorizeRoles("admin"), handleGetAllUsers);

router.get(
  "/role/:role",
  checkAuth,
  authorizeRoles("admin"),
  handleGetAllUsersByRole,
);

router.get("/:id", checkAuth, handleGetUserById);

router.post(
  "/",
  checkAuth,
  authorizeRoles("admin"),
  upload.single("profile_picture_url"),
  createUser,
);

router.put(
  "/:id",
  checkAuth,
  upload.single("profile_picture_url"),
  handleUpdateUserById,
);

router.delete("/:id", checkAuth, authorizeRoles("admin"), handleDeleteUserById);

export default router;
