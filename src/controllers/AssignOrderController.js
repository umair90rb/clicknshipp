import { Op, Sequelize } from "sequelize";
import model from "../models";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";
import _orderService from "../services/OrderService";

const { Order } = model;

const ORDER_TYPE = {
  unassigned: { user_id: null },
  assigned_not_confirmed: {
    [Op.and]: [{ user_id: { [Op.ne]: null } }, { status: "Assigned" }],
  },
};

export default {
  async orderFiltered(req, res) {
    try {
      const { chanel, brand, startPeriod, endPeriod, users, type } = req.body;

      let query = {
          attributes: ["id"],
        },
        where = {};
      if (chanel && chanel.length) {
        where["chanel_id"] = { [Op.in]: chanel };
      }
      if (users && users.length) {
        where["user_id"] = { [Op.in]: users };
      }
      if (brand && brand.length) {
        where["brand_id"] = { [Op.in]: brand };
      }
      if (startPeriod) {
        where["createdAt"] = { [Op.gte]: startPeriod };
      }
      if (endPeriod) {
        where["createdAt"] = { ...where["createdAt"], [Op.lte]: endPeriod };
      }
      if (type && type !== "All") {
        let _where = { ...where, ...ORDER_TYPE[type] };
        where = _where;
      }
      if (Object.keys(where).length) {
        query["where"] = where;
      }
      const orders = await Order.findAll(query);
      if (orders) {
        return sendSuccessResponse(
          res,
          200,
          {
            orders: orders && orders.map((order) => order.id),
          },
          "Filtered orders"
        );
      }
      return sendErrorResponse(res, 404, "No data found!");
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
