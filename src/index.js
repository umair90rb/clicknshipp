import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import route from "./routes";
import logErrors from "./middleware/logError";
import clientErrorHandler from "./middleware/clientErrorHandler";
import errorHandler from "./middleware/errorHandler";
import "dotenv/config";
import "./workers/bookingWorker";
import "./jobs/assignOrders";
// import "./jobs/trackOrders";
import { dirname } from "node:path";
import { Server } from "socket.io";
import DeliveryController from "./controllers/DeliveryController";
const rootDir = dirname(process.argv[1]);

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, "../client", "build")));

route(app);

app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

const server = app.listen(process.env.PORT, () => {
  console.log("App is now running at port ", process.env.PORT);
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.of("booking").on("connection", (socket) => {
  console.log("user connected for bulk booking");
  socket.on("booking", (data) => {
    DeliveryController.bulkBooking(socket);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
