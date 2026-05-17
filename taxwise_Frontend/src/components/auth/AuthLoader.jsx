import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
// import api from "../../services/api";
import axios from "axios";
import { setCredentials, logout } from "../../store/authSlice";

export default function AuthLoader({ children }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const silentLogin = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/refresh",
          {},
          {
            withCredentials: true,
          }
        );
        dispatch(
          setCredentials({
            token: response.data.token,
            user: response.data.user,
          })
        );
      } catch (error) {
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    silentLogin();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#060816] text-white">
        <div className="text-center">
          <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-emerald-400" />
          <p className="text-slate-400">Checking secure session...</p>
        </div>
      </div>
    );
  }

  return children;
}