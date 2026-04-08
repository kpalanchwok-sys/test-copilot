import { Router } from "express";
import {
  createBoatInventory,
  deleteBoatInventory,
  getAllBoatInventorys,
  getSingleBoatInventory,
  updateBoatInventory,
} from "../controllers/boatInventoryController";

import { authenticate } from "../middleware/authenticate";

const router = Router();
router.use(authenticate(["Members"]));

router.post("/", createBoatInventory);
router.get("/", getAllBoatInventorys);
router.get("/:id", getSingleBoatInventory);
router.patch("/:id", updateBoatInventory);
router.delete("/:id", deleteBoatInventory);

export default router;
