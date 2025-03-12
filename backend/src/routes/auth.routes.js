import express from "express";
const router = express.Router();
import { signup, login, logout, updateProfile, getUser } from "../controllers/auth.contoller.js";

import { verifyToken } from "../middlewares/verifyToken.js";

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/update-profile", verifyToken, updateProfile);
router.get("/user", verifyToken, getUser);

export default router;
