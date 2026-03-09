import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { baseURL } from "../../../Environment/environment";
import { AuthContext } from "../../../Context/Auth Context/AuthContext";
import { useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function LoginComponent() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${baseURL}/auth/login`, data);
      if (res.data.success) {
        login(res.data.token);
        toast.success("Login successful ✅");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Something went wrong, try again",
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      
      {/* Left Side Illustration + Animation */}
      <div className="relative md:flex-1 hidden md:flex items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-500 overflow-hidden">
        {/* Animated floating blobs */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-indigo-400/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-3xl"
        />

        {/* Illustration / Lottie placeholder */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2 }}
          className="z-10 text-white text-center px-6"
        >
          <h1 className="text-5xl font-bold mb-4">Welcome to CRM System</h1>
          <p className="text-lg opacity-90">
            Manage your customers, sales, and analytics from a single dashboard.
          </p>
          {/* هنا ممكن تحط Lottie component */}
        </motion.div>
      </div>

      {/* Right Side Form */}
      <div className="flex-1 flex items-center justify-center bg-slate-950 px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md relative z-10 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl p-10"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Sign in to Dashboard
            </h2>
            <p className="text-gray-400">
              Enter your credentials to access your CRM panel
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="admin@crm.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-400">
                <input type="checkbox" className="accent-indigo-500" />
                Remember me
              </label>

              <a
                href="/forgetpassword"
                className="text-indigo-400 hover:text-indigo-500 transition"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white py-3 rounded-xl font-semibold"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            Don’t have an account?{" "}
            <Link className="text-indigo-400 hover:text-indigo-500" to={'/register'}>
              Sign up
            </Link>
          </p>

          <p className="text-center text-gray-500 text-xs mt-6">
            © {new Date().getFullYear()} CRM System
          </p>
        </motion.div>
      </div>
    </div>
  );
}