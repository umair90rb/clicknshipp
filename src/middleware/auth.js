import { sendErrorResponse } from "../utils/sendResponse";
import jwt from "jsonwebtoken";

export default async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return sendErrorResponse(res, 401, "Authentication required");
    }

    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    if (!token || token === "") {
      return sendErrorResponse(res, 401, "Authentication Failed");
    }
    const decoded = jwt.verify(token, "your-secret-key");
    const userId = decoded.userId;
    req.user = { id: userId };
    next();
  } catch (e) {
    console.error(e, "in authjs");
    return sendErrorResponse(res, 401, "Authentication Failed", e);
  }
};
