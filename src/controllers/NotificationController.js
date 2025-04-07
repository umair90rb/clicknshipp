import model from '../models';
import { sendErrorResponse, sendSuccessResponse } from '../utils/sendResponse';

const { Notification, UserNotificationRead, User } = model;

export default {
  async all(req, res) {
    try {
      const { resource, action, offset, limit } = req.body;
      const notifications = await Notification.findAll({
        attributes: ['id', 'resource', 'action', 'created_at'],
        where: {
          resource,
          action,
        },
        include: [
          { model: User, as: 'user', attributes: ['id', 'name'] },
          {
            model: UserNotificationRead,
            as: 'read',
            attributes: ['created_at'],
          },
        ],
        order: [['created_at', 'DESC']],
        limit,
        offset,
      });
      return sendSuccessResponse(
        res,
        200,
        { notifications },
        'All registered notifications'
      );
    } catch (error) {
      console.error(error);
      return sendErrorResponse(
        res,
        500,
        'Could not perform operation at this time, kindly try again later.',
        error
      );
    }
  },

  async markRead(req, res) {
    try {
      const notifications = req.body;
      await UserNotificationRead.bulkCreate(
        notifications.map((notification) => ({
          user_id: req.user.id,
          notification_id: notification.id,
        }))
      );
      return sendSuccessResponse(
        res,
        200,
        { notifications },
        'Notifications marked as read'
      );
    } catch (error) {
      return sendErrorResponse(
        res,
        500,
        'Could not perform operation at this time, kindly try again later.',
        error
      );
    }
  },

  async create(req, res) {
    try {
      const { resource, action } = req.body;
      const user_id = req.user.id;
      const notification = await Notification.create({
        resource,
        action,
        user_id,
      });
      return sendSuccessResponse(
        res,
        201,
        { notification },
        'Notification created successfully'
      );
    } catch (error) {
      console.error(error);
      return sendErrorResponse(
        res,
        500,
        'Could not perform operation at this time, kindly try again later.',
        error
      );
    }
  },

  async delete(req, res) {},
};
