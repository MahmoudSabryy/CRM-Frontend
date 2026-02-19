import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { baseURL } from "../../../Environment/environment";

export default function RegisterComponent() {
  const [errorMsg, setErrorMsg] = useState("");

  const { register, handleSubmit } = useForm();

  const navigate = useNavigate();

  const onSubmitSignUp = async (formData) => {
    try {
      const { data } = await axios.post(`${baseURL}/auth/register`, formData);
      if (data.success) navigate("/login");

      toast.success("Signup successfully ✅");
    } catch (error) {
      setErrorMsg(
        error.response.data.error ||
          error.response.data ||
          "Too many requests please try again in 5 minutes",
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center px-6 py-1">
      <div className="w-full max-w-lg bg-[#111827] border border-white/10 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Create Account
        </h2>
        <form onSubmit={handleSubmit(onSubmitSignUp)} className="space-y-4">
          {errorMsg && <p className="text-red-500  mt-4">{errorMsg}</p>}

          <div className="grid grid-cols-2 gap-4">
            <input
              {...register("firstName", { required: "First name is required" })}
              type="text"
              placeholder="First Name"
              className="input-dark"
            />
            <input
              {...register("lastName", { required: "Last name is required" })}
              type="text"
              placeholder="Last Name"
              className="input-dark"
            />
          </div>

          <input
            {...register("userName", { required: "user name is required" })}
            type="text"
            placeholder="Username"
            className="input-dark"
          />

          <input
            {...register("phone", { required: "Phone is required" })}
            type="text"
            placeholder="Phone Number"
            className="input-dark"
          />
          <input
            {...register("email", { required: "Email is required" })}
            type="email"
            placeholder="Email Address"
            className="input-dark"
          />

          <input
            {...register("password", { required: "Password is required" })}
            type="password"
            placeholder="Password"
            className="input-dark"
          />

          <input
            {...register("confirmPassword", {
              required: "confirmPassword is required",
            })}
            type="password"
            placeholder="Confirm Password"
            className="input-dark"
          />

          <div className="grid grid-cols-2 gap-4">
            <select
              {...register("gender", { required: "gender is required" })}
              className="input-dark"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <input
              {...register("DOB", { required: "Date of birth is required" })}
              type="date"
              className="input-dark"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 transition py-3 rounded-xl text-white font-semibold"
          >
            Register
          </button>
        </form>
        {/* Social SignUp */}

        <p className="text-gray-400 text-sm text-center mt-6">
          Already have an account?{" "}
          <Link
            className="text-indigo-400 cursor-pointer hover:underline"
            to={"/login"}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
