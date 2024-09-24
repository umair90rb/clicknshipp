import express from 'express';
import CityController from '../controllers/CityController';
import { PERMISSIONS } from '../constants/constants';

import can from '../middleware/canAccess';
import Auth from '../middleware/auth';
import { createMapedCitySchema, searchCitySchema } from '../schemas/citySchema';
import schemaValidator from '../middleware/schemaValidator';
import { createValidator } from 'express-joi-validation';

const router = express.Router();
const validator = createValidator();

router.get(
  '/all',
  Auth,
  can(PERMISSIONS.PERMISSION_CREATE_ORDER),
  CityController.cities
);

router.post(
  '/search',
  Auth,
  can(PERMISSIONS.PERMISSION_CREATE_DELIVERY_ACCOUNTS),
  schemaValidator(searchCitySchema),
  CityController.search
);

router.post(
  '/',
  Auth,
  can(PERMISSIONS.PERMISSION_CREATE_USER),
  schemaValidator(createMapedCitySchema),
  CityController.create
);

// router.put(
//   "/:id",
//   Auth,
//   can(PERMISSIONS.PERMISSION_UPDATE_USER),
//   validator.params(idSchema),
//   schemaValidator(updateUserSchema),
//   CityController.update
// );

// router.delete(
//   "/:id",
//   Auth,
//   can(PERMISSIONS.PERMISSION_DELETE_USER),
//   validator.params(idSchema),
//   CityController.destroy
// );

export default router;
