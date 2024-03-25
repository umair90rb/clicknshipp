import model from "../models";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";

const { Order, OrderItem, Item } = model;

export default {
  async orderProducts(req, res) {
    try {
      const { start, end } = req.body;
      return sendSuccessResponse(
        res,
        201,
        { start, end },
        "All registered users"
      );
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
