import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import {io} from "socket.io-client";

const BASE_URL = import.meta.env.MODE ==="development"?"http://localhost:3001":"/";

export const useAuthStore = create((set, get) => ({
    authUser:null,
    isLoading:false,
    isCheckingAuth:true,
    onlineUsers:[],
    socket:null,

    checkAuth: async()=>{
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser:res.data});
            get().connectSocket();
        } catch (error) {
            console.log(error);
            set({authUser:null});

            
        }finally{
            set({isCheckingAuth:false});
        }
    },

    //sign up
    signup: async(name, email, password)=>{
        set({isLoading:true});
        try{
         const res =   await axiosInstance.post("auth/signup", {name, email, password});
         set({authUser: res.data.user});
         toast.success("Account Created Successfully..")
         get().connectSocket();

        }catch(e){
            toast.error(e.response.data.message);
            

        }finally{
            set({isLoading:false});
        }


    },
    //login
    login: async(email, password)=>{
        set({isLoading:true});
        try{
            const res = await axiosInstance.post("/auth/login", {email, password});
            set({authUser: res.data.user});
         toast.success("Account Login Successfully..");
         //connect to socket.io
         get().connectSocket();


        }catch(e){
            toast.error(e.response.data.message);

        }finally{
            set({isLoading:false});
        }

    },
    //logout
    logout: async()=>{
        try{
            await axiosInstance.post("/auth/logout");
            set({authUser: null});
            toast.success("Account Logout Successfully..")
            get().disconnectSocket();

        }catch(e){
            toast.error(e.response.data.message);

        }
    },
    updateProfile: async(profilePic)=>{
        set({isLoading:true});
        try{
            const res= await axiosInstance.put("/auth/update-profile", profilePic)
             set({authUser: res.data});
         toast.success("Profile Updated Successfully..")

        }catch(e){
            console.log("error in uploading profile", e);
            toast.error(e.response.data.message); 
        }finally{
            set({isLoading:false});
        }
    },

    //connect socket
    connectSocket: async()=>{
        const {authUser} = get();
        if(!authUser || get().socket?.connected)return;
     const socket = io(BASE_URL, {
        query:{
            userId: authUser._id,
        }
     });
     socket.connect();
     set({socket: socket});
     socket.on("getOnlineUsers", (userIds)=>{
        set({onlineUsers: userIds});

     })
    },

    //dis connect socket
    disconnectSocket: async()=>{
      if(get().socket?.connected) get().socket.disconnect();
    },
}));