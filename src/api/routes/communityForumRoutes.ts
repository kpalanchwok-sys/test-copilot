import { Router } from "express";
import {
  addComment,
  createCommunityForum,
  deleteCommunityForum,
  getAllCommunityForum,
  getSingleCommunityForum,
  likeCommunityForum,
  updateCommunityForum,
} from "../controllers/communityForumController";

import { authenticate } from "../middleware/authenticate";

const router = Router();
router.use(authenticate(["Members"]));

router.post("/", createCommunityForum);
router.get("/", getAllCommunityForum);
router.get("/:id", getSingleCommunityForum);
router.patch("/:id", updateCommunityForum);
router.delete("/:id", deleteCommunityForum);

// comments
router.post("/:id/comments", addComment);
// router.delete("/:postId/comments/:commentId", deleteComment);

// likes
router.post("/:id/like", likeCommunityForum);

export default router;
