import { Router } from "express";
import {
  createServiceRequest,
  deleteServiceRequest,
  getAllServiceRequests,
  getSingleServiceRequest,
  updateServiceRequest,
} from "../controllers/serviceJobController";

import { authenticate } from "../middleware/authenticate";

const router = Router();
router.use(authenticate(["Members"]));

router.post("/", createServiceRequest);
router.get("/", getAllServiceRequests);
router.get("/:id", getSingleServiceRequest);
router.put("/:id", updateServiceRequest);
router.delete("/:id", deleteServiceRequest);

export default router;
