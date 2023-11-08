import express from "express";
import path from "path";
import route from "./src/routes";
import logErrors from "./src/middlewares/logError";
import clientErrorHandler from "./src/middlewares/clientErrorHandler";
import errorHandler from "./src/middlewares/errorHandler";
const app = express();

app.use(express.static(path.join(__dirname, "client/build")));

route(app);

app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("App is now running at port ", PORT);
});
