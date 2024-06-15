import express from "express";
import path from "path";
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
import deliverServiceAccountsRouter from "./deliverServiceAccountsRouter";
import permissionRouter from "./permissionRouter";
import searchRouter from "./searchRouter";
import logRouter from "./logRouter";
const rootDir = path.dirname(process.argv[1]);

export default (app) => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.get("/api/v1/health", (req, res) => {
    res.status(200).send("ok");
  });

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
  //[baseURL]/api/v1/order/shopify
  app.use("/api/v1/report", reportRouter);
  app.use("/api/v1/dashboard", dashboardRouter);
  app.use("/api/v1/delivery-service-accounts", deliverServiceAccountsRouter);
  app.use("/api/v1/search", searchRouter);
  app.use("/api/v1/", adminRouter);

  app.use("/api/v1/logs", logRouter);

  app.get("/*", (req, res) => {
    res.sendFile(path.join(rootDir, "../client", "build", "index.html"));
  });
};
