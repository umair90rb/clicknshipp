import express from "express";
import ChanelController from "../controllers/ChanelController";
import { PERMISSIONS } from "../constants/constants";

import can from "../middleware/canAccess";
import Auth from "../middleware/auth";
import {
  createChanelSchema,
  updateChanelSchema,
} from "../schemas/chanelSchema";
import { idSchema } from "../schemas/commonSchema";
import schemaValidator from "../middleware/schemaValidator";
import { createValidator } from "express-joi-validation";

const router = express.Router();
const validator = createValidator();

router.get(
  "/all",
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_SALES_CHANEL),
  ChanelController.chanels
);

router.get(
  "/:id",
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_SALES_CHANEL),
  validator.params(idSchema),
  ChanelController.chanel
);

router.post(
  "/",
  Auth,
  can(PERMISSIONS.PERMISSION_CREATE_SALES_CHANEL),
  schemaValidator(createChanelSchema),
  ChanelController.create
);

router.put(
  "/:id",
  Auth,
  can(PERMISSIONS.PERMISSION_UPDATE_SALES_CHANEL),
  validator.params(idSchema),
  schemaValidator(updateChanelSchema),
  ChanelController.update
);

router.delete(
  "/:id",
  Auth,
  can(PERMISSIONS.PERMISSION_DELETE_SALES_CHANEL),
  validator.params(idSchema),
  ChanelController.destroy
);

export default router;
