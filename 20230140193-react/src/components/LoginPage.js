import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post("http://localhost:3001/api/auth/login", {
        email: email,
        password: password,
      });

      const token = response.data.token;
      localStorage.setItem("token", token);

      navigate("/dashboard");
    } catch (err) {
      setError(err.response ? err.response.data.message : "Login gagal");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#050505] via-[#0b0b12] to-[#111122] text-white relative overflow-hidden">

      {/* Soft dark glow background */}
      <div className="absolute inset-0">
        <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 blur-[180px] rounded-full top-[-100px] left-[-120px]"></div>
        <div className="absolute w-[450px] h-[450px] bg-purple-600/10 blur-[160px] rounded-full bottom-[-120px] right-[-130px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-8 backdrop-blur-xl bg-black/30 border border-white/10 rounded-3xl shadow-[0_0_20px_rgba(0,0,0,0.6)] hover:shadow-[0_0_35px_rgba(0,255,255,0.15)] transition-all duration-300">

        <h2 className="text-4xl font-extrabold text-center mb-6 tracking-wide bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-[#0f0f17]/60 text-white placeholder-gray-400 border border-cyan-300/20 focus:ring-2 focus:ring-cyan-400/40 focus:outline-none transition"
              placeholder="masukkan email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-[#0f0f17]/60 text-white placeholder-gray-400 border border-purple-300/20 focus:ring-2 focus:ring-purple-400/40 focus:outline-none transition"
              placeholder="masukkan password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-cyan-500/80 to-blue-500/80 text-black font-bold rounded-full shadow-md hover:shadow-cyan-400/30 hover:scale-105 transition-all duration-300"
          >
            Login
          </button>
        </form>

        {error && (
          <p className="text-red-400 text-sm mt-4 text-center">{error}</p>
        )}

        <p className="text-sm text-gray-400 mt-6 text-center">
          Belum punya akun?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-cyan-300 hover:underline cursor-pointer"
          >
            Daftar di sini
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;