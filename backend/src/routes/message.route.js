import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import {getUsersForSideBar} from "../controllers/message.controller.js";
const router = express.Router();


router.get("/users", verifyToken, getUsersForSideBar);












export default router;