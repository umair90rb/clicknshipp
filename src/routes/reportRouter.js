import express from "express";
import Auth from "../middleware/auth";
import can from "../middleware/canAccess";
import Constants from "../utils/constants";
import ReportingController from "../controllers/ReportingController";

const router = express.Router();

router.post(
  "/product-order-count",
  Auth,
  can(Constants.PERMISSION_VIEW_ALL_USERS),
  ReportingController.productOrderCount
);

export default router;
