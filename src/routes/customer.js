import express from 'express';
import { PERMISSIONS } from '../constants/constants';

import can from '../middleware/canAccess';
import Auth from '../middleware/auth';
import { idSchema } from '../schemas/commonSchema';
import schemaValidator from '../middleware/schemaValidator';
import { createValidator } from 'express-joi-validation';
import CustomerController from '../controllers/CustomerController';
import { searchCustomerSchema } from '../schemas/customerSchema';

const router = express.Router();
const validator = createValidator();

router.post(
  '/all',
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_CUSTOMERS),
  CustomerController.customers
);

router.get(
  '/:id',
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_CUSTOMERS),
  validator.params(idSchema),
  CustomerController.customer
);

router.post(
  '/search',
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_CUSTOMERS),
  schemaValidator(searchCustomerSchema),
  CustomerController.search
);

export default router;
