import express from "express";
import CategoryController from "../controllers/CategoryController";
import constants from "../utils/constants";
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
  can(constants.PERMISSION_VIEW_ALL_USERS),
  CategoryController.categories
);

router.get(
  "/:id",
  Auth,
  can(constants.PERMISSION_VIEW_ALL_USERS),
  validator.params(idSchema),
  CategoryController.category
);

router.post(
  "/",
  Auth,
  can(constants.PERMISSION_CREATE_USER),
  schemaValidator(createUpdateCategorySchema),
  CategoryController.create
);

router.put(
  "/:id",
  Auth,
  can(constants.PERMISSION_UPDATE_USER),
  validator.params(idSchema),
  schemaValidator(createUpdateCategorySchema),
  CategoryController.update
);

router.delete(
  "/:id",
  Auth,
  can(constants.PERMISSION_DELETE_USER),
  validator.params(idSchema),
  CategoryController.destroy
);

export default router;
