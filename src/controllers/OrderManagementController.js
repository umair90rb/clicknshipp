import model from "../models";
import { Op } from "sequelize";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";

const { Order } = model;

export default {
  async assignOrders(req, res) {
    try {
      const { orderIds, agentIds } = req.body;
      let numberOfOrderForAgents = 0;
      if (agentIds.length > 1) {
        numberOfOrderForAgents = Math.floor(orderIds.length / agentIds.length);
      } else {
        numberOfOrderForAgents = orderIds.length;
      }
      await Promise.all(
        agentIds.map(async (agentId, index) => {
          const start = index > 0 ? index * numberOfOrderForAgents + 1 : index;
          const end = start + numberOfOrderForAgents + 1;
          const orderIdsForThisAgent = orderIds.slice(start, end);
          const ordersIds = orderIdsForThisAgent.map((id) => id);
          const updated = await Order.update(
            { status: "Assigned", user_id: agentId, updatedAt: new Date() },
            {
              where: {
                id: { [Op.in]: ordersIds },
              },
            }
          );
        })
      );
      return sendSuccessResponse(res, 200, {}, "Orders assigned successfully.");
    } catch (error) {
      console.error(error, "in order assign controller function");
      return sendErrorResponse(
        res,
        500,
        error.message || "Something goes wrong!",
        error
      );
    }
  },
};
