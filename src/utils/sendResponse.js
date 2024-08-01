export const sendErrorResponse = (
  res,
  code,
  errorMessage,
  e = null,
  data = null
) =>
  res.status(code).send({
    status: "error",
    error: errorMessage,
    e: e?.toString(),
    data,
  });

export const sendSuccessResponse = (res, code, data, message = "Successful") =>
  res.status(code).send({
    status: "success",
    ...data,
    message,
  });
