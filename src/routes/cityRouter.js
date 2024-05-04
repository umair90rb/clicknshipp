import express from "express";
import CityController from "../controllers/CityController";
import { PERMISSIONS } from "../constants/constants";

import can from "../middleware/canAccess";
import Auth from "../middleware/auth";
import { createUserSchema, updateUserSchema } from "../schemas/userSchema";
import { idSchema } from "../schemas/commonSchema";
import schemaValidator from "../middleware/schemaValidator";
import { createValidator } from "express-joi-validation";

const router = express.Router();
const validator = createValidator();

router.get(
  "/all",
  Auth,
  can(PERMISSIONS.PERMISSION_CREATE_ORDER),
  CityController.cities
);

// router.get(
//   "/:id",
//   Auth,
//   can(PERMISSIONS.PERMISSION_VIEW_ALL_USERS),
//   validator.params(idSchema),
//   CityController.city
// );

// router.post(
//   "/",
//   Auth,
//   can(PERMISSIONS.PERMISSION_CREATE_USER),
//   schemaValidator(createUserSchema),
//   CityController.create
// );

// router.put(
//   "/:id",
//   Auth,
//   can(PERMISSIONS.PERMISSION_UPDATE_USER),
//   validator.params(idSchema),
//   schemaValidator(updateUserSchema),
//   CityController.update
// );

// router.delete(
//   "/:id",
//   Auth,
//   can(PERMISSIONS.PERMISSION_DELETE_USER),
//   validator.params(idSchema),
//   CityController.destroy
// );

export default router;
