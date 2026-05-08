import { Router } from "express";
import { auth } from "../middleware/authMiddleware.js";
import { cancelBooking, createBooking, makePayment, myBookings, seatAvailability } from "../controllers/bookingController.js";

const router = Router();
router.get("/seats/:trainId", seatAvailability);
router.post("/", auth, createBooking);
router.post("/payment/:bookingId", auth, makePayment);
router.get("/my", auth, myBookings);
router.post("/cancel/:bookingId", auth, cancelBooking);
export default router;
