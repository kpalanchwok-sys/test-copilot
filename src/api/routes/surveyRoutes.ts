import { Router } from "express";
import {
  createSurvey,
  deleteSurvey,
  getAllSurveys,
  getSingleSurvey,
  updateSurvey,
} from "../controllers/surveyController";
import { authenticate } from "../middleware/authenticate";

const router = Router();
router.use(authenticate(["Members"]));

router.post("/", createSurvey);
router.get("/", getAllSurveys);
router.get("/:id", getSingleSurvey);
router.patch("/:id", updateSurvey);
router.delete("/:id", deleteSurvey);

export default router;
