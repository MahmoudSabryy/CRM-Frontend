import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { baseURL } from "../../../Environment/environment";

export default function Logincomponent() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${baseURL}/auth/login`, data);

      if (res.data.success === true) {
        localStorage.setItem("token", res.data.token);
        toast.success("login successfull ✅");
        return navigate("/");
      }
    } catch (error) {
      toast.error(
        error.response.data.error ||
          error.response.data ||
          "Too many requests please try again in 5 minutes",
      );
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-indigo-600 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute top-40 -left-40 w-[500px] h-[500px] bg-blue-500 rounded-full blur-3xl opacity-20"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-[#111827] border border-white/10 rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white">
            Welcome Back 👋
          </h2>
          <p className="text-gray-400 mt-2">Login to continue shopping</p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="please enter your email"
              className="w-full bg-[#0B0F1A] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-[#0B0F1A] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-400">
              <input type="checkbox" className="accent-indigo-600" />
              Remember me
            </label>

            <Link
              to={"/forgetpassword"}
              className="text-indigo-400 hover:text-indigo-500 transition"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white py-3 rounded-xl font-semibold"
          >
            LOGIN
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="px-3 text-sm text-gray-400">OR</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        {/* Register */}
        <p className="text-center text-gray-400 mt-6">
          Don’t have an account?{" "}
          <Link
            className="text-indigo-400 hover:text-indigo-500 cursor-pointer"
            to={"/signup"}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
