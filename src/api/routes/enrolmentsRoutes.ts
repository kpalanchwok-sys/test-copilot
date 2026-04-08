import { Router } from "express";
import { createEquipment } from "../controllers/equipmentController";

import { authenticate } from "../middleware/authenticate";

const router = Router();
router.use(authenticate(["Members"]));

router.post("/", createEquipment);

export default router;
