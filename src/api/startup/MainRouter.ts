import { Application } from "express";
import apiRoutes from "../routes";

export default (app: Application) => {
  app.use("/api", apiRoutes);
};
