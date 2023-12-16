import express from "express";
import StockController from "../controllers/StockController";
import constants from "../utils/constants";
import can from "../middleware/canAccess";
import Auth from "../middleware/auth";
import { createStockSchema } from "../schemas/stockSchema";
import { idSchema } from "../schemas/commonSchema";
import schemaValidator from "../middleware/schemaValidator";
import { createValidator } from "express-joi-validation";

const router = express.Router();
const validator = createValidator();

router.get(
  "/all",
  Auth,
  can(constants.PERMISSION_VIEW_ALL_USERS),
  StockController.stocks
);

router.get(
  "/:id",
  Auth,
  can(constants.PERMISSION_VIEW_ALL_USERS),
  validator.params(idSchema),
  StockController.stock
);

router.post(
  "/",
  Auth,
  can(constants.PERMISSION_CREATE_USER),
  schemaValidator(createStockSchema),
  StockController.create
);

export default router;
