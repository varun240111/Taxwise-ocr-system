import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../services/api";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/authSlice.js";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const userId = location.state?.userId;
  const [otp, setOtp] = useState("");

  
  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/verify-otp", {
        userId,
        otp,
      });
      
      dispatch(
        setCredentials({
          token: response.data.token,
          user: response.data.user,
        })
      );

      alert("OTP verified successfully");

      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060816] text-white px-6">
      <form
        onSubmit={handleVerify}
        className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/10 p-10 backdrop-blur-xl"
      >
        <h1 className="text-4xl font-black">Verify OTP</h1>
        <p className="mt-3 text-slate-400">
          Enter OTP shown in backend console/testing response.
        </p>

        <input
          type="text"
          maxLength="6"
          placeholder="Enter 6 digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="mt-8 w-full rounded-2xl border border-white/10 bg-white/10 px-6 py-4 text-white outline-none focus:border-emerald-400"
        />

        <button
          type="submit"
          className="mt-6 w-full rounded-2xl bg-gradient-to-r from-[#D4A853] to-[#1DB489] py-4 font-black text-[#050816]"
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
}