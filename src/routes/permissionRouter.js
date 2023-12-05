import express from "express";
import constants from "../utils/constants";
import can from "../middleware/canAccess";
import Auth from "../middleware/auth";
import PermissionController from "../controllers/PermissionController";

const router = express.Router();

router.get(
  "/all",
  Auth,
  can(constants.PERMISSION_VIEW_ALL_ROLES),
  PermissionController.permissions
);

export default router;
