import { Router } from "express";
import { createQrCode } from "../controllers/qrCodeController";

import { authenticate } from "../middleware/authenticate";

const router = Router();
router.use(authenticate(["Members"]));

router.post("/generate", createQrCode);

export default router;
