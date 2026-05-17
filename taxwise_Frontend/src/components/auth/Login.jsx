import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api.js";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/authSlice.js";
import { useSelector } from "react-redux";
import {useEffect} from "react";


export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

  try {
    const response = await api.post("/auth/login", formData);

    console.log("Login Success:", response.data);

    const token = response.data.token;

    console.log("JWT Token:", token);
    dispatch(setCredentials({ token:response.data.token,
      user:response.data.user,
    }));

    navigate("/dashboard");
  } catch (error) {
    console.log(error);
    alert(error.response?.data?.message || "Login failed");
  }
};

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#060816] text-white">
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#1DB48925,transparent_35%),radial-gradient(circle_at_bottom_right,#D4A85320,transparent_35%)]" />

      {/* GRID */}
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#ffffff22_1px,transparent_1px),linear-gradient(to_bottom,#ffffff22_1px,transparent_1px)] bg-[size:70px_70px]" />

      {/* ORBS */}
      <div className="absolute left-[-100px] top-[-100px] h-[320px] w-[320px] rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="absolute bottom-[-120px] right-[-120px] h-[360px] w-[360px] rounded-full bg-yellow-500/10 blur-3xl" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="grid w-full max-w-7xl grid-cols-1 overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] shadow-[0_0_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl lg:grid-cols-2">
          
          {/* LEFT */}
          <div className="relative hidden overflow-hidden p-12 lg:block">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-yellow-500/5" />

            <div className="relative z-10">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#D4A85344] bg-[#D4A85322] text-3xl shadow-lg shadow-yellow-500/20">
                  💰
                </div>

                <div>
                  <h1 className="text-4xl font-black tracking-tight">
                    TaxWise Vault
                  </h1>

                  <p className="mt-1 text-sm text-slate-400">
                    AI Powered Tax Optimization
                  </p>
                </div>
              </div>

              <h2 className="mt-16 text-6xl font-black leading-[1.05]">
                Reduce Your
                <span className="block bg-gradient-to-r from-[#D4A853] to-[#1DB489] bg-clip-text text-transparent">
                  Tax Legally.
                </span>
              </h2>

              <p className="mt-8 max-w-xl text-lg leading-8 text-slate-300">
                Smart salary analysis, AI investment suggestions, OCR salary
                parsing, HR declaration reports and future tax prediction — all
                in one secure vault.
              </p>

              {/* FLOATING CARDS */}
              <div className="mt-14 grid grid-cols-2 gap-5">
                <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl">
                  <p className="text-sm text-slate-400">80C Saving</p>
                  <h3 className="mt-2 text-4xl font-black text-[#D4A853]">
                    ₹1.5L
                  </h3>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl">
                  <p className="text-sm text-slate-400">AI Optimization</p>
                  <h3 className="mt-2 text-4xl font-black text-[#1DB489]">
                    94%
                  </h3>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl">
                  <p className="text-sm text-slate-400">NPS Extra</p>
                  <h3 className="mt-2 text-4xl font-black text-white">
                    ₹50K
                  </h3>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl">
                  <p className="text-sm text-slate-400">HR Ready</p>
                  <h3 className="mt-2 text-4xl font-black text-white">
                    PDF
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative p-8 md:p-14">
            <div className="mx-auto max-w-md">
              <div className="mb-10">
                <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#D4A853]">
                  Secure Access
                </p>

                <h2 className="mt-5 text-5xl font-black">
                  Welcome Back
                </h2>

                <p className="mt-4 text-slate-400 leading-7">
                  Login securely to continue your intelligent tax-saving
                  journey.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="mb-3 block text-sm font-medium text-slate-300">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder="example@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="cursor-text w-full rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-5 text-white outline-none backdrop-blur-xl transition-all focus:border-[#1DB489]"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-slate-300">
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    placeholder="Enter secure password"
                    value={formData.password}
                    onChange={handleChange}
                    className="cursor-text w-full rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-5 text-white outline-none backdrop-blur-xl transition-all focus:border-[#D4A853]"
                  />
                </div>

                <button
                  type="submit"
                  className=" cursor-pointer w-full rounded-2xl bg-gradient-to-r from-[#D4A853] to-[#1DB489] py-5 text-lg font-black text-[#050816] transition-all hover:scale-[1.02]"
                >
                  Login Securely
                </button>
              </form>

              <p className="mt-8 text-center text-slate-400">
                New to TaxWise Vault?{" "}
                <button
                   type="button"
                  onClick={() => navigate("/signup")}
                  className="cursor-pointer font-bold text-[#D4A853]"
                >
                  Create Account
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}