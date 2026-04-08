import { Router } from "express";
import {
  addReview,
  createMarina,
  deleteMarina,
  getAllMarinas,
  getSingleMarina,
  updateMarina,
} from "../controllers/marinaController";
import { authenticate } from "../middleware/authenticate";

const router = Router();
router.use(authenticate(["Members"]));

router.post("/", createMarina);
router.get("/", getAllMarinas);
router.get("/:id", getSingleMarina);
router.patch("/:id", updateMarina);
router.delete("/:id", deleteMarina);

router.post("/:id/reviews", addReview);

export default router;
