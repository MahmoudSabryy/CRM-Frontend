import React from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, ArrowLeft } from "lucide-react";

export default function NotFoundComponent() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="max-w-xl text-center">

        <h1 className="text-[120px] leading-none font-extrabold text-indigo-500 drop-shadow-lg">
          404
        </h1>

        <h2 className="mt-4 text-2xl md:text-3xl font-bold text-white">
          Page Not Found
        </h2>

        <p className="mt-3 text-gray-400 text-sm md:text-base">
          The page you are trying to access doesn't exist or may have been
          removed. Please return to your dashboard.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">

          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-700 text-gray-300 hover:text-white hover:border-indigo-500 transition"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

        </div>

        <div className="mt-10 flex items-center justify-center gap-2 text-gray-500 text-xs">
          <span className="w-10 h-px bg-gray-700"></span>
          <span>CRM System</span>
          <span className="w-10 h-px bg-gray-700"></span>
        </div>

      </div>
    </div>
  );
}