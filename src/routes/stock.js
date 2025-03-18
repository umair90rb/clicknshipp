import express from 'express';
import StockController from '../controllers/StockController';
import { PERMISSIONS } from '../constants/constants';

import can from '../middleware/canAccess';
import Auth from '../middleware/auth';
import attachPermittedStores from '../middleware/attachPermittedStores';
import {
  stockHistorySchema,
  createStockSchema,
  returnStockSchema,
  addStockDamageSchema,
  damageReportSchema,
} from '../schemas/stockSchema';
import schemaValidator from '../middleware/schemaValidator';
// import { createValidator } from 'express-joi-validation';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();
// const validator = createValidator();

router.get(
  '/all',
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_STOCK),
  attachPermittedStores,
  StockController.stocks
);

router.post(
  '/history',
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_STOCK),
  schemaValidator(stockHistorySchema),
  attachPermittedStores,
  StockController.history
);

router.post(
  '/',
  Auth,
  can(PERMISSIONS.PERMISSION_RECEIVE_STOCK),
  schemaValidator(createStockSchema),
  attachPermittedStores,
  StockController.create
);

router.post(
  '/return',
  Auth,
  can(PERMISSIONS.PERMISSION_RECEIVE_STOCK_RETURN),
  schemaValidator(returnStockSchema),
  attachPermittedStores,
  StockController.return
);

router.post(
  '/damage',
  Auth,
  can(PERMISSIONS.PERMISSION_ADD_STOCK_DAMAGE),
  schemaValidator(addStockDamageSchema),
  attachPermittedStores,
  StockController.damage
);

router.post(
  '/damage-report',
  Auth,
  can(PERMISSIONS.PERMISSION_ADD_STOCK_DAMAGE),
  schemaValidator(damageReportSchema),
  attachPermittedStores,
  StockController.damageReport
);

router.post(
  '/import',
  Auth,
  can(PERMISSIONS.PERMISSION_IMPORT_STOCK),
  attachPermittedStores,
  upload.single('file'),
  StockController.import
);

export default router;
