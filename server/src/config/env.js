const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const trimSlashes = (value = "") => value.replace(/\/+$/, "");

export const getProductionEnvIssues = (variables = process.env) => {
  const issues = [];

  if (!variables.DB_CONFIGURATION?.trim()) {
    issues.push("DB_CONFIGURATION is missing");
  }

  const accessTokenSecret = variables.ACCESS_TOKEN_SECRET || "";
  const refreshTokenSecret = variables.REFRESH_TOKEN_SECRET || "";

  if (!accessTokenSecret.trim()) {
    issues.push("ACCESS_TOKEN_SECRET is missing");
  }
  if (!refreshTokenSecret.trim()) {
    issues.push("REFRESH_TOKEN_SECRET is missing");
  }
  if (
    accessTokenSecret &&
    refreshTokenSecret &&
    accessTokenSecret === refreshTokenSecret
  ) {
    issues.push(
      "ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be different",
    );
  }
  if (!variables.CLIENT_URL?.trim()) {
    issues.push("CLIENT_URL is missing");
  }
  if (!variables.BASE_URL?.trim()) {
    issues.push("BASE_URL is missing");
  }

  return issues;
};

const env = {
  get nodeEnv() {
    return process.env.NODE_ENV || "development";
  },
  get port() {
    return toNumber(process.env.PORT, 5000);
  },
  get dbUrl() {
    return process.env.DB_CONFIGURATION || "";
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
