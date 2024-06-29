import express from "express";
import CategoryController from "../controllers/CategoryController";
import { PERMISSIONS } from "../constants/constants";

import can from "../middleware/canAccess";
import Auth from "../middleware/auth";
import { createUpdateCategorySchema } from "../schemas/categorySchema";
import { idSchema } from "../schemas/commonSchema";
import schemaValidator from "../middleware/schemaValidator";
import { createValidator } from "express-joi-validation";

const router = express.Router();
const validator = createValidator();

router.get(
  "/all",
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_CATEGORIES_AND_BRANDS),
  CategoryController.categories
);

router.get(
  "/:id",
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_CATEGORIES_AND_BRANDS),
  validator.params(idSchema),
  CategoryController.category
);

router.post(
  "/",
  Auth,
  can(PERMISSIONS.PERMISSION_CREATE_CATEGORY),
  schemaValidator(createUpdateCategorySchema),
  CategoryController.create
);

router.put(
  "/:id",
  Auth,
  can(PERMISSIONS.PERMISSION_UPDATE_CATEGORY),
  validator.params(idSchema),
  schemaValidator(createUpdateCategorySchema),
  CategoryController.update
);

router.delete(
  "/:id",
  Auth,
  can(PERMISSIONS.PERMISSION_DELETE_CATEGORY),
  validator.params(idSchema),
  CategoryController.destroy
);

export default router;
