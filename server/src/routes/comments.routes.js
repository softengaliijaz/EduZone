import express from "express";
import {
  createComment,
  getCommentsByCourse,
  getAllComments,
  updateComment,
  deleteComment,
} from "../controllers/comments.controller.js";
import { checkAuth } from "../middlewares/auth_middleware.js";

const router = express.Router();

router.get("/all", checkAuth, getAllComments);
router.put("/:id", checkAuth, updateComment);
router.delete("/:id", checkAuth, deleteComment);

router.post("/:courseId", checkAuth, createComment);
router.get("/:courseId", getCommentsByCourse);

export default router;
