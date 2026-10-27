import mongoose from "mongoose";
import EduZoneBenefit from "../models/edu-benefits.model.js";
import { catchAsyncHandler } from "../middlewares/error_middleware.js";

export const handleBenefitByGetAll = catchAsyncHandler(async (_req, res) => {
  try {
    const data = await EduZoneBenefit.find({});
    if (!data.length) {
      return res.status(200).json({ message: "No benefits found.", data: [] });
    }
    return res
      .status(200)
      .json({ message: "Data fetched successfully.", data: data });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
});

export const handleBenefitById = catchAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format." });
    }

    const data = await EduZoneBenefit.findById(id);

    if (!data) {
      return res.status(404).json({ message: "Data not found.", data: null });
    }

    return res
      .status(200)
      .json({ message: "Data fetched successfully.", data: data });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
});

export const createBenefit = catchAsyncHandler(async (req, res) => {
  try {
    let { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required." });
    }

    title = title.trim();
    description = description.trim();

    if (title.length < 3 || description.length < 10) {
      return res.status(400).json({
        message:
          "Title must be at least 3 characters and description at least 10 characters.",
      });
    }

    const existingBenefit = await EduZoneBenefit.findOne({ title });

    if (existingBenefit) {
      return res
        .status(400)
        .json({ message: "Benefit with this title already exists." });
    }

    const newBenefit = new EduZoneBenefit({ title, description });
    const savedBenefit = await newBenefit.save();

    return res.status(201).json({
      message: "Benefit created successfully.",
      data: savedBenefit,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
});

export const handleUpdateBenefitById = catchAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    let { title, description } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format." });
    }

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required." });
    }

    title = title.trim();
    description = description.trim();

    if (title.length < 3 || description.length < 10) {
      return res.status(400).json({
        message:
          "Title must be at least 3 characters and description at least 10 characters.",
      });
    }

    const updatedData = await EduZoneBenefit.findByIdAndUpdate(
      id,
      {
        title,
        description,
      },
      { new: true, runValidators: true },
    );

    if (!updatedData) {
      return res.status(404).json({ message: "Benefit not found." });
    }

    return res.status(200).json({
      message: "Benefit updated successfully.",
      data: updatedData,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
});

export const handleDeleteBenefitById = catchAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format." });
    }

    const deletedBenefit = await EduZoneBenefit.findByIdAndDelete(id);

    if (!deletedBenefit) {
      return res.status(404).json({ message: "Benefit not found." });
    }

    return res.status(200).json({
      message: "Benefit deleted successfully.",
      data: deletedBenefit,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
});
