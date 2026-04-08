import { Router } from "express";
import {
  createBoat,
  deleteBoat,
  deleteBoatFiles,
  getAllBoats,
  getSingleBoat,
  updateBoat,
} from "../controllers/boatController";
import { authenticate } from "../middleware/authenticate";

const router = Router();
router.use(authenticate(["Members"]));
router.post("/", createBoat);
router.get("/", getAllBoats);
router.get("/:id", getSingleBoat);
router.patch("/:id", updateBoat);
router.delete("/:id", deleteBoat);
router.delete("/:boatId/files", deleteBoatFiles);
export default router;
