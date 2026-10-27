import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const getUploadsDirectory = () =>
  path.resolve(
    process.env.UPLOADS_DIR || path.join(__dirname, "../../uploads"),
  );

export const ensureUploadsDirectory = () => {
  fs.mkdirSync(getUploadsDirectory(), { recursive: true });
};
