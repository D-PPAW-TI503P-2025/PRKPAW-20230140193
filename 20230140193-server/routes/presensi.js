const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const presensiController = require("../controllers/presensiController");
const { addUserData } = require("../middleware/permissionMiddleware");

// Middleware untuk menambahkan data user dari token
router.use(addUserData);

/* =============================
   ROUTE PRESENSI
============================= */

// ✅ Check-In
router.post("/check-in", presensiController.CheckIn);

// ✅ Check-Out
router.post("/check-out", presensiController.CheckOut);

// ✅ Update Data Presensi
router.put(
  "/:id",
  [
    body("checkIn")
      .optional()
      .isISO8601()
      .withMessage("Format checkIn harus berupa tanggal yang valid (YYYY-MM-DD HH:mm:ss)"),
    body("checkOut")
      .optional()
      .isISO8601()
      .withMessage("Format checkOut harus berupa tanggal yang valid (YYYY-MM-DD HH:mm:ss)"),
  ],
  presensiController.updatePresensi // 🔥 controller update ditambahkan di sini
);

// ✅ Delete Data Presensi
router.delete("/:id", presensiController.deletePresensi);

module.exports = router;
