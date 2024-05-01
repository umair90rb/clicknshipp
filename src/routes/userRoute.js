import express from "express";
import UserController from "../controllers/UserController";
import constants from "../utils/constants";
import can from "../middleware/canAccess";
import Auth from "../middleware/auth";
import {
  createUserSchema,
  fetchUserWithPermissionsSchema,
  updateUserSchema,
  setDefaultBrandSchema,
} from "../schemas/userSchema";
import { idSchema } from "../schemas/commonSchema";
import schemaValidator from "../middleware/schemaValidator";
import { createValidator } from "express-joi-validation";

const router = express.Router();
const validator = createValidator();

router.get(
  "/all",
  Auth,
  can(constants.PERMISSION_VIEW_ALL_USERS),
  UserController.users
);

router.get(
  "/:id",
  Auth,
  can(constants.PERMISSION_VIEW_ALL_USERS),
  validator.params(idSchema),
  UserController.user
);

router.post(
  "/with-permissions",
  Auth,
  can(constants.PERMISSION_VIEW_ALL_USERS),
  schemaValidator(fetchUserWithPermissionsSchema),
  UserController.userWithPermission
);

router.post(
  "/",
  Auth,
  can(constants.PERMISSION_CREATE_USER),
  schemaValidator(createUserSchema),
  UserController.create
);

router.put(
  "/:id",
  Auth,
  can(constants.PERMISSION_UPDATE_USER),
  validator.params(idSchema),
  schemaValidator(updateUserSchema),
  UserController.update
);

router.get(
  "/set-default-brand/:id",
  Auth,
  validator.params(idSchema),
  UserController.setDefaultBrand
);

router.delete(
  "/:id",
  Auth,
  can(constants.PERMISSION_DELETE_USER),
  validator.params(idSchema),
  UserController.destroy
);

export default router;
