import sequelize, { Sequelize } from "sequelize";
import model from "../models";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";

const Op = sequelize.Op;
const { Order, OrderItem, Delivery } = model;

export default {
  async stats(req, res) {
    try {
      const { startPeriod, endPeriod } = req.query;
      const result = await Order.findAll({
        attributes: [
          [Sequelize.fn("COUNT", Sequelize.col("*")), "totalOrders"],
          [
            Sequelize.fn(
              "SUM",
              Sequelize.literal(
                "CASE WHEN status = 'Confirmed' THEN 1 ELSE 0 END"
              )
            ),
            "confirmedOrders",
          ],
          [
            Sequelize.fn(
              "SUM",
              Sequelize.literal("CASE WHEN status = 'Booked' THEN 1 ELSE 0 END")
            ),
            "bookedOrders",
          ],
          [
            Sequelize.fn("SUM", Sequelize.col("total_price")),
            "totalSalesValue",
          ],
        ],
        where: {
          createdAt: {
            [Op.and]: {
              [Op.gte]: startPeriod,
              [Op.lte]: endPeriod,
            },
          },
        },
      });

      const stats = result[0].dataValues;
      return sendSuccessResponse(res, 201, { stats }, "Dashboard stats.");
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
