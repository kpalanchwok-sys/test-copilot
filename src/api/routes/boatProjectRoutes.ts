import { Router } from "express";

import {
  addComment,
  createBoatProject,
  deleteBoatProject,
  deleteComment,
  getAllBoatProjects,
  getAllComments,
  getBoatProjectById,
  getSingleComment,
  updateBoatProject,
  updateComment,
} from "../controllers/boatProjectController";
import { authenticate } from "../middleware/authenticate";

const router = Router();
router.use(authenticate(["Members", "organization"]));

router.post("/", createBoatProject);
router.get("/", getAllBoatProjects);
router.get("/:projectId", getBoatProjectById);
router.patch("/:projectId", updateBoatProject);
router.delete("/:projectId", deleteBoatProject);

router.post("/:projectId/comments", addComment);
router.patch("/:projectId/comment/:commentId", updateComment);
router.get("/:projectId/comments", getAllComments);
router.get("/:projectId/comment/:commentId", getSingleComment);
router.delete("/:projectId/comment/:commentId", deleteComment);

export default router;
