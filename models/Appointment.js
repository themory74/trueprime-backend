const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    serviceType: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
  },
  { timestamps: true, collection: "appointments" }
);

module.exports =
  mongoose.models.Appointment ||
  mongoose.model("Appointment", AppointmentSchema);

