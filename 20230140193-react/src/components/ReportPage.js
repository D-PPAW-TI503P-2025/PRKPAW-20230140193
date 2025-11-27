import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ReportPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const fetchReports = async (query) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const baseUrl = "http://localhost:3001/api/reports/daily";
      const url = query ? `${baseUrl}?nama=${query}` : baseUrl;

      const response = await axios.get(url, config);
      setReports(response.data.data);
      setError(null);
    } catch (err) {
      setReports([]);
      setError(err.response ? err.response.data.message : "Gagal mengambil data");
    }
  };

  useEffect(() => {
    fetchReports("");
  }, [navigate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReports(searchTerm);
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-[#050505] via-[#0b0b12] to-[#111122] text-white relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 blur-[180px] rounded-full top-[-120px] left-[-140px]"></div>
        <div className="absolute w-[450px] h-[450px] bg-purple-600/10 blur-[160px] rounded-full bottom-[-140px] right-[-140px]"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 backdrop-blur-xl bg-black/20 border border-white/10 p-8 rounded-3xl shadow-[0_0_25px_rgba(0,0,0,0.6)] hover:shadow-[0_0_40px_rgba(0,255,255,0.15)] transition">

        <h1 className="text-4xl font-extrabold mb-8 text-center tracking-wide bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
          Laporan Presensi Harian
        </h1>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="mb-8 flex gap-3">
          <input
            type="text"
            placeholder="Cari berdasarkan nama..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow px-4 py-2.5 rounded-lg bg-[#0f0f17]/60 text-white placeholder-gray-400 border border-cyan-300/20 focus:ring-2 focus:ring-cyan-400/40 focus:outline-none transition"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-500/80 to-blue-500/80 text-black font-bold rounded-xl shadow-md hover:scale-105 transition-all">
            Cari
          </button>
        </form>

        {/* Error */}
        {error && (
          <p className="text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-center mb-6">
            {error}
          </p>
        )}

        {/* Table */}
        {!error && (
          <div className="overflow-hidden rounded-2xl border border-white/10 shadow-lg bg-black/30 backdrop-blur">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/5">
                <tr>
                  {["Nama", "Check-In", "Check-Out", "Latitude", "Longitude"].map((head) => (
                    <th
                      key={head}
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {reports.length > 0 ? (
                  reports.map((presensi) => (
                    <tr key={presensi.id} className="hover:bg-white/5 transition">
                      <td className="px-6 py-4 text-sm text-gray-200">
                        {presensi.user ? presensi.user.nama : "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {new Date(presensi.checkIn).toLocaleString("id-ID", {
                          timeZone: "Asia/Jakarta",
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {presensi.checkOut
                          ? new Date(presensi.checkOut).toLocaleString("id-ID", {
                              timeZone: "Asia/Jakarta",
                            })
                          : "Belum Check-Out"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {presensi.latitude || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {presensi.longitude || "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-5 text-center text-gray-400">
                      Tidak ada data yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportPage;
