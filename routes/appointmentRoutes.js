const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getAppointmentsByEmail,
} = require("../controllers/appointmentController");

// POST /api/appointments/create - Create appointment (matches frontend)
router.post("/create", createAppointment);

// POST /api/appointments - Alternative endpoint
router.post("/", createAppointment);

// GET /api/appointments/list?email=... - Get appointments by email (matches frontend)
router.get("/list", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, error: "Email query parameter is required" });
    }
    const getAppointmentsByEmail = require("../controllers/appointmentController").getAppointmentsByEmail;
    req.params = { email };
    return getAppointmentsByEmail(req, res);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/appointments/:email - Get appointments by email (route param)
router.get("/:email", getAppointmentsByEmail);

module.exports = router;
