import { schedule } from 'node-cron';
const { Op } = require('sequelize');
import model from '../models';
import logger from '../middleware/logger';
import {
  getEndOfDay,
  getStartOfDay,
  subtractDaysFromToday,
} from '../helpers/pgDateFormat';
import bookingService from '../services/BookingService';
const { Delivery, DeliveryServiceAccounts, Tokens } = model;

const yesterday = getEndOfDay(subtractDaysFromToday(1));

const every5Sec = '*/5 * * * * *';
const every20Min = ' */20 * * * *';
const every10Min = ' */10 * * * *';
const everyMorningAt8Am = '0 8 * * *';

schedule(every10Min, async () => {
  try {
    console.log('Order track job started at ' + new Date().toISOString());
    const deliveriesToTrack = await Delivery.findAll({
      where: {
        status: {
          [Op.notIn]: ['Delivered'],
        },
        createdAt: {
          [Op.lte]: yesterday,
        },
        updatedAt: {
          [Op.lte]: yesterdayEndOfDay,
        },
        tracking_status: { [Op.any]: [null, 'Failed'] },
      },
      include: {
        model: DeliveryServiceAccounts,
        as: 'account',
        include: {
          as: 'tokens',
          model: Tokens,
        },
      },
    });
    console.log(`No of orders for tracking: ${deliveriesToTrack.length}`);
    if (!deliveriesToTrack?.length) {
      console.warn('No order to track!');
      return;
    }
  } catch (error) {
    logger.error(`Error updating delivery ${deliveryToTrack.id}: ${error}`);
  }
});
