import { Router } from "express";
import { auth, adminOnly } from "../middleware/authMiddleware.js";
import {
  addTrain,
  allTrains,
  allUsers,
  autoAssignPlatform,
  deleteTrain,
  updateTrain,
  manualOverridePlatform,
  assignmentHistory,
  reportsSummary,
  createSchedule,
  listSchedules,
  exportCsvReport
} from "../controllers/adminController.js";

const router = Router();
router.use(auth, adminOnly);
router.post("/trains", addTrain);
router.get("/trains", allTrains);
router.put("/trains/:id", updateTrain);
router.delete("/trains/:id", deleteTrain);
router.get("/users", allUsers);
router.post("/platform-assign", autoAssignPlatform);
router.post("/platform-override", manualOverridePlatform);
router.get("/platform-assignments", assignmentHistory);
router.get("/reports", reportsSummary);
router.get("/reports/csv", exportCsvReport);
router.post("/schedules", createSchedule);
router.get("/schedules", listSchedules);
export default router;
