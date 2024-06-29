import express from "express";
import Auth from "../middleware/auth";
import can from "../middleware/canAccess";
import { PERMISSIONS } from "../constants/constants";
import AdminController from "../controllers/AdminController";
import { sendSuccessResponse } from "../utils/sendResponse";

const router = express.Router();

router.get(
  "/users",
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_USERS),
  AdminController.users
);
router.get(
  "/dashboard",
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_ADMIN_DASHBOARD),
  (req, res) => {
    return sendSuccessResponse(res, 200, "", "Admin dashboard access allowed.");
  }
);

export default router;
