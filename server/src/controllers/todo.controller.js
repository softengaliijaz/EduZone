import mongoose from "mongoose";
import { catchAsyncHandler } from "../middlewares/error_middleware.js";
import Todo from "../models/todo.model.js";
import Notification from "../models/notifications.model.js";

export const getTodos = catchAsyncHandler(async (req, res) => {
  const todos = await Todo.find({ user: req.user._id });
  return res.status(200).json({ message: "Todos fetched", data: todos });
});

export const createTodo = catchAsyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text?.trim()) {
    return res
      .status(400)
      .json({ message: "Invalid input: 'text' is required" });
  }

  const todo = new Todo({ text: text.trim(), user: req.user._id });
  const saved = await todo.save();

  await Notification.create({
    userId: req.user._id,
    message: `New todo created: "${saved.text}"`,
    type: "todo",
    link: `/todos/${saved._id}`,
  });

  return res
    .status(201)
    .json({ message: "Todo created successfully", data: saved });
});

export const updateTodo = catchAsyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid todo ID" });
  }

  const todo = await Todo.findById(id);

  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }
  if (todo.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You cannot update another user's todo." });
  }

  if (req.body.text !== undefined) {
    if (typeof req.body.text !== "string" || !req.body.text.trim()) {
      return res.status(400).json({ message: "Todo text cannot be empty." });
    }
    todo.text = req.body.text.trim();
  }
  if (req.body.completed !== undefined) {
    if (typeof req.body.completed !== "boolean") {
      return res.status(400).json({ message: "Completed must be a boolean." });
    }
    todo.completed = req.body.completed;
  }
  const updated = await todo.save();

  await Notification.create({
    userId: updated.user,
    message: `Todo updated: "${updated.text}"`,
    type: "todo",
    link: `/todos/${updated._id}`,
  });

  return res
    .status(200)
    .json({ message: "Todo updated successfully", data: updated });
});

export const deleteTodo = catchAsyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid todo ID" });
  }

  const todo = await Todo.findById(id);

  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }
  if (todo.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You cannot delete another user's todo." });
  }
  const deleted = await Todo.findByIdAndDelete(id);

  await Notification.create({
    userId: deleted.user,
    message: `Todo deleted: "${deleted.text}"`,
    type: "todo",
    link: `/todos`,
  });

  return res.status(200).json({
    message: "Todo deleted successfully",
    data: deleted,
  });
});
