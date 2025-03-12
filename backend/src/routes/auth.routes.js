import express from "express";
const router = express.Router();
import { signup, login, logout } from "../controllers/auth.contoller.js";

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
