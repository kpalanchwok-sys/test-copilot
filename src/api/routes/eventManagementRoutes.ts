import { RequestHandler, Router } from "express";
import multer from "multer";
import {
  createEventCategory,
  deleteEvent,
  deleteEventCategory,
  getEventById,
  getEventCategories,
  getMyEvents,
  updateEventCategory,
  upsertEvent,
} from "../controllers/eventManagementController";

import { authenticate } from "../middleware/authenticate";

const router = Router();
router.use(authenticate(["Members", "organization"]));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post(
  "/",
  upload.single("image") as unknown as RequestHandler,
  upsertEvent,
);
router.get("/", getMyEvents);
router
  .route("/:id")
  .get(getEventById)
  .put(upload.single("image") as unknown as RequestHandler, upsertEvent)
  .delete(deleteEvent);

router.post("/:id/category", createEventCategory);
router.get("/:id/category", getEventCategories);
router.put("/:id/category/:categoryName", updateEventCategory);
router.delete("/:id/category/:categoryName", deleteEventCategory);

// to do entry routes
export default router;
