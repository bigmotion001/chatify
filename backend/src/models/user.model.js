import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Full name is required"]
    },
    email:{
        type: String,
        required:[true, "User email is required"],
        unique:true,
    },
    profilePic:{
        type:String,
        default:""
    },
    password:{
    type:String,
    required: [true, "Password is required"]
    }
    
}, { timestamps: true })

 const User = mongoose.model("User", userSchema);
 export default User;
 