import { Router } from "express";
import {
  createAppVersion,
  getLatestVersion,
} from "../controllers/appVersionController";
import {
  createUserDevice,
  getAllUserDevices,
} from "../controllers/userDeviceManagementController";

const router = Router();

router.post("/", createAppVersion);
router.get("/latest", getLatestVersion);

router.post("/deviceInfo", createUserDevice);
router.get("/deviceInfo", getAllUserDevices);

export default router;
