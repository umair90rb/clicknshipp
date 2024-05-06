import { createLogger, format, transports } from "winston";
const { combine, timestamp, prettyPrint } = format;
import "winston-daily-rotate-file";

const fileRotateTransport = new transports.DailyRotateFile({
  filename: "logs/%DATE%.log",
  datePattern: "MMM-DD-YYYY",
  maxFiles: "7d",
});

const logger = createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "error",
  format: combine(
    timestamp({
      format: "MMM-DD-YYYY HH:mm:ss",
    }),
    prettyPrint()
  ),
  transports: [fileRotateTransport, new transports.Console()],
});

export default logger;
