import { Router } from "express";
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
} from "../controllers/educationCourseController";

import { authenticate } from "../middleware/authenticate";

const router = Router();
router.use(authenticate(["Members"]));

router.post("/", createCourse);
router.get("/", getAllCourses);
router.get("/:id", getCourseById);
router.patch("/:id", updateCourse);
router.delete("/:id", deleteCourse);

export default router;
