import { Router } from "express";
import {
  createServiceRecord,
  deleteServiceRecord,
  getAllServiceRecord,
  getSingleServiceRecord,
  updateServiceRecord,
} from "../controllers/serviceRecordController";
import { authenticate } from "../middleware/authenticate";

const router = Router();
router.use(authenticate(["Members"]));

router.post("/", createServiceRecord);
router.get("/", getAllServiceRecord);
router.get("/:id", getSingleServiceRecord);
router.put("/:id", updateServiceRecord);
router.delete("/:id", deleteServiceRecord);

export default router;
