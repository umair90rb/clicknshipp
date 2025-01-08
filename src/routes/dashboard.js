import express from 'express';
import Auth from '../middleware/auth';
import can from '../middleware/canAccess';
import { PERMISSIONS } from '../constants/constants';

import DashboardController from '../controllers/DashboardController';

const router = express.Router();

router.get(
  '/stats',
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_ADMIN_DASHBOARD),
  DashboardController.stats
);

router.get(
  '/graph',
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_ADMIN_DASHBOARD),
  DashboardController.graph
);

export default router;
