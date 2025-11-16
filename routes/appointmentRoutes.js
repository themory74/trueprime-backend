const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  getAppointmentsByEmail,
} = require("../controllers/appointmentController");

// POST /api/appointments/create - Create appointment (matches frontend)
router.post("/create", createAppointment);

// POST /api/appointments - Alternative endpoint
router.post("/", createAppointment);

// GET /api/appointments/list?email=... - Get appointments by email (matches frontend)
router.get("/list", getAppointments);

// GET /api/appointments/:email - Get appointments by email (route param)
router.get("/:email", getAppointmentsByEmail);

module.exports = router;
