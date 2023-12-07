import express from "express";
import constants from "../utils/constants";
import can from "../middleware/canAccess";
import Auth from "../middleware/auth";
import { idSchema } from "../schemas/commonSchema";
import schemaValidator from "../middleware/schemaValidator";
import { createValidator } from "express-joi-validation";
import CustomerController from "../controllers/CustomerController";

const router = express.Router();
const validator = createValidator();

router.get(
  "/all",
  Auth,
  can(constants.PERMISSION_VIEW_ALL_ORDERS),
  CustomerController.customers
);

router.get(
  "/:id",
  Auth,
  can(constants.PERMISSION_VIEW_ALL_ORDERS),
  validator.params(idSchema),
  CustomerController.customer
);

// router.post(
//   "/",
//   Auth,
//   can(constants.PERMISSION_CREATE_ORDER),
//   //   schemaValidator(createRoleSchema),
//   OrderController.create
// );

// router.post("/shopify", OrderController.createShopifyOrder);
// router.post("/import", upload.single("file"), OrderController.import);

// router.put(
//   "/:id",
//   Auth,
//   can(constants.PERMISSION_UPDATE_ORDER),
//   validator.params(idSchema),
//   //   schemaValidator(updateRoleSchema),
//   OrderController.update
// );

// router.delete(
//   "/:id",
//   Auth,
//   can(constants.PERMISSION_DELETE_ORDER),
//   validator.params(idSchema),
//   OrderController.destroy
// );

export default router;
