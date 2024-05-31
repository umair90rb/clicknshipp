import express from "express";
import { searchSchema } from "../schemas/searchSchema";
import schemaValidator from "../middleware/schemaValidator";
import auth from "../middleware/auth";
import SearchController from "../controllers/SearchController";

const router = express.Router();

router.post("/", auth, schemaValidator(searchSchema), SearchController.search);

export default router;
