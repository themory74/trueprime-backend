const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getAppointments,
} = require("../controllers/appointmentController");

// GET /api/appointments/list?email=... - Get appointments (optional email filter)
router.get("/list", getAppointments);

// POST /api/appointments/create - Create appointment
router.post("/create", createAppointment);

module.exports = router;
