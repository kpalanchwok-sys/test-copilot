import { Router } from "express";
import {
  createComplianceDocument,
  deleteComplianceDocument,
  deleteSingleComplianceDocument,
  getAllComplianceDocuments,
  getComplianceDocumentById,
  getSingleComplianceDocument,
  updateComplianceDocument,
} from "../controllers/complianceDocumentController";
import { authenticate } from "../middleware/authenticate";

const router = Router();
router.use(authenticate(["Members", "organization"]));

router.post("/", createComplianceDocument);
router.get("/", getAllComplianceDocuments);
router.get("/:complianceDocumentId", getComplianceDocumentById);
router.get(
  "/:complianceDocumentId/documents/:documentId",
  getSingleComplianceDocument,
);
router.delete(
  "/:complianceDocumentId/documents/:documentId",
  deleteSingleComplianceDocument,
);
router.patch("/:complianceDocumentId", updateComplianceDocument);
router.delete("/:complianceDocumentId", deleteComplianceDocument);

export default router;
