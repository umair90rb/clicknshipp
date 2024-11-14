import { schedule } from 'node-cron';
const { Op, literal } = require('sequelize');
import model from '../models';
import logger from '../middleware/logger';
import { getEndOfDay, subtractDaysFromToday } from '../helpers/pgDateFormat';
import deliveryStatusSyncQueue from '../queues/deliveryStatusSyncQueue';
const { Delivery } = model;

const yesterdayTillDayEnd = getEndOfDay(subtractDaysFromToday(1));

const every30Sec = '*/30 * * * * *';
const every20Min = ' */20 * * * *';
const every10Min = ' */10 * * * *';
const everyMorningAt8Am = '0 8 * * *';

schedule(every30Sec, async () => {
  // schedule(every10Min, async () => {
  try {
    const pendingJobs = await deliveryStatusSyncQueue.count();
    if (pendingJobs) {
      return;
    }
    let deliveriesToTrack = await Delivery.findAll({
      where: {
        status: {
          [Op.notIn]: ['Delivered', 'Manual Booking'],
        },
        createdAt: {
          [Op.lt]: yesterdayTillDayEnd,
        },
        updatedAt: {
          [Op.lt]: yesterdayTillDayEnd,
        },
      },
      attributes: ['id', 'cn', 'account_id', 'order_id'],
      order: [['createdAt', 'DESC']],
      limit: 10,
    });
    if (!deliveriesToTrack?.length) {
      deliveriesToTrack = await Delivery.findAll({
        where: {
          service: {
            [Op.not]: 'digi',
          },
          status: {
            [Op.notIn]: ['Delivered', 'Manual Booking'],
          },
          createdAt: {
            [Op.lt]: yesterdayTillDayEnd,
          },
          updatedAt: {
            [Op.lt]: literal("NOW() - INTERVAL '6 HOURS'"),
          },
        },
        attributes: ['id', 'cn', 'account_id', 'order_id'],
        order: [['createdAt', 'DESC']],
        limit: 10,
      });
    }
    if (!deliveriesToTrack?.length) {
      console.warn('No order to track!');
      return;
    }
    await deliveryStatusSyncQueue.addBulk(
      deliveriesToTrack.map((data) => ({
        name: 'deliveryStatusSyncQueue',
        data,
        opts: { removeOnComplete: true, removeOnFail: true },
      }))
    );
  } catch (error) {
    console.log(error);
    logger.error(`Error in track orders jobs ${error}`);
  }
});
