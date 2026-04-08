import { Router } from "express";
import { createAlert } from "../controllers/alertController";

import { authenticate } from "../middleware/authenticate";

const router = Router();
router.use(authenticate(["Members"]));

router.post("/send", createAlert);

export default router;
