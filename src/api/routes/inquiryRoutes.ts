import { Router } from "express";
import { createInquiry } from "../controllers/inqueryController";

import { authenticate } from "../middleware/authenticate";

const router = Router();
router.use(authenticate(["Members"]));

router.post("/send", createInquiry);

export default router;
