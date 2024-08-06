import { schedule } from "node-cron";
const { Op } = require("sequelize");
import model from "../models";
import logger from "../middleware/logger";
import { getEndOfDay, getStartOfDay } from "../helpers/pgDateFormat";
import BookingService from "../services/BookingService";
const { Delivery, DeliveryServiceAccounts, Tokens } = model;

function getFormattedTimestampFromYesterday() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday;
}

const yesterday = getFormattedTimestampFromYesterday(1);
const yesterdayStartOfDay = getStartOfDay(yesterday);
const yesterdayEndOfDay = getEndOfDay(yesterday);

const every5Sec = "*/5 * * * * *";
const every20Min = " */20 * * * *";
const everyMorningAt8Am = "0 8 * * *";

const bookingServices = new BookingService();

schedule(everyMorningAt8Am, async () => {
  try {
    console.log("Order track job started at " + new Date().toISOString());
    const deliveriesToTrack = await Delivery.findAll({
      where: {
        status: ["Booked", "Dispatched", "In Transit"],
        [Op.or]: [
          {
            updatedAt: {
              [Op.lte]: yesterdayEndOfDay,
            },
          },
          { tracking_status: [null, "Failed"] },
        ],
      },
      include: {
        model: DeliveryServiceAccounts,
        as: "account",
        include: {
          as: "tokens",
          model: Tokens,
        },
      },
    });
    console.log(`No of orders for tracking: ${deliveriesToTrack.length}`);
    if (!deliveriesToTrack?.length) {
      console.warn("No order to track!");
      return;
    }

    const track = (deliveryToTrack) => {
      return new Promise(async (resolve, reject) => {
        try {
          const courierService = bookingServices.getCourierService(
            deliveryToTrack.courier
          );
          const { isSuccess, history, remarks } =
            await courierService.checkParcelStatus(
              deliveryToTrack.cn,
              deliveryToTrack.account
            );
          let updateData = {
            updatedAt: new Date().toISOString(),
            tracking_status: "Failed",
          };
          if (isSuccess) {
            updateData["tracking"] = JSON.stringify(history) || remarks;
            updateData["tracking_status"] = "Success";
          }
          await deliveryToTrack.update(updateData);
          resolve("done");
        } catch (error) {
          logger.error(
            `Error updating delivery ${deliveryToTrack.id}: ${error.stack}`
          );
          reject(error);
        }
      });
    };
    const promises = [];
    for (let i = 0; i < deliveriesToTrack.length; i++) {
      const deliveryToTrack = deliveriesToTrack[i];
      promises.push(track(deliveryToTrack));
    }
    await Promise.all(promises);
  } catch (error) {
    logger.error(`Error updating delivery ${deliveryToTrack.id}: ${error}`);
  }
});
