// Desc: Error handler middleware
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errors = err.errors || [];
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    message,
    errors,
  });
};

module.exports = { errorHandler };
