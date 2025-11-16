const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Collection: trueprime_contacts
const Contact = mongoose.models.Contact || mongoose.model("trueprime_contacts", contactSchema);

module.exports = Contact;

