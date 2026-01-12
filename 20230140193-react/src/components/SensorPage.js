// src/components/SensorPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function SensorPage() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [latestData, setLatestData] = useState(null); // Untuk Kartu Indikator 
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Panggil API Backend sesuai Modul 14 [cite: 199]
      const res = await axios.get("http://localhost:3001/api/iot/history");
      const data = res.data.data;

      if (data.length > 0) {
        // Ambil data paling terakhir untuk Kartu Indikator 
        setLatestData(data[data.length - 1]);
      }

      const labels = data.map(item =>
        new Date(item.createdAt).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );

      setChartData({
        labels,
        datasets: [
          {
            label: "Suhu (°C)",
            data: data.map(i => i.suhu),
            borderColor: "#ef4444", // Merah [cite: 215, 284]
            backgroundColor: "rgba(239, 68, 68, 0.2)",
            tension: 0.3,
          },
          {
            label: "Kelembaban (%)",
            data: data.map(i => i.kelembaban),
            borderColor: "#3b82f6", // Biru [cite: 222, 284]
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            tension: 0.3,
          },
          // TUGAS: Menampilkan Data LDR (Cahaya) 
          {
            label: "Cahaya (LDR)",
            data: data.map(i => i.cahaya),
            borderColor: "#f59e0b", // Kuning/Oranye 
            backgroundColor: "rgba(245, 158, 11, 0.2)",
            tension: 0.3,
            yAxisID: 'y1', // Opsional: Gunakan Axis berbeda karena nilai LDR besar (0-4095) [cite: 282]
          },
        ],
      });

      setLoading(false);
    } catch (err) {
      console.error("Gagal ambil data sensor:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Load awal [cite: 236]
    const interval = setInterval(fetchData, 5000); // Refresh tiap 5 detik [cite: 239]
    return () => clearInterval(interval);
  }, []);

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        labels: { color: "#e5e7eb" },
      },
      title: {
        display: true,
        text: "Monitoring IoT Real-time",
        color: "#e5e7eb",
      },
    },
    scales: {
      x: {
        ticks: { color: "#9ca3af" },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        ticks: { color: "#9ca3af" },
        grid: { color: "rgba(255,255,255,0.1)" },
        title: { display: true, text: 'Suhu & Kelembaban', color: '#e5e7eb' }
      },
      // Axis tambahan untuk LDR karena nilainya sampai 4095 [cite: 282]
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        ticks: { color: "#f59e0b" },
        grid: { drawOnChartArea: false },
        title: { display: true, text: 'Intensitas Cahaya', color: '#f59e0b' }
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0b0b12] to-[#111122] text-white p-6">
      
      <div className="max-w-6xl mx-auto relative z-10">
        <h1 className="text-4xl font-extrabold text-center mb-2 bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
          Dashboard IoT
        </h1>
        <p className="text-center text-gray-400 mb-8">Data diperbarui otomatis setiap 5 detik [cite: 239]</p>

        {/* TUGAS: Kartu Indikator (Latest Data)  */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Kartu Suhu */}
          <div className="bg-red-500/20 border border-red-500/50 p-6 rounded-2xl backdrop-blur-md shadow-lg shadow-red-500/10">
            <p className="text-red-400 text-sm font-medium uppercase mb-1">Suhu Terkini</p>
            <h2 className="text-4xl font-bold">{latestData ? `${latestData.suhu}°C` : "--"}</h2>
          </div>

          {/* Kartu Kelembaban */}
          <div className="bg-blue-500/20 border border-blue-500/50 p-6 rounded-2xl backdrop-blur-md shadow-lg shadow-blue-500/10">
            <p className="text-blue-400 text-sm font-medium uppercase mb-1">Kelembaban</p>
            <h2 className="text-4xl font-bold">{latestData ? `${latestData.kelembaban}%` : "--"}</h2>
          </div>

          {/* Kartu Cahaya */}
          <div className="bg-yellow-500/20 border border-yellow-500/50 p-6 rounded-2xl backdrop-blur-md shadow-lg shadow-yellow-500/10">
            <p className="text-yellow-400 text-sm font-medium uppercase mb-1">Intensitas Cahaya</p>
            <h2 className="text-4xl font-bold">{latestData ? latestData.cahaya : "--"}</h2>
          </div>
        </div>

        {/* Grafik Utama */}
        <div className="bg-black/40 p-6 rounded-3xl border border-white/10 shadow-xl">
          {loading ? (
            <p className="text-center text-gray-400 py-20">Menghubungkan ke server...</p>
          ) : (
            <Line options={options} data={chartData} />
          )}
        </div>
      </div>
    </div>
  );
}

export default SensorPage;