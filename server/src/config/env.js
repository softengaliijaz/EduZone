const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const trimSlashes = (value = "") => value.replace(/\/+$/, "");

const env = {
  get nodeEnv() {
    return process.env.NODE_ENV || "development";
  },
  get port() {
    return toNumber(process.env.PORT, 5000);
  },
  get dbUrl() {
    return process.env.DB_CONFIGURATION || process.env.MONGO_URI || "";
  },
  get appUrl() {
    return trimSlashes(process.env.BASE_URL || "http://localhost:5000");
  },
  get clientUrl() {
    return trimSlashes(process.env.CLIENT_URL || "http://localhost:5173");
  },
  get accessTokenSecret() {
    return process.env.ACCESS_TOKEN_SECRET || process.env.SECRET_KEY || "";
  },
  get refreshTokenSecret() {
    return process.env.REFRESH_TOKEN_SECRET || process.env.SECRET_KEY || "";
  },
  get accessTokenExpiresIn() {
    return process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
  },
  get refreshTokenExpiresIn() {
    return process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";
  },
  get authCookieSecure() {
    return (
      process.env.AUTH_COOKIE_SECURE === "true" ||
      process.env.NODE_ENV === "production"
    );
  },
  get hasDistinctTokenSecrets() {
    return (
      Boolean(this.accessTokenSecret) &&
      Boolean(this.refreshTokenSecret) &&
      this.accessTokenSecret !== this.refreshTokenSecret
    );
  },
};

export default env;
