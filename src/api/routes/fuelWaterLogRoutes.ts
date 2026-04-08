import { Router } from "express";
import {
  createFuelLog,
  deleteFuelLog,
  getAllFuelLogs,
  getSingleFuelLog,
  updateFuelLog,
} from "../controllers/fuelWaterLogController.";
import { authenticate } from "../middleware/authenticate";

const router = Router();
router.use(authenticate(["Members"]));

router.post("/", createFuelLog);
router.get("/", getAllFuelLogs);
router.get("/:id", getSingleFuelLog);
router.put("/:id", updateFuelLog);
router.delete("/:id", deleteFuelLog);

export default router;
