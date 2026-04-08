import { Router } from "express";
import {
  createSetReminder,
  deleteSetReminder,
  getAllSetReminders,
  getSetReminderById,
  updateSetReminder,
} from "../controllers/setReminderController";
import { authenticate } from "../middleware/authenticate";

const router = Router();
router.use(authenticate(["Members", "organization"]));

router.post("/", createSetReminder);
router.get("/", getAllSetReminders);
router.get("/:setReminderId", getSetReminderById);
router.patch("/:setReminderId", updateSetReminder);
router.delete("/:setReminderId", deleteSetReminder);

export default router;
