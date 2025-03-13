import Navbar from "./component/Navbar"
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage"
import SignupPage from "./pages/SignupPage"
import LoginPage from "./pages/LoginPage"
import ProfilePage from "./pages/ProfilePage"
import SettingsPage from "./pages/SettingsPage"
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import Loader from "./lib/Loaders";



function App() {
  const {authUser, isCheckingAuth,  checkAuth} =useAuthStore();

useEffect(()=>{
  checkAuth();
},[checkAuth]);
console.log(authUser);

if(isCheckingAuth && !authUser) return (
  <Loader/>
);
  
 


  return (
    

    <div>
      <Navbar/>
      <Routes>
         <Route  path="/" element={authUser? <HomePage />: <Navigate to="/login"/>} />
         <Route  path="/signup" element={!authUser?<SignupPage />: <Navigate to="/"/>}  />
         <Route  path="/login" element={!authUser? <LoginPage /> : <Navigate to="/"/>}  />
         <Route  path="/profile" element={authUser?<ProfilePage />: <Navigate to="/login"/>}  />
         <Route  path="/settings" element={authUser?<SettingsPage />: <Navigate to="/login"/>}  />
      </Routes>
    </div>
  )
}

export default App
