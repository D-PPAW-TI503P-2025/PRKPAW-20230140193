import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("mahasiswa");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await axios.post("http://localhost:3001/api/authRoutes/register", {
        nama,
        email,
        password,
        role,
      });

      alert("Registrasi berhasil! Silakan login.");
      navigate("/login");
    } catch (err) {
      setError(err.response ? err.response.data.message : "Registrasi gagal");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#050505] via-[#0b0b12] to-[#111122] text-white relative overflow-hidden">


      <div className="absolute inset-0">
        <div className="absolute w-[550px] h-[550px] bg-cyan-500/10 blur-[170px] rounded-full top-[-100px] left-[-150px]"></div>
        <div className="absolute w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full bottom-[-120px] right-[-100px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-10 backdrop-blur-xl bg-black/30 border border-white/10 rounded-3xl shadow-[0_0_25px_rgba(0,0,0,0.6)]">

        <h2 className="text-4xl font-extrabold text-center tracking-wide bg-gradient-to-r from-cyan-300 to-purple-300 text-transparent bg-clip-text mb-8">
          Register Akun
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

    
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400
                         border border-white/10 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
              placeholder="Masukkan nama lengkap"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400
                         border border-white/10 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
              placeholder="Masukkan email"
            />
          </div>

     
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400
                         border border-white/10 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
              placeholder="Masukkan password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/10
                         focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            >
              <option value="mahasiswa" className="text-black">Mahasiswa</option>
              <option value="admin" className="text-black">Admin</option>
            </select>
          </div>

     
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-cyan-400/90 to-blue-500/90 text-black font-bold rounded-full shadow-md hover:shadow-cyan-400/40 hover:scale-105 transition-all duration-300"
          >
            Register
          </button>
        </form>

        {error && (
          <p className="text-red-400 text-sm mt-4 text-center">{error}</p>
        )}

    
        <p className="text-sm text-gray-400 mt-6 text-center">
          Sudah punya akun?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-cyan-300 hover:underline cursor-pointer"
          >
            Login di sini
          </span>
        </p>

      </div>
    </div>
  );
}

export default RegisterPage;
