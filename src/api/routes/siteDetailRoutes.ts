import { Router } from "express";
import {
  addSiteDetailReview,
  createSiteDetail,
  deleteSiteDetail,
  getAllSiteDetails,
  getSingleSiteDetail,
  updateSiteDetail,
} from "../controllers/siteDetailController";

import { authenticate } from "../middleware/authenticate";

const router = Router();
router.use(authenticate(["Members"]));

router.post("/", createSiteDetail);
router.get("/", getAllSiteDetails);
router.get("/:id", getSingleSiteDetail);
router.put("/:id", updateSiteDetail);
router.delete("/:id", deleteSiteDetail);

// add review
router.post("/:id/reviews", addSiteDetailReview);

export default router;
