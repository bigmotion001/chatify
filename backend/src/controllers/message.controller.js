import User from "../models/user.model.js";

export const getUsersForSideBar = async(req, res)=>{
    try {
        //login user id
        const loggedInUserId = req.userId;
        //filtter user
        const filteredUser = await User.find({_id: {$ne: loggedInUserId}}).select("-password");

        res.status(200).json(filteredUser);

    } catch (error) {
        
    }
}