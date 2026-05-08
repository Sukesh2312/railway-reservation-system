import { Router } from "express";
import { body } from "express-validator";
import { adminLogin, login, me, register } from "../controllers/authController.js";
import { auth } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";

const router = Router();
router.post("/register",
  body("name").isLength({ min: 2 }),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  validateRequest,
  register
);
router.post("/login", body("email").isEmail(), body("password").notEmpty(), validateRequest, login);
router.post("/admin-login", body("email").isEmail(), body("password").notEmpty(), validateRequest, adminLogin);
router.get("/me", auth, me);
export default router;
