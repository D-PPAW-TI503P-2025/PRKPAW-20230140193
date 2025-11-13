import React from "react";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white relative overflow-hidden">
      {/* Efek cahaya lembut di background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12)_0%,transparent_60%)]"></div>

      {/* Kartu utama dengan efek glassmorphism */}
      <div className="relative z-10 w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-10 text-center">
        <h1 className="text-4xl font-extrabold text-white tracking-wide mb-4">
          🎉 Selamat Datang!
        </h1>

        <p className="text-gray-300 mb-10 leading-relaxed">
          Anda berhasil login ke{" "}
          <span className="text-white font-semibold">Dashboard</span>.
          <br />
          <span className="block mt-2 text-gray-400 text-sm">
            Antarmuka sederhana, modern, dan elegan.
          </span>
        </p>

        <button
          onClick={handleLogout}
          className="py-2.5 px-8 bg-gradient-to-r from-gray-100 to-white text-black font-semibold rounded-full shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          Logout
        </button>

        <p className="mt-10 text-xs text-gray-500 tracking-wide">
          Dashboard Praktikum React x Node.js — 2025
        </p>
      </div>
    </div>
  );
}

export default DashboardPage;
