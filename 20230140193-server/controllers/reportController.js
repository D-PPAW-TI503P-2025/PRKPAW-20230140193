// 1. Import Model dan Library
const { Presensi } = require("../models");
const { format } = require("date-fns-tz");
const { Op } = require("sequelize");
const timeZone = "Asia/Jakarta";

/* ===================================================
   getDailyReport
   Fungsi: Ambil laporan presensi harian dengan filter
   - nama (optional)
   - rentang tanggal (optional)
=================================================== */
exports.getDailyReport = async (req, res) => {
  try {
    const { nama, tanggalMulai, tanggalSelesai } = req.query;

    // Default opsi pencarian
    const options = { where: {} };

    // 🔍 Filter berdasarkan nama
    if (nama) {
      options.where.nama = { [Op.like]: `%${nama}%` };
    }

    // 📅 Filter berdasarkan rentang tanggal
    if (tanggalMulai && tanggalSelesai) {
      const startDate = new Date(tanggalMulai);
      const endDate = new Date(tanggalSelesai);

      // Validasi format tanggal
      if (isNaN(startDate) || isNaN(endDate)) {
        return res.status(400).json({
          message: "Format tanggal tidak valid. Gunakan format YYYY-MM-DD.",
        });
      }

      // Pastikan tanggal akhir mencakup seluruh hari (hingga 23:59:59)
      endDate.setHours(23, 59, 59, 999);

      options.where.createdAt = { [Op.between]: [startDate, endDate] };
    }

    // 🔧 Ambil data presensi dari database
    const records = await Presensi.findAll(options);

    // 📤 Kirim response
    res.status(200).json({
      message: "Laporan harian berhasil diambil.",
      reportDate: format(new Date(), "yyyy-MM-dd HH:mm:ss", { timeZone }),
      jumlahData: records.length,
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil laporan.",
      error: error.message,
    });
  }
};