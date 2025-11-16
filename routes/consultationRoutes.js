const express = require("express");
const router = express.Router();
const { 
  submitConsultation,
  getConsultations 
} = require("../controllers/consultationController.js");

// POST /api/consultation/book - Book consultation (matches frontend)
router.post("/book", submitConsultation);

// GET /api/consultation/list?email=... - Get consultations by email (matches frontend)
router.get("/list", getConsultations);

// POST /api/consultation/create - Create consultation (alternative)
router.post("/create", submitConsultation);

// POST /api/consultation - Alternative endpoint
router.post("/", submitConsultation);

module.exports = router;
