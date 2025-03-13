import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";



export const useAuthStore = create((set) => ({
    authUser:null,
    isLoading:false,
   
    isUpdatingProfile:false,
    isCheckingAuth:true,

    checkAuth: async()=>{
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser:res.data});
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
         toast.success("Account Login Successfully..")


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


        }catch(e){
            toast.error(e.response.data.message);

        }
    }
}));