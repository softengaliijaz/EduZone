export const BASE_URL =
  import.meta.env.VITE_BASE_URL ||
  (import.meta.env.PROD ? "" : "http://localhost:5000");

export const getUploadUrl = (file) => {
  if (!file) return null;
  if (/^(https?:|blob:|data:)/i.test(file)) return file;
  const filename = file.replace(/^\/?uploads\//, "").replace(/^\/+/, "");
  return `${BASE_URL}/uploads/${filename}`;
};
