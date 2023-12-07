import authRouter from "./authRouter";
import adminRouter from "./adminRouter";
import userRouter from "./userRoute";
import customerRouter from "./customerRouter";
import roleRouter from "./roleRouter";
import orderRouter from "./orderRouter";
import permissionRouter from "./permissionRouter";
import express from "express";
import { sendErrorResponse } from "../utils/sendResponse";

export default (app) => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/customer", customerRouter);
  app.use("/api/v1/role", roleRouter);
  app.use("/api/v1/permission", permissionRouter);
  app.use("/api/v1/order", orderRouter);
  app.use("/api/v1/", adminRouter);

  app.get("/api/v1/health", (req, res) => {
    res.status(200).send("ok");
  });

  app.all("*", (req, res) =>
    sendErrorResponse(res, 404, "Route does not exist")
  );
};
