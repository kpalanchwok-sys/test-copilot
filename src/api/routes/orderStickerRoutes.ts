import { Router } from "express";
import {
  createOrderSticker,
  deleteOrderSticker,
  getAllOrderStickers,
  getSingleOrderSticker,
  updateOrderSticker,
} from "../controllers/orderStickerController";
import { authenticate } from "../middleware/authenticate";

const router = Router();
router.use(authenticate(["Members"]));

router.post("/", createOrderSticker);
router.get("/", getAllOrderStickers);
router.get("/:id", getSingleOrderSticker);
router.put("/:id", updateOrderSticker);
router.delete("/:id", deleteOrderSticker);

export default router;
