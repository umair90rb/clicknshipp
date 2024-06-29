import express from "express";
import DeliveryServiceAccountController from "../controllers/DeliveryServiceAccountController";
import { PERMISSIONS } from "../constants/constants";

import can from "../middleware/canAccess";
import Auth from "../middleware/auth";
import { createUpdateDeliveryServiceAccount } from "../schemas/deliveryServiceAccountSchema";
import { idSchema } from "../schemas/commonSchema";
import schemaValidator from "../middleware/schemaValidator";
import { createValidator } from "express-joi-validation";

const router = express.Router();
const validator = createValidator();

router.get(
  "/all",
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_DELIVERY_ACCOUNTS),
  DeliveryServiceAccountController.accounts
);

// router.get(
//   "/:id",
//   Auth,
//   can(PERMISSIONS.PERMISSION_VIEW_CATEGORIES_AND_BRANDS),
//   validator.params(idSchema),
//   DeliveryServiceAccountController.account
// );

router.post(
  "/",
  Auth,
  can(PERMISSIONS.PERMISSION_CREATE_DELIVERY_ACCOUNTS),
  schemaValidator(createUpdateDeliveryServiceAccount),
  DeliveryServiceAccountController.create
);

router.put(
  "/:id",
  Auth,
  can(PERMISSIONS.PERMISSION_UPDATE_DELIVERY_ACCOUNTS),
  validator.params(idSchema),
  schemaValidator(createUpdateDeliveryServiceAccount),
  DeliveryServiceAccountController.update
);

router.delete(
  "/:id",
  Auth,
  can(PERMISSIONS.PERMISSION_DELETE_DELIVERY_ACCOUNTS),
  validator.params(idSchema),
  DeliveryServiceAccountController.destroy
);

export default router;
