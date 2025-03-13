import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";



export const useChatStore = create((set, get) => ({
    messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isLoading: false,




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

//send message
sendMessage: async(messageData)=>{
    const {selectedUser, messages} = get();
    set({isLoading: true});
    try{
  const res =  await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
  set({messages:[...messages, res.data]})
    }catch(e){
        console.log("error in getting messages", e);
        toast.error(e.response.data.message);  
    }finally{
        set({isLoading: false});
    }
},






//set selected user
setSelectedUser: async(selectedUser)=> set({selectedUser}),




}));