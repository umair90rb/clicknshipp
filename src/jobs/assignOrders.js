import { schedule } from "node-cron";
const { Op } = require("sequelize");
import model from "../models";
const { Order, User, Role, Permission } = model;

function getFormattedTimestampFromYesterday() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  return yesterday;
}

const every5Sec = "*/5 * * * * *";
const everyMin = " * * * * *";
const everyMorningAt8Am = "0 8 * * *";

schedule(everyMorningAt8Am, async () => {
  try {
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
              where: { name: "assign-orders" },
            },
          ],
        },
      ],
    });
    console.log(agents, "agents to assign order");
    const unassignedOrders = await Order.findAll({
      where: {
        status: "Received",
        user_id: null,
        created_at: {
          [Op.gte]: dateFromYesterday8AM,
        },
      },
      attributes: {
        exclude: ["data"],
      },
    });
    console.log(`${unassignedOrders.length}`);
    if (!unassignedOrders.length) {
      console.warn("in order assign job no order meet critera");
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
    console.error(error, "in order assign job");
  }
});
