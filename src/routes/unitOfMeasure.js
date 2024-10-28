import express from 'express';
import UnitOfMeasureController from '../controllers/UnitOfMeasureController';
import { PERMISSIONS } from '../constants/constants';
import can from '../middleware/canAccess';
import Auth from '../middleware/auth';
import { createUnitOfMeasureSchema } from '../schemas/unitOfMeasureSchema';
import { idSchema } from '../schemas/commonSchema';
import schemaValidator from '../middleware/schemaValidator';
import { createValidator } from 'express-joi-validation';

const router = express.Router();
const validator = createValidator();

router.get(
  '/all',
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_UNIT_OF_MEASURES),
  UnitOfMeasureController.all
);

router.get(
  '/:id',
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_UNIT_OF_MEASURES),
  validator.params(idSchema),
  UnitOfMeasureController.unit
);

router.post(
  '/',
  Auth,
  can(PERMISSIONS.PERMISSION_CREATE_UNIT_OF_MEASURE),
  schemaValidator(createUnitOfMeasureSchema),
  UnitOfMeasureController.create
);

router.put(
  '/:id',
  Auth,
  can(PERMISSIONS.PERMISSION_UPDATE_UNIT_OF_MEASURE),
  validator.params(idSchema),
  schemaValidator(createUnitOfMeasureSchema),
  UnitOfMeasureController.update
);

router.delete(
  '/:id',
  Auth,
  can(PERMISSIONS.PERMISSION_DELETE_UNIT_OF_MEASURE),
  validator.params(idSchema),
  UnitOfMeasureController.destroy
);

export default router;
