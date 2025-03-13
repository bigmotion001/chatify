import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import {getUsersForSideBar, getMessages, sendMessage} from "../controllers/message.controller.js";
const router = express.Router();


router.get("/users", verifyToken, getUsersForSideBar);
router.get("/:id", verifyToken, getMessages);
router.post("/send/:id", verifyToken, sendMessage);












export default router;