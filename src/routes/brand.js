import express from "express";
import BrandController from "../controllers/BrandController";
import { PERMISSIONS } from "../constants/constants";

import can from "../middleware/canAccess";
import Auth from "../middleware/auth";
import { createUpdateBrandSchema } from "../schemas/brandSchema";
import { idSchema } from "../schemas/commonSchema";
import schemaValidator from "../middleware/schemaValidator";
import { createValidator } from "express-joi-validation";

const router = express.Router();
const validator = createValidator();

router.get(
  "/all",
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_CATEGORIES_AND_BRANDS),
  BrandController.brands
);

router.get(
  "/:id",
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_CATEGORIES_AND_BRANDS),
  validator.params(idSchema),
  BrandController.brand
);

router.post(
  "/",
  Auth,
  can(PERMISSIONS.PERMISSION_CREATE_BRAND),
  schemaValidator(createUpdateBrandSchema),
  BrandController.create
);

router.put(
  "/:id",
  Auth,
  can(PERMISSIONS.PERMISSION_UPDATE_BRAND),
  validator.params(idSchema),
  schemaValidator(createUpdateBrandSchema),
  BrandController.update
);

router.delete(
  "/:id",
  Auth,
  can(PERMISSIONS.PERMISSION_DELETE_BRAND),
  validator.params(idSchema),
  BrandController.destroy
);

export default router;
