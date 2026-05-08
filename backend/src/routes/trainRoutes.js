import { Router } from "express";
import { getCities, getTrainDetails, searchTrains } from "../controllers/trainController.js";

const router = Router();
router.get("/cities", getCities);
router.get("/search", searchTrains);
router.get("/:id", getTrainDetails);
export default router;
