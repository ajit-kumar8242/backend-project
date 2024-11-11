// const asyncHandler = () => {
//   () => {};
// };
// const asyncHandler = (func) => () => {};
// asyncHandler = (func) => async () => {};
// this is type one using try catch

// const asyncHandler = (func) => async (req, res, next) => {};
// try {
//   await func(req, res, next);
// } catch (error) {
//   res.status(err.code || 400).json({
//     success: false,
//     message: err.message,
//   });
// }
// export { asyncHandler };
const asyncHandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};
export { asyncHandler };
