import { Router } from "express";
import { auth, adminOnly } from "../middleware/authMiddleware.js";
import { bookingAnalytics, congestionAnalytics, platformAnalytics, predictionAnalytics, smartRecommendations } from "../controllers/analyticsController.js";

const router = Router();
router.get("/recommendations", auth, smartRecommendations);
router.use(auth, adminOnly);
router.get("/bookings", bookingAnalytics);
router.get("/predictions", predictionAnalytics);
router.get("/platforms", platformAnalytics);
router.get("/congestion", congestionAnalytics);
export default router;
