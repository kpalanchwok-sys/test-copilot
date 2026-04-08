import { Router } from "express";
import {
  createEmergencyContact,
  deleteEmergencyContact,
  getAllEmergencyContacts,
  getEmergencyContactById,
  updateEmergencyContact,
} from "../controllers/emergencyContactController";

import { authenticate } from "../middleware/authenticate";

const router = Router();
router.use(authenticate(["Members"]));

router.post("/", createEmergencyContact);
router.get("/", getAllEmergencyContacts);
router.get("/:id", getEmergencyContactById);
router.put("/:id", updateEmergencyContact);
router.delete("/:id", deleteEmergencyContact);

export default router;
