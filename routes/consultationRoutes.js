const express = require("express");
const { submitConsultation } = require("../controllers/consultationController.js");

const router = express.Router();

// POST /api/consultation/create - Create consultation
router.post("/create", submitConsultation);

// POST /api/consultation - Alternative endpoint
router.post("/", submitConsultation);

module.exports = router;
