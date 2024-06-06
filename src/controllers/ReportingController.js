import Sequelize, { Op } from "sequelize";
import model from "../models";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";

const { Order, User } = model;

export default {
  async agentReport(req, res) {
    try {
      const { startPeriod, endPeriod } = req.body;
      const where = {
        attributes: [
          "user_id",
          [Sequelize.fn("COUNT", Sequelize.col("Order.id")), "total"],
          [
            Sequelize.fn(
              "SUM",
              Sequelize.literal(
                'CASE WHEN "Order"."status" = \'Confirmed\' THEN 1 ELSE 0 END'
              )
            ),
            "confirmed",
          ],
          [
            Sequelize.fn(
              "SUM",
              Sequelize.literal(
                'CASE WHEN "Order"."status" = \'No Pick\' THEN 1 ELSE 0 END'
              )
            ),
            "no_pick",
          ],
        ],
        include: [
          {
            model: User,
            as: "user",
            attributes: ["name"],
          },
        ],
        where: {
          createdAt: {
            [Op.gte]: startPeriod,
            [Op.lte]: endPeriod,
          },
          user_id: {
            [Op.ne]: null,
          },
        },
        group: ["Order.user_id", "user.id"],
      };
      const report = await Order.findAll(where);
      return sendSuccessResponse(
        res,
        200,
        { report, startPeriod, endPeriod },
        "Agent report"
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
