import sequelize, { Sequelize } from "sequelize";
import model from "../models";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";

const Op = sequelize.Op;
const { Order, OrderItem, Delivery } = model;

export default {
  async stats(req, res) {
    try {
      const { startPeriod, endPeriod } = req.query;
      console.log(startPeriod, endPeriod, "startPeriod, endPeriod");
      const result = await Order.findAll({
        attributes: [
          [Sequelize.fn("COUNT", Sequelize.col("*")), "totalOrders"],
          [
            Sequelize.fn(
              "SUM",
              Sequelize.literal(
                "CASE WHEN status = 'Confirmed' OR status = 'Booked' THEN 1 ELSE 0 END"
              )
            ),
            "confirmedOrders",
          ],
          [
            Sequelize.fn(
              "SUM",
              Sequelize.literal(
                "CASE WHEN status = 'No Pick' OR status = 'Payment Pending' THEN 1 ELSE 0 END"
              )
            ),
            "noPickOrders",
          ],
          [
            Sequelize.fn(
              "SUM",
              Sequelize.literal("CASE WHEN status = 'Cancel' THEN 1 ELSE 0 END")
            ),
            "cancelOrders",
          ],
          [
            Sequelize.fn(
              "SUM",
              Sequelize.literal(
                "CASE WHEN status = 'Assigned' THEN 1 ELSE 0 END"
              )
            ),
            "assignedOrders",
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
          assignedAt: {
            [Op.gte]: startPeriod,
            [Op.lte]: endPeriod,
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
