import express from "express";
import { PERMISSIONS } from "../constants/constants";

import can from "../middleware/canAccess";
import Auth from "../middleware/auth";
import PermissionController from "../controllers/PermissionController";

const router = express.Router();

router.get(
  "/all",
  Auth,
  can(PERMISSIONS.PERMISSION_CREATE_ROLE),
  PermissionController.permissions
);

export default router;
