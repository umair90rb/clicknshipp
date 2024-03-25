import express from "express";
import Auth from "../middleware/auth";
import can from "../middleware/canAccess";
import Constants from "../utils/constants";
import ReportingController from "../controllers/ReportingController";

const router = express.Router();

router.post(
  "/order-products",
  Auth,
  can(Constants.PERMISSION_VIEW_REPORTING),
  ReportingController.orderProducts
);

export default router;
