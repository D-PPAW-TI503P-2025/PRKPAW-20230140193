const { Presensi } = require("../models");
const { body, validationResult } = require("express-validator");
const { format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";

// --- 1. Check In ---
exports.CheckIn = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    const waktuSekarang = new Date();
    const { latitude, longitude } = req.body;

    const existingRecord = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (existingRecord) {
      return res.status(400).json({ message: "Anda sudah check-in hari ini." });
    }

    const newRecord = await Presensi.create({
      userId: userId,
      checkIn: waktuSekarang,
      latitude: latitude || null,
      longitude: longitude || null,
    });

    res.status(201).json({
      message: `Halo ${userName}, check-in berhasil!`,
      data: newRecord,
    });
  } catch (error) {
    res.status(500).json({ message: "Error server", error: error.message });
  }
};

// --- 2. Check Out ---
exports.CheckOut = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const waktuSekarang = new Date();

    const recordToUpdate = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (!recordToUpdate) {
      return res.status(404).json({ message: "Tidak ada sesi check-in aktif." });
    }

    recordToUpdate.checkOut = waktuSekarang;
    await recordToUpdate.save();

    res.json({ message: "Check-out berhasil!", data: recordToUpdate });
  } catch (error) {
    res.status(500).json({ message: "Error server", error: error.message });
  }
};

// --- 3. Update Presensi (INI YANG TADI HILANG/ERROR) ---
exports.updatePresensi = async (req, res) => {
  try {
    const presensiId = req.params.id;
    const { checkIn, checkOut } = req.body;

    const record = await Presensi.findByPk(presensiId);
    if (!record) {
        return res.status(404).json({ message: "Data tidak ditemukan" });
    }


    if (checkIn) record.checkIn = checkIn;
    if (checkOut) record.checkOut = checkOut;
    
    await record.save();
    res.json({ message: "Update berhasil", data: record });
  } catch (error) {
    res.status(500).json({ message: "Error server", error: error.message });
  }
};

// --- 4. Delete Presensi ---
exports.deletePresensi = async (req, res) => {
  try {
    const record = await Presensi.findByPk(req.params.id);
    if (!record) return res.status(404).json({ message: "Data tidak ditemukan" });
    
    await record.destroy();
    res.json({ message: "Data berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Error server", error: error.message });
  }
};