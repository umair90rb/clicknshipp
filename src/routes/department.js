import express from "express";
import DepartmentController from "../controllers/DepartmentController";
import { PERMISSIONS } from "../constants/constants";

import can from "../middleware/canAccess";
import Auth from "../middleware/auth";
import { createUpdateDepartmentSchema } from "../schemas/departmentSchema";
import { idSchema } from "../schemas/commonSchema";
import schemaValidator from "../middleware/schemaValidator";
import { createValidator } from "express-joi-validation";

const router = express.Router();
const validator = createValidator();

router.get(
  "/all",
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_CATEGORIES_AND_BRANDS),
  DepartmentController.departments
);

router.get(
  "/:id",
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_CATEGORIES_AND_BRANDS),
  validator.params(idSchema),
  DepartmentController.department
);

router.post(
  "/",
  Auth,
  can(PERMISSIONS.PERMISSION_CREATE_BRAND),
  schemaValidator(createUpdateDepartmentSchema),
  DepartmentController.create
);

router.put(
  "/:id",
  Auth,
  can(PERMISSIONS.PERMISSION_UPDATE_BRAND),
  validator.params(idSchema),
  schemaValidator(createUpdateDepartmentSchema),
  DepartmentController.update
);

router.delete(
  "/:id",
  Auth,
  can(PERMISSIONS.PERMISSION_DELETE_BRAND),
  validator.params(idSchema),
  DepartmentController.destroy
);

export default router;
