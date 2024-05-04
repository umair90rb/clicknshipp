import express from "express";
import { PERMISSIONS } from "../constants/constants";

import can from "../middleware/canAccess";
import Auth from "../middleware/auth";
import getUserBrand from "../middleware/getUserBrand";
import { idSchema } from "../schemas/commonSchema";
import {
  orderAssignSchema,
  orderBookSchema,
  orderStatusUpdateSchema,
  bulkOrderDeleteSchema,
} from "../schemas/orderSchema";
import schemaValidator from "../middleware/schemaValidator";
import { createValidator } from "express-joi-validation";
import OrderController from "../controllers/OrderController";
import OrderManagementController from "../controllers/OrderManagementController";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();
const validator = createValidator();

router.post(
  "/all",
  Auth,
  can([
    PERMISSIONS.PERMISSION_VIEW_ORDERS,
    PERMISSIONS.PERMISSION_VIEW_ALL_ORDERS,
  ]),
  getUserBrand,
  OrderController.orders
);

router.get(
  "/:id",
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_ORDERS),
  validator.params(idSchema),
  OrderController.order
);

router.post(
  "/book",
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_ALL_ORDERS),
  schemaValidator(orderBookSchema),
  OrderController.book
);

router.get(
  "/delivery-status/:id",
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_ALL_ORDERS),
  validator.params(idSchema),
  OrderController.deliveryStatus
);

router.post(
  "/",
  Auth,
  can(PERMISSIONS.PERMISSION_CREATE_ORDER),
  //   schemaValidator(createRoleSchema),
  OrderController.create
);

router.post("/shopify", OrderController.createShopifyOrder);
router.post(
  "/import",
  Auth,
  can(PERMISSIONS.PERMISSION_CREATE_BULK_ORDER),
  upload.single("file"),
  OrderController.import
);

router.post(
  "/assign",
  Auth,
  can(PERMISSIONS.PERMISSION_UPDATE_ORDER),
  schemaValidator(orderAssignSchema),
  OrderManagementController.assignOrders
);

router.post(
  "/status",
  Auth,
  can(PERMISSIONS.PERMISSION_UPDATE_ORDER),
  schemaValidator(orderStatusUpdateSchema),
  OrderController.updateStatus
);

router.put(
  "/:id",
  Auth,
  can(PERMISSIONS.PERMISSION_UPDATE_ORDER),
  validator.params(idSchema),
  //   schemaValidator(updateRoleSchema),
  OrderController.update
);

router.post(
  "/bulk",
  Auth,
  can(PERMISSIONS.PERMISSION_CREATE_BULK_ORDER),
  schemaValidator(bulkOrderDeleteSchema),
  OrderController.bulkDestroy
);

router.delete(
  "/:id",
  Auth,
  can(PERMISSIONS.PERMISSION_DELETE_ORDER),
  validator.params(idSchema),
  OrderController.destroy
);

export default router;
