import crypto from "crypto";
import jwt from "jsonwebtoken";
import env from "../config/env.js";

const assertSecrets = () => {
  if (!env.accessTokenSecret || !env.refreshTokenSecret) {
    throw new Error(
      "Token secret missing. Set ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET.",
    );
  }
  if (env.nodeEnv === "production" && !env.hasDistinctTokenSecrets) {
    throw new Error(
      "Production requires distinct ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET values.",
    );
  }
};

export const buildTokenPayload = (user) => ({
  userId: user._id.toString(),
  user_type: user.user_type,
});

export const signAccessToken = (user) => {
  assertSecrets();
  return jwt.sign(buildTokenPayload(user), env.accessTokenSecret, {
    expiresIn: env.accessTokenExpiresIn,
  });
};

export const signRefreshToken = (user) => {
  assertSecrets();
  return jwt.sign(buildTokenPayload(user), env.refreshTokenSecret, {
    expiresIn: env.refreshTokenExpiresIn,
  });
};

export const verifyAccessToken = (token) =>
  jwt.verify(token, env.accessTokenSecret);

export const verifyRefreshToken = (token) =>
  jwt.verify(token, env.refreshTokenSecret);

export const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const accessCookieOptions = {
  httpOnly: true,
  secure: env.authCookieSecure,
  sameSite: env.authCookieSecure ? "none" : "lax",
  maxAge: 15 * 60 * 1000,
};

export const refreshCookieOptions = {
  httpOnly: true,
  secure: env.authCookieSecure,
  sameSite: env.authCookieSecure ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
