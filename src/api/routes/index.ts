import { Router } from "express";
import {
  deleteFiles,
  getPresignedUrlsController,
} from "../controllers/getPresignedUrlsController";
import { confirmUpload } from "../utils/uploadToS3";
import alertRoutes from "./alertRoutes";
import annualInsuranceRecordsRoutes from "./annualInsuranceRecordsRoutes";
import annualMaintenanceRecordsRoutes from "./annualMaintenanceRecordsRoutes";
import appVersionManagementRoutes from "./appVersionManagementRoutes";
import appVersionRoutes from "./appVersionRoutes";
import authRoutes from "./authRoutes";
import boatInventoryRoutes from "./boatInventoryRoutes";
import boatRoutes from "./boatRoutes";
import communityForumRoutes from "./communityForumRoutes";
import communityNewsRoutes from "./communityNewsRoutes";
import communityTipsRoutes from "./communityTipsRoutes";
import educationCourseRoutes from "./educationCourseRoutes";
import emergencyContactRoutes from "./emergencyContactRoutes";
import enrolmentsRoutes from "./enrolmentsRoutes";
import equipmentRoutes from "./equipmentRoutes";
import eventManagementRoutes from "./eventManagementRoutes";
import fuelWaterLogRoutes from "./fuelWaterLogRoutes";
import inquiryRoutes from "./inquiryRoutes";
import journeyRoutes from "./journeyRoutes";
import maintenanceItemRoutes from "./maintenanceItemRoutes";
import marinaRoutes from "./marinaRoutes";
import marketplaceRoutes from "./marketplaceRoutes";
import mechanicalRoutes from "./mechanicalRoutes";
import notificationRoutes from "./notificationRoutes";
import orderStickerRoutes from "./orderStickerRoutes";
// import paymentRoutes from "./paymentRoutes";
import { RequestHandler } from "express";
import multer from "multer";
import { uploadAvatar } from "../controllers/authController";
import { runSetReminderCron } from "../cron/setReminderCron";
import { authenticate } from "../middleware/authenticate";
import boatProjectRoutes from "./boatProjectRoutes";
import complianceDocumentRoutes from "./complianceDocumentRoutes";
import qrCodeRoutes from "./qrCodeRoutes";
import serviceJobRoutes from "./serviceJobRoutes";
import serviceRecordRoutes from "./serviceRecordRoutes";
import setReminderRoutes from "./setReminderRoutes";
import siteDetailRoutes from "./siteDetailRoutes";
import surveyRoutes from "./surveyRoutes";
import taskRoutes from "./taskRoutes";
import userManagementRoutes from "./userManagementRoutes";
import waterwayAlertRoutes from "./waterwayAlertRoutes";

const router = Router();
router.use("/Boats", boatRoutes);
router.use("/Alerts", alertRoutes);
router.use("/auth", authRoutes);
router.use("/AnnualInsuranceRecords", annualInsuranceRecordsRoutes);
router.use("/AnnualMaintenanceRecords", annualMaintenanceRecordsRoutes);
router.use("/AppVersion", appVersionRoutes);
router.use("/user/device", appVersionManagementRoutes);
router.use("/BoatInventory", boatInventoryRoutes);
router.use("/CommunityNews", communityNewsRoutes);
router.use("/CommunityForum", communityForumRoutes);
router.use("/CommunityTips", communityTipsRoutes);
router.use("/EducationCourses", educationCourseRoutes);
router.use("/EmergencyContacts", emergencyContactRoutes);
router.use("/Enrolments", enrolmentsRoutes);
router.use("/Equipment", equipmentRoutes);
router.use("/Event", eventManagementRoutes);
router.use("/Inquiries", inquiryRoutes);
router.use("/FuelWaterLogs", fuelWaterLogRoutes);
router.use("/Journeys", journeyRoutes);
router.use("/MaintenanceItems", maintenanceItemRoutes);
router.use("/MarinaDetails", marinaRoutes);
router.use("/Marketplace", marketplaceRoutes);
router.use("/Mechanical", mechanicalRoutes);
router.use("/Notification", notificationRoutes);
router.use("/OrderStickers", orderStickerRoutes);
router.use("/QrCodes", qrCodeRoutes);
router.use("/setReminder", setReminderRoutes);
router.use("/ServiceJobs", serviceJobRoutes);
router.use("/ServiceRecords", serviceRecordRoutes);
router.use("/SiteDetails", siteDetailRoutes);
router.use("/Surveys", surveyRoutes);
router.use("/Tasks", taskRoutes);
router.use("/WaterwayAlerts", waterwayAlertRoutes);
router.use("/User", userManagementRoutes);
// router.use("/Payment", paymentRoutes);
router.use("/boatProject", boatProjectRoutes);
router.use("/complianceDocuments", complianceDocumentRoutes);

router.post("/:resource/:id/files/uploadPlan", getPresignedUrlsController);

// Confirm uploaded files (array of files)
router.patch("/:resource/:id/files/confirmUpload", confirmUpload);

// Delete files (array of files)
router.delete("/:resource/:id/files", deleteFiles);

// for user avatar
router.use(authenticate(["Members"]));
// Store file in memory so req.file.buffer is available for S3
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.patch(
  "/:resource/:id/profile/image",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]) as unknown as RequestHandler,
  uploadAvatar,
);

// corn job for reminder test
router.post("/test/run-reminder-cron", async (req, res) => {
  try {
    await runSetReminderCron();
    res.status(200).json({ message: "Reminder cron executed successfully." });
  } catch (error) {
    res.status(500).json({ message: "Cron execution failed.", error });
  }
});

export default router;
