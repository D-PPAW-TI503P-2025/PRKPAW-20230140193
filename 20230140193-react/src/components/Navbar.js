import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function decodeToken() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const decoded = jwtDecode(token);
    return decoded; // { id, nama, role }
  } catch (error) {
    console.error("Token tidak valid:", error);
    return null;
  }
}

function logout(navigate) {
  localStorage.removeItem("token");
  navigate("/login");
}

function Navbar() {
  const navigate = useNavigate();
  const userPayload = decodeToken();

  const isAdmin = userPayload?.role === "admin";
  const userName = userPayload?.nama || "Pengguna";

  const handleLogout = () => {
    logout(navigate);
  };

  if (!userPayload) return null;

  return (
    <nav className="bg-gray-800 p-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        <Link
          to="/dashboard"
          className="text-white text-xl font-bold tracking-wider hover:text-cyan-400 transition-colors"
        >
          PresensiApp
        </Link>

        <div className="flex items-center space-x-6">
          <Link
            to="/presensi"
            className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            Presensi
          </Link>

          {isAdmin && (
            <Link
              to="/reports"
              className="text-yellow-300 hover:bg-gray-700 hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium"
            >
              Laporan Admin
            </Link>
          )}

          <span className="text-cyan-300 text-sm font-semibold hidden md:block">
            Halo, {userName}
          </span>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-red-700 transition duration-150"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
