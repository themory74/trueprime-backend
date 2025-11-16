const express = require("express");
const router = express.Router();
const { submitConsultation } = require("../controllers/consultationController.js");

// POST /api/consultation/book - Book consultation (matches frontend)
router.post("/book", submitConsultation);

// POST /api/consultation/create - Create consultation (alternative)
router.post("/create", submitConsultation);

// POST /api/consultation - Alternative endpoint
router.post("/", submitConsultation);

module.exports = router;
