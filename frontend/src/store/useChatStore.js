import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";



export const useChatStore = create((set) => ({
    messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,




//get users fro message
getUsers: async()=>{
    set({isUsersLoading: true})
    try{
        const res = await axiosInstance.get("/message/users");
        set({users: res.data})

    }catch(e){
        console.log("error in getting users", e);
            toast.error(e.response.data.message); 

    }finally{
        set({isUsersLoading: false})
    }
},

//get messages
getMessages: async(userId)=>{
    set({isMessagesLoading: true})
    try{
        const res = await axiosInstance.get(`/message/${userId}`);
        set({messages: res.data});

    }catch(e){
        console.log("error in getting messages", e);
            toast.error(e.response.data.message); 

    }finally{
        set({isMessagesLoading: false})
    }
},

//set selected user
setSelectedUser: async(selectedUser)=> set({selectedUser})


}));