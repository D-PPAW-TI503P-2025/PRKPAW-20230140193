import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:3001/api/reports/daily";

function ReportPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // Cek apakah admin
  const checkAdminAccess = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const decoded = jwtDecode(token);

      if (decoded.role !== "admin") return navigate("/dashboard");
    } catch (err) {
      navigate("/login");
    }
  };

  // Fetch laporan
  const fetchReports = async (query = "") => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      setError(null);

      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          nama: query, // FIXED!
        },
      });

      setReports(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat data laporan.");
    }
  };

  useEffect(() => {
    checkAdminAccess();
    fetchReports("");
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReports(searchTerm);
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Laporan Presensi Harian
      </h1>

      <form onSubmit={handleSearchSubmit} className="mb-6 flex space-x-2">
        <input
          type="text"
          placeholder="Cari berdasarkan nama..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow px-3 py-2 border rounded-md"
        />
        <button type="submit" className="py-2 px-4 bg-blue-600 text-white rounded-md">
          Cari
        </button>
      </form>

      {error && (
        <p className="text-red-600 bg-red-100 p-4 rounded-md mb-4">
          {error}
        </p>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3">Nama</th>
              <th className="px-6 py-3">Check-In</th>
              <th className="px-6 py-3">Check-Out</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((row) => (
                <tr key={row.id}>
                  <td className="px-6 py-4">
                    {row.user?.nama || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {row.checkIn
                      ? new Date(row.checkIn).toLocaleString("id-ID")
                      : "-"}
                  </td>
                  <td className="px-6 py-4">
                    {row.checkOut
                      ? new Date(row.checkOut).toLocaleString("id-ID")
                      : "Belum Check-Out"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                  Tidak ada data yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReportPage;
