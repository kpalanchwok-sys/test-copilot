import { RequestHandler, Router } from "express";
import multer from "multer";
import {
  createWaterAlert,
  deleteWaterAlert,
  getWaterAlerts,
  getSingleWaterAlert,
  updateWaterAlert,
} from "../controllers/waterwayAlertController";
import { authenticate } from "../middleware/authenticate";

const router = Router();
router.use(authenticate(["Members"]));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post(
  "/",
  upload.single("image") as unknown as RequestHandler,
  createWaterAlert,
);
router.get("/", getWaterAlerts);
router.get("/:id", getSingleWaterAlert);
router.put(
  "/:id",
  upload.single("image") as unknown as RequestHandler,
  updateWaterAlert,
);
router.delete("/:id", deleteWaterAlert);

export default router;
