import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api.js";
import { useSelector } from "react-redux";


export default function Signup() {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

   useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Password and Confirm Password do not match");
      return;
    }
    try {
      const response = await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      //  console.log("Signup Success:", response.data);

      alert("Account created. OTP sent.");

      navigate("/verify-otp", {
        state: {
          userId: response.data.pendingUserId,
        },
      });
      } catch (error) {
        console.log(error);
        alert(error.response?.data?.message || "Signup failed");
      }
    };
 
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-6 py-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#10b98155,transparent_35%),radial-gradient(circle_at_bottom_right,#6366f155,transparent_35%)]" />

      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 rounded-[2rem] overflow-hidden border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl">
        <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-emerald-500/20 to-indigo-500/10">
          <div>
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-4xl mb-8">
              🚀
            </div>

            <h1 className="text-5xl font-black text-white leading-tight">
              Start Saving <br />
              <span className="text-emerald-300">Tax Smartly</span>
            </h1>

            <p className="mt-6 text-slate-300 leading-7">
              Create your account and get personalized tax planning, investment
              suggestions, document vault and HR declaration reports.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
            <p className="text-slate-400 text-sm">After signup</p>
            <h3 className="text-white text-xl font-bold mt-1">
              We create your secure user profile
            </h3>
            <p className="text-slate-400 text-sm mt-2">
              Salary, tax, documents and suggestions will be connected with your
              unique user ID.
            </p>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <p className="text-emerald-300 text-sm font-bold tracking-[0.3em] uppercase">
            Create Account
          </p>

          <h2 className="text-4xl font-black text-white mt-3">
            Join TaxWise Vault
          </h2>

          <p className="text-slate-400 mt-2">
            Signup now. Financial profile comes in the next step.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="text-slate-300 text-sm">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="your full name"
                value={formData.name}
                onChange={handleChange}
                required
                className="cursor-text mt-2 w-full rounded-2xl bg-white/10 border border-white/10 px-5 py-3.5 text-white outline-none focus:border-emerald-400 transition"
              />
            </div>

            <div>
              <label className="text-slate-300 text-sm">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="cursor-text mt-2 w-full rounded-2xl bg-white/10 border border-white/10 px-5 py-3.5 text-white outline-none focus:border-emerald-400 transition"
              />
            </div>

            <div>
              <label className="text-slate-300 text-sm">Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleChange}
                required
                className="cursor-text mt-2 w-full rounded-2xl bg-white/10 border border-white/10 px-5 py-3.5 text-white outline-none focus:border-emerald-400 transition"
              />
            </div>

            <div>
              <label className="text-slate-300 text-sm">Password</label>
              <input
                type="password"
                name="password"
                placeholder="minimum 8 characters"
                value={formData.password}
                onChange={handleChange}
                required
                className="cursor-text mt-2 w-full rounded-2xl bg-white/10 border border-white/10 px-5 py-3.5 text-white outline-none focus:border-emerald-400 transition"
              />
            </div>

            <div>
              <label className="text-slate-300 text-sm">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="cursor-text mt-2 w-full rounded-2xl bg-white/10 border border-white/10 px-5 py-3.5 text-white outline-none focus:border-emerald-400 transition"
              />
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-black shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition"
            >
              Create Secure Account
            </button>
          </form>

          <p className="text-center text-slate-400 mt-6">
            Already have account?{" "}
            <button
                type="button"
                onClick={() => navigate("/login")}
                className="cursor-pointer text-emerald-300 font-bold hover:text-emerald-200"
              >
                Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};