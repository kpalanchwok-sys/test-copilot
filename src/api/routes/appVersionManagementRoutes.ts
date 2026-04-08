import { Router } from "express";
import {
  getSingleDevice,
  registerDevice,
  saveExpoPushTokenController,
} from "../controllers/appVersionManagementController";
import { authenticate } from "../middleware/authenticate";

const router = Router();
router.use(authenticate(["Members", "organization"]));
router.post("/info", registerDevice);
router.get("/userId/:id/device-info", getSingleDevice);
router.post(
  "/expo-push-token",
  authenticate(["Members", "organization"]),
  saveExpoPushTokenController,
);

export default router;
