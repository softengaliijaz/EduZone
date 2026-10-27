import Comment from "../models/comments.model.js";
import mongoose from "mongoose";
import { catchAsyncHandler } from "../middlewares/error_middleware.js";

export const createComment = catchAsyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId } = req.params;
    const { text } = req.body;

    if (!text || !String(text).trim()) {
      return res.status(400).json({ error: "Comment text is required." });
    }

    const comment = new Comment({
      course: courseId,
      user: userId,
      text: String(text).trim(),
    });
    if (!comment) {
      return res.status(400).json({ error: "Invalid comment data" });
    }

    await comment.save();

    return res
      .status(201)
      .json({ message: "Comment created successfully", comment });
  } catch (err) {
    console.error("Error creating comment:", err);
    return res.status(500).json({ error: "Failed to create comment" });
  }
});

export const getCommentsByCourse = catchAsyncHandler(async (req, res) => {
  try {
    const { courseId } = req.params;
    const comments = await Comment.find({ course: courseId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    if (!comments) {
      return res
        .status(404)
        .json({ error: "No comments found for this course" });
    }
    return res
      .status(200)
      .json({ message: "Comments fetched successfully", comments });
  } catch (err) {
    console.error("Error creating comment:", err);
    return res.status(500).json({ error: "Failed to fetch comments" });
  }
});

export const getAllComments = catchAsyncHandler(async (req, res) => {
  try {
    const comments = await Comment.find({})
      .populate("user", "name email")
      .populate("course", "title _id")
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json({ message: "All comments fetched successfully", comments });
  } catch (err) {
    console.error("Error fetching all comments:", err);
    return res.status(500).json({ error: "Failed to fetch all comments" });
  }
});

export const updateComment = catchAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const text = String(req.body?.text || "").trim();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid comment ID." });
  }
  if (!text || text.length > 2000) {
    return res.status(400).json({ error: "Comment must be between 1 and 2,000 characters." });
  }

  const comment = await Comment.findById(id);
  if (!comment) return res.status(404).json({ error: "Comment not found." });
  if (comment.user.toString() !== req.user?._id?.toString()) {
    return res.status(403).json({ error: "You can only edit your own comments." });
  }

  comment.text = text;
  await comment.save();
  await comment.populate("user", "name email");
  return res.status(200).json({ message: "Comment updated successfully", comment });
});

export const deleteComment = catchAsyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid comment ID." });
  }

  const comment = await Comment.findById(id);
  if (!comment) return res.status(404).json({ error: "Comment not found." });
  if (comment.user.toString() !== req.user?._id?.toString()) {
    return res.status(403).json({ error: "You can only delete your own comments." });
  }

  await comment.deleteOne();
  return res.status(200).json({ message: "Comment deleted successfully", id });
});
