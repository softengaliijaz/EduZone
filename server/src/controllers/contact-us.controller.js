import ContactUs from "../models/contact-us.model.js";
import Notification from "../models/notifications.model.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { catchAsyncHandler } from "../middlewares/error_middleware.js";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendContactMessage = catchAsyncHandler(async (req, res) => {
  const { fullname, email, subject, message } = req.body;
  const cleanName = typeof fullname === "string" ? fullname.trim() : "";
  const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  const cleanSubject = typeof subject === "string" ? subject.trim() : "";
  const cleanMessage = typeof message === "string" ? message.trim() : "";

  if (cleanName.length < 2 || cleanName.length > 100) {
    return res.status(400).json({ message: "Name must be between 2 and 100 characters." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || cleanEmail.length > 254) {
    return res.status(400).json({ message: "Enter a valid email address." });
  }
  if (cleanSubject.length < 3 || cleanSubject.length > 150) {
    return res.status(400).json({ message: "Subject must be between 3 and 150 characters." });
  }
  if (cleanMessage.length < 10 || cleanMessage.length > 5000) {
    return res.status(400).json({ message: "Message must be between 10 and 5000 characters." });
  }

  const savedContact = await ContactUs.create({
    fullname: cleanName,
    email: cleanEmail,
    subject: cleanSubject,
    message: cleanMessage,
  });

  let emailSent = false;
  if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
      });
      const htmlContent = await ejs.renderFile(
        path.join(__dirname, "../../template/emails/contact_message.ejs"),
        { fullname: cleanName, email: cleanEmail, subject: cleanSubject, message: cleanMessage },
      );
      await transporter.sendMail({
        from: `EduZone Contact <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER,
        subject: `Contact form: ${cleanSubject}`,
        html: htmlContent,
        replyTo: cleanEmail,
      });
      emailSent = true;
    } catch (error) {
      // The submission is persisted; a mail outage must not invite duplicate submissions.
      console.error("Contact notification email failed:", error.message);
    }
  }

  try {
    await Notification.create({
      message: `Contact form submission from ${cleanName}`,
      type: "custom",
      link: "/admin/contact-us",
    });
  } catch (error) {
    console.error("Contact notification record failed:", error.message);
  }

  return res.status(201).json({
    message: "Your message was received successfully.",
    data: { id: savedContact._id, emailSent },
  });
});
