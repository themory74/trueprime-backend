// ==========================================
// 🚀 TRUE PRIME DIGITAL BACKEND (UNIFIED)
// ==========================================
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const mongoose = require("mongoose");
const SibApiV3Sdk = require("sib-api-v3-sdk");
const Consultation = require("./models/Consultation.js");
const Contact = require("./models/Contact.js");

// -------------------------
// 🧩 Config
// -------------------------
const app = express();
const PORT = process.env.PORT || 5001;

// -------------------------
// 🔧 Middleware
// -------------------------
app.use(cors({ origin: "*" })); // Allow all origins for testing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------------
// ⚙️ MongoDB Connection
// -------------------------
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err.message));

// -------------------------
// 📬 Brevo (Sendinblue) Setup
// -------------------------
const brevoClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = brevoClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;
const brevoApi = new SibApiV3Sdk.TransactionalEmailsApi();

// ✅ Test Brevo connection on startup
(async () => {
  try {
    const account = await new SibApiV3Sdk.AccountApi().getAccount();
    console.log("✅ Brevo API Connected:", account.email);
  } catch (error) {
    console.error("❌ Brevo API Connection Failed:", error.message);
  }
})();

// -------------------------
// 📅 Appointment Routes
// -------------------------
app.use("/api/appointments", require("./routes/appointmentRoutes"));

// -------------------------
// 📨 Consultation Routes
// -------------------------
app.use("/api/consultation", require("./routes/consultationRoutes"));

// -------------------------
// 📧 Contact Form Route (Website)
// -------------------------
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "All fields are required." });
    }

    const newConsultation = new Consultation({
      fullName: name,
      emailAddress: email,
      phoneNumber: phone || "Not provided",
      message,
    });
    await newConsultation.save();
    console.log("💾 Saved consultation:", name, email);

    const sendSmtpEmail = {
      sender: { name: "True Prime Digital", email: process.env.SENDER_EMAIL },
      to: [{ email: process.env.RECEIVER_EMAIL }],
      subject: `📩 New Consultation from ${name}`,
      htmlContent: `
        <h2 style="color:#0A1E48;">New Consultation Request</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone || "Not provided"}</p>
        <p><b>Message:</b></p>
        <p>${message}</p>
        <hr />
        <p style="font-size:12px;color:#888;">Sent automatically from True Prime Digital backend</p>
      `,
    };

    await brevoApi.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Email successfully sent via Brevo API");

    res.status(200).json({ success: true, message: "✅ Message sent and saved successfully!" });
  } catch (err) {
    console.error("❌ Send/Save failed:", err.message);
    res.status(500).json({ success: false, error: "Message failed to send or save." });
  }
});

// -------------------------
// 📧 Contact Form Route (API)
// -------------------------
app.post("/api/contact/submit", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "All fields are required." });
    }

    const newContact = new Contact({
      name,
      email,
      message,
    });
    await newContact.save();
    console.log("💾 Saved contact:", name, email);

    const sendSmtpEmail = {
      sender: { name: "True Prime Digital", email: process.env.SENDER_EMAIL },
      to: [{ email: process.env.RECEIVER_EMAIL }],
      subject: `📧 New Contact Form Submission from ${name}`,
      htmlContent: `
        <h2 style="color:#0A1E48;">New Contact Form Submission</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b></p>
        <p>${message}</p>
        <hr />
        <p style="font-size:12px;color:#888;">Sent automatically from True Prime Digital backend</p>
      `,
    };

    await brevoApi.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Contact email sent via Brevo API");

    res.status(200).json({ success: true, message: "Contact form submitted successfully!" });
  } catch (err) {
    console.error("❌ Contact submit failed:", err.message);
    res.status(500).json({ success: false, error: "Failed to submit contact form." });
  }
});

// -------------------------
// 🌍 Root Route
// -------------------------
app.get("/", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "True Prime Digital Backend LIVE" 
  });
});

// -------------------------
// ❌ 404 Handler - Return JSON, not HTML
// -------------------------
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

// -------------------------
// 🚀 Server Start
// -------------------------
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
