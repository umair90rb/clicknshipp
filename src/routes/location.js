import express from 'express';
import { createValidator } from 'express-joi-validation';
import LocationController from '../controllers/LocationController';
import { PERMISSIONS } from '../constants/constants';
import can from '../middleware/canAccess';
import Auth from '../middleware/auth';
import attachPermittedStores from '../middleware/attachPermittedStores';
import { createLocationSchema } from '../schemas/locationSchema';
import { idSchema } from '../schemas/commonSchema';
import schemaValidator from '../middleware/schemaValidator';

const router = express.Router();
const validator = createValidator();

router.get(
  '/all',
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_LOCATIONS),
  attachPermittedStores,
  LocationController.all
);

router.get(
  '/:id',
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_LOCATIONS),
  validator.params(idSchema),
  LocationController.location
);

router.post(
  '/',
  Auth,
  can(PERMISSIONS.PERMISSION_CREATE_LOCATION),
  schemaValidator(createLocationSchema),
  LocationController.create
);

router.put(
  '/:id',
  Auth,
  can(PERMISSIONS.PERMISSION_UPDATE_LOCATION),
  validator.params(idSchema),
  schemaValidator(createLocationSchema),
  LocationController.update
);

router.delete(
  '/:id',
  Auth,
  can(PERMISSIONS.PERMISSION_DELETE_LOCATION),
  validator.params(idSchema),
  LocationController.destroy
);

export default router;
