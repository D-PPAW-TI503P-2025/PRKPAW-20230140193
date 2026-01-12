import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import DashboardPage from "./components/DashboardPage";

import Navbar from "./components/Navbar"; 
import PresensiPage from "./components/PresensiPage"; 
import ReportPage from "./components/ReportPage"; 
import SensorPage from "./components/SensorPage"; 


const LayoutWithNavbar = ({ element: Element }) => (
  <>
    <Navbar />
    <div className="mt-0">
        <Element />
    </div>
  </>
);


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<LayoutWithNavbar element={DashboardPage} />} />
        <Route path="/presensi" element={<LayoutWithNavbar element={PresensiPage} />} />
        <Route path="/reports" element={<LayoutWithNavbar element={ReportPage} />} />
        <Route path="/monitoring" element={<LayoutWithNavbar element={SensorPage} />} />
        
      </Routes>
    </Router>
  );
}

export default App;