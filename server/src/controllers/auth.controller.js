import { catchAsyncHandler } from "../middlewares/error_middleware.js";
import User from "../models/auth.model.js";
import {
  compareAndSecurePassword,
  hashAuthPassword,
  formatUserResponse,
} from "../utils/helpers.js";
import { sendEmail } from "../utils/node_mailer.js";
import Notification from "../models/notifications.model.js";
import {
  accessCookieOptions,
  hashToken,
  refreshCookieOptions,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/token.js";
import {
  validateLoginBody,
  validateRegisterBody,
} from "../validators/auth.validators.js";
import { sendError, sendSuccess } from "../utils/api_response.js";

const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie("access_token", accessToken, accessCookieOptions);
  res.cookie("refresh_token", refreshToken, refreshCookieOptions);
  // Backward compatibility with existing frontend/local usage.
  res.cookie("token", accessToken, accessCookieOptions);
};

const clearAuthCookies = (res) => {
  const cleanupOptions = {
    httpOnly: true,
    secure: accessCookieOptions.secure,
    sameSite: accessCookieOptions.sameSite,
  };

  res.clearCookie("access_token", cleanupOptions);
  res.clearCookie("refresh_token", cleanupOptions);
  res.clearCookie("token", cleanupOptions);
};

export const registerUser = catchAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const validationErrors = validateRegisterBody(req.body || {});

  if (validationErrors.length) {
    return sendError(res, {
      statusCode: 400,
      message: "Validation failed.",
      errors: validationErrors,
    });
  }

  const existingUser = await User.findOne({
    email: email.toLowerCase().trim(),
  });
  if (existingUser) {
    return sendError(res, {
      statusCode: 409,
      message: "A user with this email already exists.",
    });
  }

  const hashedPassword = await hashAuthPassword(password);
  const newUser = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
  });

  const accessToken = signAccessToken(newUser);
  const refreshToken = signRefreshToken(newUser);

  newUser.refresh_token_hash = hashToken(refreshToken);
  await newUser.save();

  const userData = formatUserResponse(newUser);

  setAuthCookies(res, accessToken, refreshToken);

  sendEmail(newUser.email, "Welcome to EduZone", "send_mail", userData).catch(
    (emailError) => {
      console.error("Welcome email failed:", emailError.message);
    },
  );

  Notification.create({
    userId: newUser._id,
    message: `Welcome ${newUser.name}! Your account has been created.`,
    type: "info",
    link: "/user/learning-room",
  }).catch((notificationError) => {
    console.error("Notification creation failed:", notificationError.message);
  });

  return sendSuccess(res, {
    statusCode: 201,
    message: "User registered successfully.",
    data: {
      user: userData,
      accessToken,
    },
  });
});

export const loginUser = catchAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const validationErrors = validateLoginBody(req.body || {});

  if (validationErrors.length) {
    clearAuthCookies(res);
    return sendError(res, {
      statusCode: 400,
      message: "Validation failed.",
      errors: validationErrors,
    });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
    "+password +refresh_token_hash",
  );

  if (!user) {
    clearAuthCookies(res);
    return sendError(res, {
      statusCode: 400,
      message: "Invalid email or password.",
    });
  }

  const isValid = await compareAndSecurePassword(password, user.password);
  if (!isValid) {
    clearAuthCookies(res);
    return sendError(res, {
      statusCode: 400,
      message: "Invalid email or password.",
    });
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  user.refresh_token_hash = hashToken(refreshToken);
  await user.save();

  const userData = formatUserResponse(user);

  setAuthCookies(res, accessToken, refreshToken);

  return sendSuccess(res, {
    message: "User logged in successfully.",
    data: {
      user: userData,
      accessToken,
    },
  });
});

export const refreshAccessToken = catchAsyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refresh_token || req.body?.refreshToken;

  if (!refreshToken) {
    clearAuthCookies(res);
    return sendError(res, {
      statusCode: 401,
      message: "Refresh token is required.",
    });
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (_error) {
    clearAuthCookies(res);
    return sendError(res, {
      statusCode: 401,
      message: "Invalid or expired refresh token.",
    });
  }

  const user = await User.findById(decoded.userId).select(
    "-password +refresh_token_hash",
  );
  if (!user || !user.refresh_token_hash) {
    clearAuthCookies(res);
    return sendError(res, {
      statusCode: 401,
      message: "Refresh session is invalid.",
    });
  }

  if (user.refresh_token_hash !== hashToken(refreshToken)) {
    clearAuthCookies(res);
    return sendError(res, {
      statusCode: 401,
      message: "Refresh token mismatch.",
    });
  }

  const newAccessToken = signAccessToken(user);
  const newRefreshToken = signRefreshToken(user);
  user.refresh_token_hash = hashToken(newRefreshToken);
  await user.save();

  setAuthCookies(res, newAccessToken, newRefreshToken);

  return sendSuccess(res, {
    message: "Token refreshed successfully.",
    data: {
      accessToken: newAccessToken,
      user: formatUserResponse(user),
    },
  });
});

export const logoutUser = catchAsyncHandler(async (req, res) => {
  if (req.user?._id) {
    await User.findByIdAndUpdate(req.user._id, { refresh_token_hash: null });
  }

  clearAuthCookies(res);

  return sendSuccess(res, {
    message: "User logged out successfully.",
  });
});

export const getUserProfile = catchAsyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    return sendError(res, {
      statusCode: 401,
      message: "Unauthorized access.",
    });
  }

  const user = await User.findById(userId).select("-password");
  if (!user) {
    return sendError(res, {
      statusCode: 404,
      message: "User not found.",
    });
  }

  return sendSuccess(res, {
    message: "User profile fetched successfully.",
    data: formatUserResponse(user),
  });
});

// Assign Role
export const assignUserRole = catchAsyncHandler(async (req, res) => {
  const { userId, newRole } = req.body;

  if (!userId || !newRole) {
    return res
      .status(400)
      .json({ message: "User ID and new role are required." });
  }

  const validRoles = ["student", "admin", "instructor"];
  if (!validRoles.includes(newRole)) {
    return res.status(400).json({ message: `Invalid role: '${newRole}'` });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  user.user_type = newRole;
  await user.save();

  return res.status(200).json({
    message: `Role updated successfully to '${newRole}'`,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      user_type: user.user_type,
    },
  });
});
