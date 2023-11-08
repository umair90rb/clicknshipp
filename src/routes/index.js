import authRouter from "./authRouter";
import express from "express";
import { sendErrorResponse } from "../utils/sendResponse";

export default (app) => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use("/api/v1/auth", authRouter);

  app.get("/api/v1/health", (req, res) => {
    res.status(200).send("ok");
  });

  app.all("*", (req, res) =>
    sendErrorResponse(res, 404, "Route does not exist")
  );
};
