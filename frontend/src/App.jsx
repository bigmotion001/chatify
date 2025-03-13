import Navbar from "./component/Navbar"
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage"
import SignupPage from "./pages/SignupPage"
import LoginPage from "./pages/LoginPage"
import ProfilePage from "./pages/ProfilePage"
import SettingsPage from "./pages/SettingsPage"
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";
import Loader from "./lib/Loaders";
import { Toaster } from "react-hot-toast";



function App() {
  const {authUser, isCheckingAuth,  checkAuth} =useAuthStore();
  const {theme} = useThemeStore();

useEffect(()=>{
  checkAuth();
},[checkAuth]);
console.log(authUser);

if(isCheckingAuth && !authUser) return (
  <Loader/>
);
  
 


  return (
    

    <div data-theme={theme}>
      <Navbar/>
      <Routes>
         <Route  path="/" element={authUser? <HomePage />: <Navigate to="/login"/>} />
         <Route  path="/signup" element={!authUser?<SignupPage />: <Navigate to="/"/>}  />
         <Route  path="/login" element={!authUser? <LoginPage /> : <Navigate to="/"/>}  />
         <Route  path="/profile" element={authUser?<ProfilePage />: <Navigate to="/login"/>}  />
         <Route  path="/settings" element={<SettingsPage />}  />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
