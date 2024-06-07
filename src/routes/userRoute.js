import express from "express";
import UserController from "../controllers/UserController";
import { PERMISSIONS } from "../constants/constants";

import can from "../middleware/canAccess";
import Auth from "../middleware/auth";
import {
  createUserSchema,
  filteredUsersSchema,
  updateUserSchema,
} from "../schemas/userSchema";
import { idSchema } from "../schemas/commonSchema";
import schemaValidator from "../middleware/schemaValidator";
import { createValidator } from "express-joi-validation";

const router = express.Router();
const validator = createValidator();

router.get(
  "/all",
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_USERS),
  UserController.users
);

router.get(
  "/:id",
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_USERS),
  validator.params(idSchema),
  UserController.user
);

router.post(
  "/filtered",
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_USERS),
  schemaValidator(filteredUsersSchema),
  UserController.usersFiltered
);

router.post(
  "/",
  Auth,
  can(PERMISSIONS.PERMISSION_CREATE_USER),
  schemaValidator(createUserSchema),
  UserController.create
);

router.put(
  "/:id",
  Auth,
  can(PERMISSIONS.PERMISSION_UPDATE_USER),
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
  can(PERMISSIONS.PERMISSION_DELETE_USER),
  validator.params(idSchema),
  UserController.destroy
);

export default router;
