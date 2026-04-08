import { Router } from "express";
import {
  createMarketplace,
  deleteMarketplace,
  getAllMarketplace,
  getSingleMarketplace,
  updateMarketplace,
} from "../controllers/marketplaceController";

import { authenticate } from "../middleware/authenticate";

const router = Router();
router.use(authenticate(["Members"]));

router.post("/", createMarketplace);
router.get("/", getAllMarketplace);
router.get("/:id", getSingleMarketplace);
router.patch("/:id", updateMarketplace);
router.delete("/:id", deleteMarketplace);

export default router;
