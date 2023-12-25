import express from "express";
import ChanelController from "../controllers/ChanelController";
import constants from "../utils/constants";
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
  can(constants.PERMISSION_VIEW_ALL_USERS),
  ChanelController.chanels
);

router.get(
  "/:id",
  Auth,
  can(constants.PERMISSION_VIEW_ALL_USERS),
  validator.params(idSchema),
  ChanelController.chanel
);

router.post(
  "/",
  Auth,
  can(constants.PERMISSION_CREATE_USER),
  schemaValidator(createChanelSchema),
  ChanelController.create
);

router.put(
  "/:id",
  Auth,
  can(constants.PERMISSION_UPDATE_USER),
  validator.params(idSchema),
  schemaValidator(updateChanelSchema),
  ChanelController.update
);

router.delete(
  "/:id",
  Auth,
  can(constants.PERMISSION_DELETE_USER),
  validator.params(idSchema),
  ChanelController.destroy
);

export default router;
