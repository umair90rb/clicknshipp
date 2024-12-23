import express from 'express';
import BillOfMaterialController from '../controllers/BillOfMaterialController';
import { PERMISSIONS } from '../constants/constants';

import can from '../middleware/canAccess';
import Auth from '../middleware/auth';
import {
  createBillOfMaterialSchema,
  materialQuantityUpdateSchema,
  idAndLocationIdSchema,
} from '../schemas/billOfMaterialSchema';
import { idSchema } from '../schemas/commonSchema';
import schemaValidator from '../middleware/schemaValidator';
import { createValidator } from 'express-joi-validation';

const router = express.Router();
const validator = createValidator();

router.get(
  '/all',
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_STOCK),
  BillOfMaterialController.billOfMaterials
);

router.get(
  '/:id',
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_STOCK),
  validator.params(idSchema),
  BillOfMaterialController.billOfMaterial
);

router.post(
  '/',
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_STOCK),
  schemaValidator(createBillOfMaterialSchema),
  BillOfMaterialController.create
);

router.put(
  '/material/:id',
  Auth,
  can(PERMISSIONS.PERMISSION_RECEIVE_STOCK),
  validator.params(idSchema),
  schemaValidator(materialQuantityUpdateSchema),
  BillOfMaterialController.material
);

router.get(
  '/fullfil/:id/from/:locationId',
  Auth,
  can(PERMISSIONS.PERMISSION_RECEIVE_STOCK),
  validator.params(idAndLocationIdSchema),
  BillOfMaterialController.fullfil
);

router.put(
  '/:id',
  Auth,
  can(PERMISSIONS.PERMISSION_RECEIVE_STOCK),
  validator.params(idSchema),
  schemaValidator(createBillOfMaterialSchema),
  BillOfMaterialController.update
);

router.delete(
  '/:id',
  Auth,
  can(PERMISSIONS.PERMISSION_RECEIVE_STOCK),
  validator.params(idSchema),
  BillOfMaterialController.destroy
);

export default router;
