import _orderService from "../services/OrderService";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";

export default {
  async search(req, res) {
    try {
      const { query, tag } = req.body;
      let result = await _orderService.findOrdersBy(tag, query);
      if (!result || !result.length) {
        return sendErrorResponse(res, 404, "No data found!");
      }
      return sendSuccessResponse(res, 200, {
        data: { query, tag, result },
      });
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
