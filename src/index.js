import express from "express";
import serveIndex from "serve-index";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import route from "./routes";
import logErrors from "./middleware/logError";
import clientErrorHandler from "./middleware/clientErrorHandler";
import errorHandler from "./middleware/errorHandler";
import "./jobs/assignOrders";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, "../client/build")));

route(app);

app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("App is now running at port ", PORT);
});
