import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import {app, server} from "./lib/socket.js";


dotenv.config();
app
const PORT = process.env.PORT;



app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:"http://localhost:5173", credentials:true}))



const __dirname = path.resolve();


app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);




if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res)=>{
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  })
}






server.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port http://localhost:${PORT}/`);
});
