import connection from "../config/redis";
import { Queue } from "bullmq";

const bookingQueue = new Queue("bookingQueue", {
  connection,
});

export default bookingQueue;
