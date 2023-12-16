import express from "express";
import BrandController from "../controllers/BrandController";
import constants from "../utils/constants";
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
  can(constants.PERMISSION_VIEW_ALL_USERS),
  BrandController.brands
);

router.get(
  "/:id",
  Auth,
  can(constants.PERMISSION_VIEW_ALL_USERS),
  validator.params(idSchema),
  BrandController.brand
);

router.post(
  "/",
  Auth,
  can(constants.PERMISSION_CREATE_USER),
  schemaValidator(createUpdateBrandSchema),
  BrandController.create
);

router.put(
  "/:id",
  Auth,
  can(constants.PERMISSION_UPDATE_USER),
  validator.params(idSchema),
  schemaValidator(createUpdateBrandSchema),
  BrandController.update
);

router.delete(
  "/:id",
  Auth,
  can(constants.PERMISSION_DELETE_USER),
  validator.params(idSchema),
  BrandController.destroy
);

export default router;
