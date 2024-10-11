import { schedule } from 'node-cron';
const { Op } = require('sequelize');
import model from '../models';
import logger from '../middleware/logger';
import { getEndOfDay, subtractDaysFromToday } from '../helpers/pgDateFormat';
import deliveryStatusSyncQueue from '../queues/deliveryStatusSyncQueue';
const { Delivery } = model;

const yesterday = getEndOfDay(subtractDaysFromToday(1));

const every15Sec = '*/15 * * * * *';
const every20Min = ' */20 * * * *';
const every10Min = ' */10 * * * *';
const everyMorningAt8Am = '0 8 * * *';

schedule(every15Sec, async () => {
  // schedule(every10Min, async () => {
  try {
    console.log('Order track job started at ' + new Date().toISOString());
    const pendingJobs = await deliveryStatusSyncQueue.count();
    console.log(
      `Order track job in process, currently pending ${pendingJobs} ${new Date().toISOString()}`
    );
    if (pendingJobs) {
      console.log(
        'Job stopped due to pending work ' + new Date().toISOString()
      );
      return;
    }
    console.log('Moving on');
    const deliveriesToTrack = await Delivery.findAll({
      where: {
        status: {
          [Op.notIn]: ['Delivered'],
        },
        createdAt: {
          [Op.lte]: yesterday,
        },
        updatedAt: {
          [Op.lte]: yesterday,
        },
      },
      attributes: ['id', 'cn', 'account_id'],
      order: [['createdAt', 'DESC']],
      limit: 10,
    });
    console.log(`No of orders for tracking: ${deliveriesToTrack.length}`);
    if (!deliveriesToTrack?.length) {
      console.warn('No order to track!');
      return;
    }
    await deliveryStatusSyncQueue.addBulk(
      deliveriesToTrack.map((data) => ({
        name: 'deliveryStatusSyncQueue',
        data,
      }))
    );
  } catch (error) {
    console.log(error);
    logger.error(`Error updating delivery ${deliveryToTrack.id}: ${error}`);
  }
});
