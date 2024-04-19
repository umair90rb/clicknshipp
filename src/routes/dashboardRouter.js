import express from "express";
import Auth from "../middleware/auth";
import can from "../middleware/canAccess";
import Constants from "../utils/constants";
import DashboardController from "../controllers/DashboardController";

const router = express.Router();

router.get(
  "/stats",
  Auth,
  can(Constants.PERMISSION_VIEW_ALL_USERS),
  DashboardController.stats
);

export default router;
