import express from "express";
import path from "path";
import fs from "fs/promises";
import authRouter from "./authRouter";
import adminRouter from "./adminRouter";
import userRouter from "./userRoute";
import itemRouter from "./itemRouter";
import stockRouter from "./stockRouter";
import supplierRouter from "./supplierRouter";
import categoryRouter from "./categoryRouter";
import brandRouter from "./brandRouter";
import chanelRouter from "./chanelRouter";
import customerRouter from "./customerRouter";
import roleRouter from "./roleRouter";
import cityRouter from "./cityRouter";
import orderRouter from "./orderRouter";
import reportRouter from "./reportRouter";
import dashboardRouter from "./dashboardRouter";
import permissionRouter from "./permissionRouter";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";
// import { sendErrorResponse } from "../utils/sendResponse";

export default (app) => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/item", itemRouter);
  app.use("/api/v1/stock", stockRouter);
  app.use("/api/v1/supplier", supplierRouter);
  app.use("/api/v1/category", categoryRouter);
  app.use("/api/v1/brand", brandRouter);
  app.use("/api/v1/chanel", chanelRouter);
  app.use("/api/v1/customer", customerRouter);
  app.use("/api/v1/role", roleRouter);
  app.use("/api/v1/city", cityRouter);
  app.use("/api/v1/permission", permissionRouter);
  app.use("/api/v1/order", orderRouter);
  //https://sukoon-inc-96f4d4ef3e58.herokuapp.com/api/v1/order/shopify
  app.use("/api/v1/report", reportRouter);
  app.use("/api/v1/dashboard", dashboardRouter);
  app.use("/api/v1/", adminRouter);

  app.get("/api/v1/health", (req, res) => {
    res.status(200).send("ok");
  });

  app.get("/api/v1/logs", async (req, res) => {
    try {
      const dirLs = await fs.readdir(path.join(__dirname, "../../logs/"));
      const files = Object.values(dirLs).filter((file) =>
        file.endsWith(".log")
      );
      return sendSuccessResponse(res, 200, { files });
    } catch (error) {
      return sendErrorResponse(res, 500, error.message, error);
    }
  });

  app.get("/api/v1/logs/:file", async (req, res) => {
    try {
      const file = req.params.file;
      return res.sendFile(path.join(__dirname, "../../logs/", file));
    } catch (error) {
      return sendErrorResponse(res, 500, error.message, error);
    }
  });

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/build"));
  });

  app.all("*", (req, res) => res.redirect("/"));
};
