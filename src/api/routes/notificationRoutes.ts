import { Router } from "express";
import { registerPushToken } from "../controllers/notificationController";

const router = Router();

router.post("/push-token", registerPushToken);

export default router;
