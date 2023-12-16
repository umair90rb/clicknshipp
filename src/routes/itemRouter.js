import express from "express";
import ItemController from "../controllers/ItemController";
import constants from "../utils/constants";
import can from "../middleware/canAccess";
import Auth from "../middleware/auth";
import { createItemSchema, updateItemSchema } from "../schemas/itemSchema";
import { idSchema } from "../schemas/commonSchema";
import schemaValidator from "../middleware/schemaValidator";
import { createValidator } from "express-joi-validation";

const router = express.Router();
const validator = createValidator();

router.get(
  "/all",
  Auth,
  can(constants.PERMISSION_VIEW_ALL_USERS),
  ItemController.items
);

router.get(
  "/:id",
  Auth,
  can(constants.PERMISSION_VIEW_ALL_USERS),
  validator.params(idSchema),
  ItemController.item
);

router.post(
  "/",
  Auth,
  can(constants.PERMISSION_CREATE_USER),
  schemaValidator(createItemSchema),
  ItemController.create
);

router.put(
  "/:id",
  Auth,
  can(constants.PERMISSION_UPDATE_USER),
  validator.params(idSchema),
  schemaValidator(updateItemSchema),
  ItemController.update
);

router.delete(
  "/:id",
  Auth,
  can(constants.PERMISSION_DELETE_USER),
  validator.params(idSchema),
  ItemController.destroy
);

export default router;
