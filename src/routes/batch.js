import express from 'express';
import { createValidator } from 'express-joi-validation';
import Auth from '../middleware/auth';
import can from '../middleware/canAccess';
import { PERMISSIONS } from '../constants/constants';
import BatchController from '../controllers/BatchController';
import { idSchema } from '../schemas/commonSchema';
import { getBatchSchema } from '../schemas/batchSchema';
import schemaValidator from '../middleware/schemaValidator';
const validator = createValidator();

const router = express.Router();

router.get(
  '/all',
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_BATCHES),
  BatchController.batches
);
router.get(
  '/:id',
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_BATCHES),
  validator.params(idSchema),
  BatchController.batch
);

router.post(
  '/get',
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_BATCHES),
  schemaValidator(getBatchSchema),
  BatchController.get
);

export default router;
