import express from "express";
import SupplierController from "../controllers/SupplierController";
import constants from "../utils/constants";
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
  can(constants.PERMISSION_VIEW_ALL_USERS),
  SupplierController.suppliers
);

router.get(
  "/:id",
  Auth,
  can(constants.PERMISSION_VIEW_ALL_USERS),
  validator.params(idSchema),
  SupplierController.supplier
);

router.post(
  "/",
  Auth,
  can(constants.PERMISSION_CREATE_USER),
  schemaValidator(createSupplierSchema),
  SupplierController.create
);

router.put(
  "/:id",
  Auth,
  can(constants.PERMISSION_UPDATE_USER),
  validator.params(idSchema),
  schemaValidator(updateSupplierSchema),
  SupplierController.update
);

router.delete(
  "/:id",
  Auth,
  can(constants.PERMISSION_DELETE_USER),
  validator.params(idSchema),
  SupplierController.destroy
);

export default router;
