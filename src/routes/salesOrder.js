import express from 'express';
import SalesOrderController from '../controllers/SalesOrderController';
import { PERMISSIONS } from '../constants/constants';
import { createSalesOrder } from '../schemas/salesOrderSchema';
import can from '../middleware/canAccess';
import Auth from '../middleware/auth';
import schemaValidator from '../middleware/schemaValidator';
import { createValidator } from 'express-joi-validation';
import { idSchema } from '../schemas/commonSchema';

const router = express.Router();
const validator = createValidator();

router.get(
  '/all',
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_STOCK),
  SalesOrderController.salesOrders
);

router.get(
  '/:id',
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_STOCK),
  validator.params(idSchema),
  SalesOrderController.salesOrder
);

router.post(
  '/',
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_STOCK),
  schemaValidator(createSalesOrder),
  SalesOrderController.create
);

// router.put(
//   '/material/:id',
//   Auth,
//   can(PERMISSIONS.PERMISSION_RECEIVE_STOCK),
//   validator.params(idSchema),
//   schemaValidator(materialQuantityUpdateSchema),
//   SalesOrderController.material
// );

// router.get(
//   '/fullfil/:id/from/:locationId',
//   Auth,
//   can(PERMISSIONS.PERMISSION_RECEIVE_STOCK),
//   validator.params(idAndLocationIdSchema),
//   SalesOrderController.fullfil
// );

// router.put(
//   '/:id',
//   Auth,
//   can(PERMISSIONS.PERMISSION_RECEIVE_STOCK),
//   validator.params(idSchema),
//   schemaValidator(createBillOfMaterialSchema),
//   SalesOrderController.update
// );

// router.delete(
//   '/:id',
//   Auth,
//   can(PERMISSIONS.PERMISSION_RECEIVE_STOCK),
//   validator.params(idSchema),
//   SalesOrderController.destroy
// );

export default router;
