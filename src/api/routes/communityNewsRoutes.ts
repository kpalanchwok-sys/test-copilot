import { Router } from "express";
import {
  createCommunityNews,
  deleteCommunityNews,
  getAllCommunityNews,
  getSingleCommunityNews,
  updateCommunityNews,
} from "../controllers/communityNewsController";
import { trackCommunityNewsView } from "../controllers/communityNewsViewController";
import { authenticate } from "../middleware/authenticate";

const router = Router();
router.use(authenticate(["Members", "organization"]));
router.post("/", createCommunityNews);
router.get("/", getAllCommunityNews);
router.get("/:id", getSingleCommunityNews);
router.patch("/:id", updateCommunityNews);
router.delete("/:id", deleteCommunityNews);

router.post("/:newsId/view/track", trackCommunityNewsView);
export default router;
