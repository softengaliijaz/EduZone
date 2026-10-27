import mongoose from "mongoose";
import getRandomBio from "../utils/constants.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    refresh_token_hash: {
      type: String,
      default: null,
      select: false,
    },

    user_type: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
      required: true,
    },

    profile_picture_url: {
      type: String,
      default: null,
      trim: true,
    },

    bio: {
      type: String,
      default: getRandomBio,
      maxlength: 300,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
