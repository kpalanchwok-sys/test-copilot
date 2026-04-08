import { Router } from "express";
import {
  createJourney,
  deleteJourney,
  getAllJourney,
  getSingleJourney,
  updateJourney,
  wayPointJourney,
} from "../controllers/journeyController";

import { authenticate } from "../middleware/authenticate";

const router = Router();
router.use(authenticate(["Members"]));

router.post("/", createJourney);
router.get("/", getAllJourney);
router.get("/:id", getSingleJourney);
router.patch("/:id", updateJourney);
router.delete("/:id", deleteJourney);

router.post("/:id/waypoints", wayPointJourney);

export default router;
