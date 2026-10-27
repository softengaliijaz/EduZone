import User from "../models/auth.model.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { catchAsyncHandler } from "../middlewares/error_middleware.js";

export const handleGetAllUsers = catchAsyncHandler(async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Oops! No users found." });
    }
    res.status(200).json({
      message: "All users fetched successfully.",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while fetching users.",
      error: error.message,
    });
  }
});

export const handleGetAllUsersByRole = catchAsyncHandler(async (req, res) => {
  try {
    const role = req.params.role;
    if (!role) {
      return res.status(400).json({ message: "Role parameter is required" });
    }

    const usersByRole = await User.find({ user_type: role }).select(
      "-password",
    );
    if (!usersByRole || usersByRole.length === 0) {
      return res
        .status(404)
        .json({ message: `No users found with role: ${role}` });
    }

    res.status(200).json({
      message: `Users with role "${role}" fetched successfully`,
      data: usersByRole,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching users by role",
      error: error.message,
    });
  }
});

export const createUser = catchAsyncHandler(async (req, res) => {
  try {
    const { name, email, password, user_type, bio } = req.body;
    const profile_picture_url = req.file?.filename || null;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      user_type: user_type || "student",
      profile_picture_url,
      bio,
    });

    await newUser.save();

    const userData = newUser.toObject();
    delete userData.password;

    res.status(201).json({
      message: "User created successfully",
      user: userData,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
});

export const handleGetUserById = catchAsyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const requester = req.user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ObjectId format" });
    }

    const isSelf = requester?._id?.toString() === id;
    const isPrivileged = ["admin", "instructor"].includes(
      requester?.user_type,
    );

    if (!isSelf && !isPrivileged) {
      return res.status(403).json({ message: "Forbidden access." });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: `No user found with _id: ${id}` });
    }

    res.status(200).json({
      message: `User with _id: ${id} fetched successfully!`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user by _id",
      error: error.message,
    });
  }
});

export const handleDeleteUserById = catchAsyncHandler(async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ObjectId format" });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: `No user found with _id: ${id}` });
    }

    res.status(200).json({
      message: `User with _id: ${id} deleted successfully.`,
      data: deletedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting user by _id",
      error: error.message,
    });
  }
});

export const handleUpdateUserById = catchAsyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = { ...req.body };
    if (req.file?.filename) {
      updateData.profile_picture_url = req.file.filename;
    }
    const currentUser = req.user;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid _id format" });
    }

    if (req.user._id.toString() !== id && req.user.user_type !== "admin") {
      return res.status(403).json({ message: "Forbidden: Not your profile." });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: `No user found with _id: ${id}` });
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Update data is required" });
    }

    if (
      currentUser._id.toString() !== id &&
      currentUser.user_type !== "admin"
    ) {
      return res.status(403).json({
        message: "Unauthorized: You can only update your own profile.",
      });
    }

    delete updateData.password;
    delete updateData.email;

    if (currentUser.user_type !== "admin") {
      delete updateData.user_type;
    }

    const allowedFields = ["name", "bio", "profile_picture_url", "user_type"];
    Object.keys(updateData).forEach((key) => {
      if (!allowedFields.includes(key)) {
        delete updateData[key];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: `User with _id: ${id} not found` });
    }

    res.status(200).json({
      message: `User with _id: ${id} updated successfully`,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating user by _id",
      error: error.message,
    });
  }
});
