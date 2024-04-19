import express from "express";
import constants from "../utils/constants";
import can from "../middleware/canAccess";
import Auth from "../middleware/auth";
import { idSchema } from "../schemas/commonSchema";
import {
  orderAssignSchema,
  orderBookSchema,
  orderStatusUpdateSchema,
} from "../schemas/orderSchema";
import schemaValidator from "../middleware/schemaValidator";
import { createValidator } from "express-joi-validation";
import OrderController from "../controllers/OrderController";
import OrderManagmentController from "../controllers/OrderManagmentController";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();
const validator = createValidator();

router.post(
  "/all",
  Auth,
  can([constants.PERMISSION_VIEW_ORDERS, constants.PERMISSION_VIEW_ALL_ORDERS]),
  OrderController.orders
);

router.get(
  "/:id",
  Auth,
  can(constants.PERMISSION_VIEW_ALL_ORDERS),
  validator.params(idSchema),
  OrderController.order
);

router.post(
  "/book",
  Auth,
  can(constants.PERMISSION_VIEW_ALL_ORDERS),
  schemaValidator(orderBookSchema),
  OrderController.book
);

router.get(
  "/delivery-status/:id",
  Auth,
  can(constants.PERMISSION_VIEW_ALL_ORDERS),
  validator.params(idSchema),
  OrderController.deliveryStatus
);

router.post(
  "/",
  Auth,
  can(constants.PERMISSION_CREATE_ORDER),
  //   schemaValidator(createRoleSchema),
  OrderController.create
);

router.post("/shopify", OrderController.createShopifyOrder);
router.post("/import", upload.single("file"), OrderController.import);
router.post(
  "/assign",
  Auth,
  can(constants.PERMISSION_UPDATE_ORDER),
  schemaValidator(orderAssignSchema),
  OrderManagmentController.assignOrders
);

router.post(
  "/status",
  Auth,
  can(constants.PERMISSION_UPDATE_ORDER),
  schemaValidator(orderStatusUpdateSchema),
  OrderController.updateStatus
);

router.put(
  "/:id",
  Auth,
  can(constants.PERMISSION_UPDATE_ORDER),
  validator.params(idSchema),
  //   schemaValidator(updateRoleSchema),
  OrderController.update
);

router.delete(
  "/:id",
  Auth,
  can(constants.PERMISSION_DELETE_ORDER),
  validator.params(idSchema),
  OrderController.destroy
);

export default router;
