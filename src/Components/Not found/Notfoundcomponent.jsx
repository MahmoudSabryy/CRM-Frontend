import React, { Component } from "react";

export default class Notfoundcomponent extends Component {
  render() {
    return (
      <>
        <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center px-6 overflow-hidden">
          <div className="max-w-xl text-center animate-fadeInUp">
            <h1 className="text-[120px] leading-none font-extrabold text-indigo-600 drop-shadow-lg animate-float">
              404
            </h1>

            <h2 className="mt-4 text-2xl md:text-3xl font-bold text-white animate-fadeIn delay-200">
              Page Not Found
            </h2>

            <p className="mt-3 text-gray-400 text-sm md:text-base animate-fadeIn delay-300">
              Sorry, the page you’re looking for doesn’t exist or has been
              moved.
            </p>

            <div className="mt-8 flex items-center justify-center gap-4 animate-fadeIn delay-500">
              <button className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 hover:scale-105 transition-transform duration-300">
                Back to Home
              </button>

              <button className="px-6 py-3 rounded-xl border border-white/20 text-gray-300 hover:text-white hover:border-indigo-500 hover:scale-105 transition-transform duration-300">
                Browse Products
              </button>
            </div>

            <div className="mt-10 flex items-center justify-center gap-2 text-gray-500 text-xs animate-fadeIn delay-700">
              <span className="w-10 h-px bg-white/10"></span>
              <span>E-Shop</span>
              <span className="w-10 h-px bg-white/10"></span>
            </div>
          </div>
        </div>
      </>
    );
  }
}
