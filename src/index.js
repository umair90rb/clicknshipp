import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import dotenv from "dotenv";
import route from "./routes";
import logErrors from "./middleware/logError";
import clientErrorHandler from "./middleware/clientErrorHandler";
import errorHandler from "./middleware/errorHandler";
import "./jobs/assignOrders";
import "./jobs/trackOrders";
import { dirname } from "node:path";
const rootDir = dirname(process.argv[1]);

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, "../client", "build")));

route(app);

app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("App is now running at port ", PORT);
});
