import express from 'express';
import { PERMISSIONS } from '../constants/constants';
import can from '../middleware/canAccess';
import Auth from '../middleware/auth';
import schemaValidator from '../middleware/schemaValidator';
import NotificationController from '../controllers/NotificationController';
import {
  allNotificationSchema,
  createNotificationSchema,
  markReadNotificationSchema,
} from '../schemas/notificationSchema';

const router = express.Router();

router.post(
  '/all',
  Auth,
  can(PERMISSIONS.PERMISSION_RECEIVE_EXPORT_NOTIFICATIONS),
  schemaValidator(allNotificationSchema),
  NotificationController.all
);

router.post(
  '/mark-read',
  Auth,
  schemaValidator(markReadNotificationSchema),
  NotificationController.markRead
);

router.post(
  '/create',
  Auth,
  schemaValidator(createNotificationSchema),
  NotificationController.create
);

export default router;
