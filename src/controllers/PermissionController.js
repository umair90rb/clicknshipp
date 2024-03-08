import model from "../models";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";

const { Permission } = model;

export default {
  async permissions(req, res) {
    try {
      const permissions = await Permission.findAll();
      return sendSuccessResponse(res, 200, { permissions });
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        "Could not perform operation at this time, kindly try again later.",
        e
      );
    }
  },
  async permission(req, res) {
    try {
      const { id } = req.params;
      const permissions = await Permission.findAll();
      return sendSuccessResponse(res, 200, { permissions });
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        "Could not perform operation at this time, kindly try again later.",
        e
      );
    }
  },
};
