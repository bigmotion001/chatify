import { generateToken } from "../lib/generateToken.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import  cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    //check if input is empty
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All filed are required" });
    }
    //check if email is a valid email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }
    //check if email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }
    //check if password is at least 6 characters long
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }
    //hash password
    const salt = await bcryptjs.genSalt(10); // 10 rounds of hashing
    const hashedPassword = await bcryptjs.hash(password, salt);
    //create a user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      //generate token
      generateToken(newUser._id, res);
      //save user
      await newUser.save();
      return res.status(201).json({
        success: true,
        message: "User Registered successfully",
        user: {
          ...newUser._doc,
          password: undefined,
        },
      });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "unable to create a user" });
    }
  } catch (error) {
    console.log("error in registering user controller", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    //check if filed is empty
    if (!email || !password)
      return res
        .status(401)
        .json({ success: false, message: "all filed are required" });
    //check if email is a valid email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }
    //check if user exist
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "User not found" });

    //check if password match
    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword)
      return res
        .status(401)
        .json({ success: false, message: "Invalid Password" });

    //generate token and set cookie
    generateToken(user._id, res);
    //send user details
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("error in login user controller", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log("error in logout user controller", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) =>{
    let {profilePic} = req.body;

    try {
     
      if(!profilePic) return res.status(401).json({success: false, message: "Profile picture is required"});
      //find user
      const user = await User.findById(req.userId).select("-password");
      if(!user)return res.status(400).json({success:false, message: "User not found"});

      //upload to cloudinary
   //if user already has a profile image, delete the previous one from cloudinary
   if (user.profilePic) {
                  
    await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
}
//upload the profile image to cloudinary
let uploadedProfilePic = await cloudinary.uploader.upload(profilePic);
profilePic = uploadedProfilePic.secure_url;

//update user profile
const updatedUser = await User.findByIdAndUpdate(req.userId, {profilePic: profilePic});

res.status(200).json(updatedUser);

        
    } catch (error) {
        console.log("error in update profile user controller", error);
        return res
          .status(500)
          .json({ success: false, message: "Something went wrong" });
        
    }
}

export const getUser = async(req, res) =>{

  try{
    //get user 
    const user = await User.findById(req.userId).select("-password");
    //check if user exist
    if(!user)return res.status(400).json({success: false, message: "User not found"});

    res.status(200).json(user);

  }catch(error){
    console.log("error in getting  user controller", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }

}
