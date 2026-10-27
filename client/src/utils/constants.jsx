export const BASE_URL =
  import.meta.env.VITE_BASE_URL ||
  (import.meta.env.PROD ? "" : "http://localhost:5000");

export const getUploadUrl = (file) => {
  if (!file) return null;
  if (/^(blob:|data:)/i.test(file)) return file;

  let uploadPath = file;
  if (/^https?:/i.test(file)) {
    const url = new URL(file);
    const uploadsIndex = url.pathname.indexOf("/uploads/");
    if (uploadsIndex === -1) return file;
    uploadPath = url.pathname.slice(uploadsIndex + "/uploads/".length);
  }

  const filename = uploadPath
    .replace(/^\/?uploads\//, "")
    .replace(/^\/+/, "");
  return `${BASE_URL.replace(/\/+$/, "")}/uploads/${filename}`;
};
