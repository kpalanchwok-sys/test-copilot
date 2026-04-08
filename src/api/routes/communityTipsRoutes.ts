import { Router } from "express";

import {
  addComment,
  createCommunityTips,
  deleteCommunityTips,
  getAllCommunityTips,
  getSingleCommunityTips,
  likeCommunityTips,
  updateCommunityTips,
} from "../controllers/communityTipsController";
import { authenticate } from "../middleware/authenticate";

const router = Router();
router.use(authenticate(["Members"]));

router.post("/", createCommunityTips);
router.get("/", getAllCommunityTips);
router.get("/:id", getSingleCommunityTips);
router.patch("/:id", updateCommunityTips);
router.delete("/:id", deleteCommunityTips);

// comments
router.post("/:id/comments", addComment);
// router.delete("/:postId/comments/:commentId", deleteComment);

// likes
router.post("/:id/like", likeCommunityTips);

export default router;
