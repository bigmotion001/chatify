import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import  cloudinary from "../lib/cloudinary.js";
import {getReceiverSocketId, io} from "../lib/socket.js"


//get a user for the sidebar
export const getUsersForSideBar = async(req, res)=>{
    try {
        //login user id
        const loggedInUserId = req.userId;
        //filtter user
        const filteredUser = await User.find({_id: {$ne: loggedInUserId}}).select("-password");

        res.status(200).json(filteredUser);

    } catch (error) {
        console.log("error  in getting sidebar user message  controller", error);
        return res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
        
    }
}

//get our messages
export const getMessages = async(req, res) =>{
    try {
        //our receiver id
        const {id: userToChatId} = req.params;
        const senderId = req.userId;

        //find messages
        const messages = await Message.find({
            $or:[
                {senderId:senderId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:senderId}
            ]
        })
        res.status(200).json(messages);
        
    } catch (error) {
        console.log("error  in getting messages message  controller", error);
        return res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
        
    }
}

//send message
export const sendMessage = async(req, res)=>{
    try {
        const {text, image} = req.body;
        //receiver id
        const {id: receiverId} = req.params;
        //check if receiver id exist
        const receiver = await User.findById(receiverId);
        if(!receiver)return res.status(400).json({success:false, message: "Invalid Receiver Id"});
        //sender id
        const senderId = req.userId;
         //check if receiver id exist
         const my= await User.findById(senderId);
         if(!my)return res.status(400).json({success:false, message: "Invalid Sender Id"});

         //if user send image as message
         let imageURL;
         if(image){
            //upload to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageURL = uploadResponse.secure_url;
         }

         //create a message
         const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageURL
         });
         //save
         await newMessage.save();
         //todo: realtime functionality goes here => socket.io
         const receiverSocketId=getReceiverSocketId(receiverId);
           if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
           }

         res.status(201).json(newMessage);

        
    } catch (error) {
        console.log("error  in sending messages in message  controller", error);
        return res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
        
    }
}