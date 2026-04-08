import { Router } from "express";
import {
  createMaintenanceItem,
  deleteMaintenanceItem,
  getAllMaintenanceItem,
  getMaintenanceItemBoatById,
  getSingleMaintenanceItem,
  updateMaintenanceItem,
} from "../controllers/maintenanceItemController";

import { authenticate } from "../middleware/authenticate";

const router = Router();
router.use(authenticate(["Members"]));

router.post("/", createMaintenanceItem);
router.get("/", getAllMaintenanceItem);
router.get("/:id", getSingleMaintenanceItem);
router.patch("/:id", updateMaintenanceItem);
router.delete("/:id", deleteMaintenanceItem);
router.get("/by-boat/:boatId", getMaintenanceItemBoatById);

export default router;
