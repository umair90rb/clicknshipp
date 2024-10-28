import express from 'express';
import RawMaterialController from '../controllers/RawMaterialController';
import { PERMISSIONS } from '../constants/constants';
import can from '../middleware/canAccess';
import Auth from '../middleware/auth';
import { createRawMaterialSchema } from '../schemas/rawMaterialSchema.js';
import { idSchema } from '../schemas/commonSchema';
import schemaValidator from '../middleware/schemaValidator';
import { createValidator } from 'express-joi-validation';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();
const validator = createValidator();

router.get(
  '/all',
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_RAW_MATERIALS),
  RawMaterialController.all
);

router.get(
  '/:id',
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_RAW_MATERIALS),
  validator.params(idSchema),
  RawMaterialController.rawMaterial
);

router.post(
  '/',
  Auth,
  can(PERMISSIONS.PERMISSION_CREATE_RAW_MATERIAL),
  schemaValidator(createRawMaterialSchema),
  RawMaterialController.create
);

router.post(
  '/import',
  Auth,
  can(PERMISSIONS.PERMISSION_CREATE_RAW_MATERIAL),
  upload.single('file'),
  RawMaterialController.import
);

router.put(
  '/:id',
  Auth,
  can(PERMISSIONS.PERMISSION_UPDATE_RAW_MATERIAL),
  validator.params(idSchema),
  schemaValidator(createRawMaterialSchema),
  RawMaterialController.update
);

router.delete(
  '/:id',
  Auth,
  can(PERMISSIONS.PERMISSION_DELETE_RAW_MATERIAL),
  validator.params(idSchema),
  RawMaterialController.destroy
);

export default router;
