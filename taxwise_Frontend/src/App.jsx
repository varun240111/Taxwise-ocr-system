import { useState,useEffect} from 'react';
import SplashScreen from './components/splash/SplashScreen.jsx';
import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Signup.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from './components/dashboard/Dashboard.jsx';
import VerifyOtp from "./components/auth/VerifyOtp";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import AuthLoader from "./components/auth/AuthLoader.jsx";
import ProfileSetup from "./components/profile/ProfileSetup.jsx"

function App() {
  return(
    <AuthLoader>  
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path='/verify-otp' element={<VerifyOtp />} />
        <Route 
          path="/profile/setup"
          element={
            <ProtectedRoute>
              <ProfileSetup />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthLoader>
  )
}

export default App;