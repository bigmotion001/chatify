import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());



app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Chatify backend is running");
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port http://localhost:${PORT}/`);
});
