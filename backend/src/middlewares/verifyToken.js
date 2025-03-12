import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


export const verifyToken = (req, res, next)=>{
    try {
//check if there is a token
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({message: "Unauthorized, No token provided"});
            }
        
        //decode token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);  
            if(!decoded){
                return res.status(401).json({message: "Unauthorized"});
            }
            //extract userid from the decoded token
           
            req.userId = decoded.userId;
            next();

    } catch (error) {
        
    }
}