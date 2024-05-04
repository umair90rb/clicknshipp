import express from "express";
import SupplierController from "../controllers/SupplierController";
import { PERMISSIONS } from "../constants/constants";

import can from "../middleware/canAccess";
import Auth from "../middleware/auth";
import {
  createSupplierSchema,
  updateSupplierSchema,
} from "../schemas/supplierSchema";
import { idSchema } from "../schemas/commonSchema";
import schemaValidator from "../middleware/schemaValidator";
import { createValidator } from "express-joi-validation";

const router = express.Router();
const validator = createValidator();

router.get(
  "/all",
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_SUPPLIERS),
  SupplierController.suppliers
);

router.get(
  "/:id",
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_SUPPLIERS),
  validator.params(idSchema),
  SupplierController.supplier
);

router.post(
  "/",
  Auth,
  can(PERMISSIONS.PERMISSION_CREATE_SUPPLIER),
  schemaValidator(createSupplierSchema),
  SupplierController.create
);

router.put(
  "/:id",
  Auth,
  can(PERMISSIONS.PERMISSION_UPDATE_SUPPLIER),
  validator.params(idSchema),
  schemaValidator(updateSupplierSchema),
  SupplierController.update
);

router.delete(
  "/:id",
  Auth,
  can(PERMISSIONS.PERMISSION_DELETE_SUPPLIER),
  validator.params(idSchema),
  SupplierController.destroy
);

export default router;
