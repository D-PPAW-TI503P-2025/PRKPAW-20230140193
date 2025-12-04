import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Webcam from "react-webcam";

const API_URL = "http://localhost:3001/api/presensi";

// --- TOKEN UTILS ---
function getToken() {
  return localStorage.getItem("token");
}

function decodeUser() {
  try {
    const token = getToken();
    if (!token) return null;
    return jwtDecode(token);
  } catch (error) {
    console.error("Token invalid:", error);
    return null;
  }
}

function PresensiPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [coords, setCoords] = useState(null);

  const [image, setImage] = useState(null); // FOTO SELFIE
  const webcamRef = useRef(null);

  const user = decodeUser();

  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "multipart/form-data",
    },
  });

  // --- GET LOCATION ---
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          setError("Gagal mendapatkan lokasi: " + err.message);
        }
      );
    } else {
      setError("Browser tidak mendukung Geolocation.");
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  // --- CAPTURE FOTO DARI WEBCAM ---
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  // ---------------------------------------------------------
  // 🟦 HANDLE CHECK-IN (KIRIM LOKASI + FOTO)
  // ---------------------------------------------------------
  const handleCheckIn = async () => {
    setMessage("");
    setError("");

    if (!coords || !image) {
      setError("Lokasi dan Foto wajib ada!");
      return;
    }

    try {
      const blob = await (await fetch(image)).blob();

      const formData = new FormData();
      formData.append("latitude", coords.lat);
      formData.append("longitude", coords.lng);
      formData.append("image", blob, "selfie.jpg");

      const response = await axios.post(
        `${API_URL}/check-in`,
        formData,
        getHeaders()
      );

      setMessage(response.data.message);
    } catch (err) {
      setError(err.response ? err.response.data.message : "Check-in gagal.");
    }
  };

  // ---------------------------------------------------------
  // 🟥 HANDLE CHECK-OUT (TANPA FOTO)
  // ---------------------------------------------------------
  const handleCheckOut = async () => {
    setMessage("");
    setError("");

    if (!coords) {
      setError("Lokasi wajib ada!");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/check-out`,
        {
          latitude: coords.lat,
          longitude: coords.lng,
        },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      setMessage(response.data.message);
    } catch (err) {
      setError(err.response ? err.response.data.message : "Check-out gagal");
    }
  };

  // =====================================================================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#050505] via-[#0b0b12] to-[#111122] text-white relative overflow-hidden p-6">

      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 blur-[180px] rounded-full top-[-100px] left-[-120px]"></div>
        <div className="absolute w-[450px] h-[450px] bg-purple-600/10 blur-[160px] rounded-full bottom-[-120px] right-[-130px]"></div>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-4xl p-8 backdrop-blur-xl bg-black/30 border border-white/10 rounded-3xl shadow-xl">

        {/* Header */}
        <h2 className="text-4xl font-extrabold text-center mb-6 tracking-wide bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
          Presensi
        </h2>

        <p className="text-center text-gray-300 mb-6">
          Selamat Datang,{" "}
          <span className="text-cyan-300 font-semibold">{user?.nama}</span>
        </p>

        {/* ============================================================
              👉  LAYOUT BARU 2 KOLOM (MAP KIRI – KAMERA KANAN)
            ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* MAP */}
          {coords && (
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-black/30">
              <MapContainer
                center={[coords.lat, coords.lng]}
                zoom={15}
                style={{ height: "280px", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <Marker position={[coords.lat, coords.lng]}>
                  <Popup>Lokasi Presensi Anda</Popup>
                </Marker>
              </MapContainer>

              <div className="p-3 bg-black/40 text-gray-300 text-sm border-t border-white/10">
                <p>Lat: {coords.lat.toFixed(6)}</p>
                <p>Lng: {coords.lng.toFixed(6)}</p>
              </div>
            </div>
          )}

          {/* KAMERA */}
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-black/30">
            {image ? (
              <img
                src={image}
                alt="Selfie"
                className="w-full h-[280px] object-cover"
              />
            ) : (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-[280px] object-cover"
              />
            )}

            <div className="p-3 bg-black/40 border-t border-white/10">
              {!image ? (
                <button
                  onClick={capture}
                  className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                >
                  Ambil Foto 📸
                </button>
              ) : (
                <button
                  onClick={() => setImage(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded w-full"
                >
                  Foto Ulang 🔄
                </button>
              )}
            </div>
          </div>

        </div>

        {/* ALERT */}
        {message && (
          <p className="text-green-400 bg-green-500/10 border border-green-500/20 p-2 rounded-lg text-center mt-6">
            {message}
          </p>
        )}

        {error && (
          <p className="text-red-400 bg-red-500/10 border border-red-500/20 p-2 rounded-lg text-center mt-6">
            {error}
          </p>
        )}

        {/* BUTTON CHECK-IN & CHECK-OUT */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleCheckIn}
            className="w-full py-3 bg-gradient-to-r from-cyan-500/80 to-blue-500/80 text-black font-bold rounded-full shadow-md hover:scale-105 transition-all"
          >
            Check-In
          </button>

          <button
            onClick={handleCheckOut}
            className="w-full py-3 bg-gradient-to-r from-red-500/80 to-pink-500/80 text-black font-bold rounded-full shadow-md hover:scale-105 transition-all"
          >
            Check-Out
          </button>
        </div>

      </div>
    </div>
  );
}

export default PresensiPage;
