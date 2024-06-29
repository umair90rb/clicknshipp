import express from "express";
import Auth from "../middleware/auth";
import can from "../middleware/canAccess";
import { PERMISSIONS } from "../constants/constants";

import ReportingController from "../controllers/ReportingController";

const router = express.Router();

router.post(
  "/agent-report",
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_REPORTING),
  ReportingController.agentReport
);

export default router;
