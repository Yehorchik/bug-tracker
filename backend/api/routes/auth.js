import express from "express";
import {
  signup,
  login,
  // googleLogin,
  // googleCallback,
  logout,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
// router.get('/auth/google', googleLogin);
// router.get('/auth/google/callback', googleCallback);

export default router;
