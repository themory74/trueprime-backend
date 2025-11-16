// ==========================================
// 🧠 TRUE PRIME DIGITAL - Consultation Model (Final Clean Build)
// ==========================================

const mongoose = require("mongoose");

// ------------------------------------------
// 📘 Define Schema for Consultation / Contact Submissions
// ------------------------------------------
const consultationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    emailAddress: {
      type: String,
      required: [true, "Email address is required"],
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message content is required"],
      trim: true,
    },
  },
  {
    timestamps: true, // ✅ Automatically adds createdAt & updatedAt
    collection: "consultations", // ✅ Explicit MongoDB collection name
  }
);

// ------------------------------------------
// 🚀 Create & Export the Model
// ------------------------------------------
const Consultation =
  mongoose.models.Consultation || mongoose.model("Consultation", consultationSchema);

module.exports = Consultation;

