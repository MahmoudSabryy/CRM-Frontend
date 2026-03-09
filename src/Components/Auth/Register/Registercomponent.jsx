import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { baseURL } from "../../../Environment/environment";

export default function RegisterComponent() {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ mode: "onChange" });
  const password = watch("password");

  const onSubmitSignUp = async (data) => {
    try {
      // دمج firstName + lastName في name
      const payload = {
        name: data.firstName + " " + data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        address: data.address || null,
      };

      const res = await axios.post(`${baseURL}/auth/register`, payload);
      if (res.data.success) {
        toast.success("Signup successful ✅");
        navigate("/login");
      }
    } catch (err) {
      console.log(err.response);
      
      toast.error(err.response?.data?.error || "Registration failed, try again");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* Left Illustration */}
      <div className="relative md:flex-1 hidden md:flex items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-500 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-indigo-400/30 rounded-full blur-3xl animate-floatSlow"></div>
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-3xl animate-floatSlow"></div>
        <div className="z-10 text-white text-center px-6">
          <h1 className="text-5xl font-bold mb-4">Join Our CRM</h1>
          <p className="text-lg opacity-90">Manage leads, contacts, deals, and activities efficiently.</p>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center bg-slate-950 px-6">
        <div className="w-full max-w-md relative z-10 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl p-10">
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-gray-400">Fill in your details to register your account</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmitSignUp)}>

            {/* First & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  {...register("firstName", { required: "First name is required" })}
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  {...register("lastName", { required: "Last name is required" })}
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" }
                })}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: { value: /^[0-9]{8,15}$/, message: "Invalid phone number" }
                })}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" }
                })}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                  validate: value => value === password || "Passwords do not match"
                })}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>

            {/* Address */}
            <div>
              <input
                type="text"
                placeholder="Address (optional)"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register("address")}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 transition py-3 rounded-xl text-white font-semibold"
            >
              Register
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-500">
              Login
            </Link>
          </p>

          <p className="text-center text-gray-500 text-xs mt-6">
            © {new Date().getFullYear()} CRM System
          </p>
        </div>
      </div>
    </div>
  );
}