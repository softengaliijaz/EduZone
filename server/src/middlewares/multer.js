import multer from "multer";
import path from "path";
import { getUploadsDirectory } from "../config/uploads.js";

// config of storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, getUploadsDirectory());
  },
  // cb > callback
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // extension name
    const ext = path.extname(file.originalname);

    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

export let upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const validFieldNames = ["image", "profile_picture_url"];
    if (
      validFieldNames.includes(file.fieldname) &&
      file.mimetype.startsWith("image/")
    ) {
      cb(null, true);
    } else {
      cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
    }
  },
});

export const uploadSingle = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    if (file.fieldname === "image" && file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
    }
  },
}).single("image");
