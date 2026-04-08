import { Router } from "express";
import {
  createMechanical,
  deleteMechanical,
  deleteMechanicalEngine,
  getAllMechanical,
  getMechanicalById,
  updateMechanical,
  upsertEngine,
} from "../controllers/mechanicalController";

import { authenticate } from "../middleware/authenticate";

const router = Router();
router.use(authenticate(["Members"]));

router.post("/", createMechanical);
router.get("/", getAllMechanical);
router.get("/:id", getMechanicalById);
router.put("/:id", updateMechanical);
router.delete("/:id", deleteMechanical);

// engine specific
router.patch("/:id/engine/:engineId", upsertEngine);
router.delete("/:id/engine/:engineId", deleteMechanicalEngine); // test first

export default router;
