import { Router } from "express";
import {
  createMaintenanceRecord,
  deleteMaintenanceRecord,
  getAllMaintenanceRecord,
  getSingleMaintenanceRecord,
  updateMaintenanceRecord,
} from "../controllers/annualMaintenanceRecordsController";

import { authenticate } from "../middleware/authenticate";

const router = Router();
router.use(authenticate(["Members"]));

router.post("/", createMaintenanceRecord);
router.get("/", getAllMaintenanceRecord);
router.get("/:id", getSingleMaintenanceRecord);
router.put("/:id", updateMaintenanceRecord);
router.delete("/:id", deleteMaintenanceRecord);

export default router;
