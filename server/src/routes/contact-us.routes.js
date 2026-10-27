import express from "express";
const router = express.Router();
import { sendContactMessage } from "../controllers/contact-us.controller.js";
import { createRateLimiter } from "../middlewares/security_middleware.js";

// Public forms need a tighter limit than ordinary API reads.
router.post(
  "/send-message",
  createRateLimiter({ windowMs: 15 * 60 * 1000, max: 10 }),
  sendContactMessage,
);

export default router;
