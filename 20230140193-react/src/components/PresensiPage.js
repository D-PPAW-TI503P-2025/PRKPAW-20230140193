import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const API_URL = "http://localhost:3001/api/presensi";

// === FUNGSI AMBIL TOKEN ===
function getToken() {
  return localStorage.getItem("token");
}

// === DECODE TOKEN (ambil id, nama, role) ===
function decodeUser() {
  try {
    const token = getToken();
    if (!token) return null;
    return jwtDecode(token); // { id, nama, role }
  } catch (error) {
    console.error("Token invalid:", error);
    return null;
  }
}

function PresensiPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [coords, setCoords] = useState(null);

  const user = decodeUser(); // ← DATA USER DARI TOKEN

  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  // ==== FUNGSI AMBIL LOKASI ====
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

  // Ambil lokasi saat pertama kali load
  useEffect(() => {
    getLocation();
  }, []);

  // ============================
  //           CHECK-IN
  // ============================
  const handleCheckIn = async () => {
    setError("");
    setMessage("");

    if (!coords) {
      setError("Lokasi belum didapatkan. Izinkan akses lokasi.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/check-in`,
        {
          userId: user?.id,         // ← AMBIL ID DARI TOKEN
          latitude: coords.lat,
          longitude: coords.lng,
        },
        getHeaders()
      );

      setMessage(response.data.message);
    } catch (err) {
      setError(err.response ? err.response.data.message : "Check-in gagal");
    }
  };

  // ============================
  //           CHECK-OUT
  // ============================
  const handleCheckOut = async () => {
    setError("");
    setMessage("");

    if (!coords) {
      setError("Lokasi belum didapatkan. Izinkan akses lokasi.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/check-out`,
        {
          userId: user?.id,         // ← AMBIL ID DARI TOKEN
          latitude: coords.lat,
          longitude: coords.lng,
        },
        getHeaders()
      );

      setMessage(response.data.message);
    } catch (err) {
      setError(err.response ? err.response.data.message : "Check-out gagal");
    }
  };

  // ============================
  //           UI PAGE
  // ============================
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-lg">

        {/* ===== MAP ===== */}
        {coords && (
          <div className="my-4 border rounded-lg overflow-hidden shadow-md">
            <MapContainer
              center={[coords.lat, coords.lng]}
              zoom={15}
              style={{ height: "300px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />

              <Marker position={[coords.lat, coords.lng]}>
                <Popup>Lokasi Presensi Anda</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        {/* ===== CARD PRESENSI ===== */}
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Lakukan Presensi
          </h2>

          {message && <p className="text-green-600 mb-4">{message}</p>}
          {error && <p className="text-red-600 mb-4">{error}</p>}

          <div className="flex space-x-4">
            <button
              onClick={handleCheckIn}
              className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700"
            >
              Check-In
            </button>

            <button
              onClick={handleCheckOut}
              className="w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700"
            >
              Check-Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PresensiPage;
