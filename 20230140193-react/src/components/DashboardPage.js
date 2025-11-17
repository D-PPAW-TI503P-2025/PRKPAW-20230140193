import React from "react";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#050505] via-[#0b0b12] to-[#111122] text-white relative overflow-hidden">

 
      <div className="absolute inset-0">
        <div className="absolute w-[550px] h-[550px] bg-cyan-500/10 blur-[170px] rounded-full top-[-100px] left-[-150px]"></div>
        <div className="absolute w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full bottom-[-120px] right-[-100px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg backdrop-blur-xl bg-black/30 border border-white/10 rounded-3xl shadow-[0_0_25px_rgba(0,0,0,0.6)] hover:shadow-[0_0_35px_rgba(0,255,255,0.15)] transition-all duration-300 p-10">

     
        <h1 className="text-4xl font-extrabold text-center tracking-wide bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent mb-6">
          Dashboard
        </h1>


        <p className="text-gray-300 text-center leading-relaxed mb-10">
          Selamat datang di{" "}
          <span className="font-semibold text-white">Dashboard PrakPaw</span>.
          <br />
          <span className="block mt-2 text-gray-400 text-sm">
            Login berhasil. Akses penuh — Mode Premium Aktif.
          </span>
        </p>


        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-inner mb-8 w-4/5 mx-auto text-center hover:bg-white/10 transition">
          <h2 className="text-lg font-semibold mb-2">Status Akun</h2>

          <p className="text-gray-300 text-sm">✔ Autentikasi Sukses</p>
          <p className="text-gray-300 text-sm">✔ Token Valid & Aktif</p>

          <p className="text-gray-400 text-xs mt-2">
            Sistem aman • Koneksi terenkripsi
          </p>
        </div>

   
        <div className="flex justify-center">
          <button
            onClick={handleLogout}
            className="py-2.5 px-10 bg-gradient-to-r from-cyan-400/90 to-blue-500/90 
                       text-black font-bold rounded-full shadow-md 
                       hover:shadow-cyan-400/40 hover:scale-105 transition-all duration-300"
          >
            Logout
          </button>
        </div>

 
        <p className="mt-10 text-center text-xs text-gray-500 tracking-wide">
          Dashboard Praktikum React x Node.js — 2025
        </p>

      </div>
    </div>
  );
}

export default DashboardPage;
