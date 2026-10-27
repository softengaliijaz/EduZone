import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToDatabase from "./src/config/server.js";
import registeredRouters from "./src/routes/index.js";
import { globalErrorHandler } from "./src/middlewares/global_error_handler.js";
import env, { getProductionEnvIssues } from "./src/config/env.js";
import {
  createRateLimiter,
  sanitizeBody,
  securityHeaders,
} from "./src/middlewares/security_middleware.js";

const app = express();
const PORT = env.port;

if (env.nodeEnv === "production") {
  const issues = getProductionEnvIssues();
  if (issues.length > 0) {
    throw new Error(`Invalid production environment: ${issues.join("; ")}.`);
  }
}

const clientUrl = env.clientUrl;

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        clientUrl,
        "http://localhost:5173",
        "https://eduzone-web.vercel.app",
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

/* ===================== MIDDLEWARE ===================== */
app.set("trust proxy", 1);
app.use(securityHeaders);
app.use(createRateLimiter({ windowMs: 15 * 60 * 1000, max: 300 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(sanitizeBody);

/* ===================== STATIC ===================== */
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    maxAge: "7d",
    setHeaders: (res) => {
      res.setHeader("Cache-Control", "public, max-age=604800");
    },
  }),
);

/* ===================== VIEWS ===================== */
app.set("json spaces", 2);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "template", "custom"));

app.get("/", (req, res) => {
  res.render("documentation", {
    data: {
      greeting: "Hello World!",
      environment: process.env.NODE_ENV || "development",
      serverTime: new Date().toISOString(),
      version: process.env.npm_package_version || "1.0.0",
    },
    documentation: "https://documenter.getpostman.com/view/32471550/2sB34kEzEc",
    uptime: process.uptime(),
  });
});

app.get("/health", (_req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;
  return res.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? "ok" : "unavailable",
    database: databaseConnected ? "connected" : "disconnected",
  });
});

/* ===================== ROUTES ===================== */
registeredRouters(app);

/* ===================== ERROR HANDLER ===================== */
app.use(globalErrorHandler);

/* ===================== DB + SERVER ===================== */
await connectToDatabase(env.dbUrl);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});
