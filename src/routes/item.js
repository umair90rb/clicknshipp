import express from "express";
import ItemController from "../controllers/ItemController";
import { PERMISSIONS } from "../constants/constants";

import can from "../middleware/canAccess";
import Auth from "../middleware/auth";
import { createItemSchema, updateItemSchema } from "../schemas/itemSchema";
import { idSchema } from "../schemas/commonSchema";
import schemaValidator from "../middleware/schemaValidator";
import { createValidator } from "express-joi-validation";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();
const validator = createValidator();

router.get(
  "/all",
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_ITEMS),
  ItemController.items
);

router.get(
  "/:id",
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_ITEMS),
  validator.params(idSchema),
  ItemController.item
);

router.post(
  "/import",
  Auth,
  can(PERMISSIONS.PERMISSION_BULK_CREATE_ITEMS),
  upload.single("file"),
  ItemController.import
);

router.post(
  "/",
  Auth,
  can(PERMISSIONS.PERMISSION_CREATE_ITEM),
  schemaValidator(createItemSchema),
  ItemController.create
);

router.put(
  "/:id",
  Auth,
  can(PERMISSIONS.PERMISSION_UPDATE_ITEM),
  validator.params(idSchema),
  schemaValidator(updateItemSchema),
  ItemController.update
);

router.delete(
  "/:id",
  Auth,
  can(PERMISSIONS.PERMISSION_DELETE_ITEM),
  validator.params(idSchema),
  ItemController.destroy
);

export default router;
