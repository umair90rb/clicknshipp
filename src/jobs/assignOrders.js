import { schedule } from "node-cron";
const { Op } = require("sequelize");
import model from "../models";
import logger from "../middleware/logger";
const { Order, User, Role, Permission } = model;

function getFormattedTimestampFromYesterday() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  return yesterday;
}

const every5Sec = "*/5 * * * * *";
const every20Min = " */20 * * * *";
const everyMorningAt8Am = "0 8 * * *";

schedule(every20Min, async () => {
  try {
    console.log("Order assign job started at " + new Date().toISOString());
    const dateFromYesterday8AM = getFormattedTimestampFromYesterday();
    const agents = await User.findAll({
      where: {
        status: "active",
      },
      include: [
        {
          model: Role,
          as: "roles",
          include: [
            {
              model: Permission,
              as: "permissions",
              where: { name: "assign-orders" },
            },
          ],
        },
      ],
    });
    console.log(agents.length, "agents to assign order");
    const unassignedOrders = await Order.findAll({
      where: {
        status: "Received",
        user_id: null,
      },
      attributes: {
        exclude: ["data"],
      },
    });
    console.log(`No of unassigned orders:${unassignedOrders.length}`);
    if (!unassignedOrders.length) {
      console.warn("No order assigned because no order meet criteria");
      return;
    }
    const numberOfOrderForAgents = Math.floor(
      unassignedOrders.length / agents.length
    );
    Promise.all(
      agents.map(async (agent, index) => {
        const start = index > 0 ? index * numberOfOrderForAgents + 1 : index;
        const end = start + numberOfOrderForAgents + 1;
        const ordersForThisAgent = unassignedOrders.slice(start, end);
        const ordersIds = ordersForThisAgent.map((order) => order.id);
        const updated = await Order.update(
          { status: "Assigned", user_id: agent.id, updatedAt: new Date() },
          {
            where: {
              id: { [Op.in]: ordersIds },
            },
          }
        );
      })
    );
  } catch (error) {
    logger.error(error.message);
  }
});
