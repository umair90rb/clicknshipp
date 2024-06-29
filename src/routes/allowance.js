import express from "express";
import AllowanceController from "../controllers/AllowanceController";
import { PERMISSIONS } from "../constants/constants";

import can from "../middleware/canAccess";
import Auth from "../middleware/auth";
import { createUpdateAllowanceSchema } from "../schemas/allowanceSchema";
import { idSchema } from "../schemas/commonSchema";
import schemaValidator from "../middleware/schemaValidator";
import { createValidator } from "express-joi-validation";

const router = express.Router();
const validator = createValidator();

router.get(
  "/all",
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_CATEGORIES_AND_BRANDS),
  AllowanceController.allowances
);

router.get(
  "/:id",
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_CATEGORIES_AND_BRANDS),
  validator.params(idSchema),
  AllowanceController.allowance
);

router.post(
  "/",
  Auth,
  can(PERMISSIONS.PERMISSION_CREATE_BRAND),
  schemaValidator(createUpdateAllowanceSchema),
  AllowanceController.create
);

router.put(
  "/:id",
  Auth,
  can(PERMISSIONS.PERMISSION_UPDATE_BRAND),
  validator.params(idSchema),
  schemaValidator(createUpdateAllowanceSchema),
  AllowanceController.update
);

router.delete(
  "/:id",
  Auth,
  can(PERMISSIONS.PERMISSION_DELETE_BRAND),
  validator.params(idSchema),
  AllowanceController.destroy
);

export default router;
