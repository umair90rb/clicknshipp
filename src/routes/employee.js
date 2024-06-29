import express from "express";
import EmployeeController from "../controllers/EmployeeController";
import { PERMISSIONS } from "../constants/constants";

import can from "../middleware/canAccess";
import Auth from "../middleware/auth";
import { createUpdateEmployeeSchema } from "../schemas/employeeSchema";
import { idSchema } from "../schemas/commonSchema";
import schemaValidator from "../middleware/schemaValidator";
import { createValidator } from "express-joi-validation";

const router = express.Router();
const validator = createValidator();

router.get(
  "/all",
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_CATEGORIES_AND_BRANDS),
  EmployeeController.employees
);

router.get(
  "/:id",
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_CATEGORIES_AND_BRANDS),
  validator.params(idSchema),
  EmployeeController.employee
);

router.post(
  "/",
  Auth,
  can(PERMISSIONS.PERMISSION_CREATE_BRAND),
  schemaValidator(createUpdateEmployeeSchema),
  EmployeeController.create
);

router.put(
  "/:id",
  Auth,
  can(PERMISSIONS.PERMISSION_UPDATE_BRAND),
  validator.params(idSchema),
  schemaValidator(createUpdateEmployeeSchema),
  EmployeeController.update
);

router.delete(
  "/:id",
  Auth,
  can(PERMISSIONS.PERMISSION_DELETE_BRAND),
  validator.params(idSchema),
  EmployeeController.destroy
);

export default router;
