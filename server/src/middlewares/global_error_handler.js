export const globalErrorHandler = (err, req, res, next) => {
  const statusCode =
    err.statusCode ||
    err.status ||
    (err.name === "ValidationError" || err.name === "CastError" ? 400 : 500);
  const isProduction = process.env.NODE_ENV === "production";
  const message =
    statusCode >= 500 && isProduction
      ? "Internal Server Error"
      : err.message || "Internal Server Error";

  console.error(`[Error] ${statusCode} - ${message}`);
  if (!isProduction && err.stack) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    details: !isProduction ? err.details : undefined,
    stack: !isProduction ? err.stack : undefined,
  });
};
