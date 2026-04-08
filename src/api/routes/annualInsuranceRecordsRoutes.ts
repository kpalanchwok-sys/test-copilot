import { Router } from "express";
import {
  createInsuranceRecord,
  deleteInsuranceRecord,
  getAllInsuranceRecord,
  getSingleInsuranceRecord,
  updateInsuranceRecord,
} from "../controllers/annualInsuranceRecordsController";

import { authenticate } from "../middleware/authenticate";

const router = Router();
router.use(authenticate(["Members"]));
router.post("/", createInsuranceRecord);
router.get("/", getAllInsuranceRecord);
router.get("/:id", getSingleInsuranceRecord);
router.patch("/:id", updateInsuranceRecord);
router.delete("/:id", deleteInsuranceRecord);

export default router;
