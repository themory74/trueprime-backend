const axios = require("axios");
const Consultation = require("../models/Consultation");

exports.submitConsultation = async (req, res) => {
  try {
    const { fullName, emailAddress, phoneNumber, message } = req.body;

    if (!fullName || !emailAddress) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields (fullName, emailAddress)"
      });
    }

    const newConsultation = new Consultation({
      fullName,
      emailAddress,
      phoneNumber: phoneNumber || "",
      message: message || ""
    });

    await newConsultation.save();
    console.log("✅ Consultation saved to DB:", newConsultation._id);

    // Send confirmation email to user
    try {
      await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: { name: "True Prime Digital", email: process.env.SENDER_EMAIL },
          to: [{ email: emailAddress }],
          subject: "✅ Your Free Consultation Request Received",
          htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #06142F;">Thank You for Your Consultation Request!</h2>
              <p>Dear ${fullName},</p>
              <p>We have received your free consultation request and will get back to you soon.</p>
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><b>Your Message:</b></p>
                <p>${message || "No message provided"}</p>
              </div>
              <p>Our team will review your request and contact you shortly.</p>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
              <p style="color: #666; font-size: 12px;">True Prime Digital LLC</p>
            </div>
          `
        },
        {
          headers: {
            "api-key": process.env.BREVO_API_KEY,
            "Content-Type": "application/json"
          }
        }
      );
      console.log(`📧 Confirmation email sent to user: ${emailAddress}`);
    } catch (emailError) {
      console.error("❌ Failed to send user confirmation email:", emailError.message);
    }

    // Send notification email to admin
    try {
      await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: { name: "True Prime Digital", email: process.env.SENDER_EMAIL },
          to: [{ email: process.env.RECEIVER_EMAIL || process.env.RECIEVER_EMAIL }],
          subject: "📩 New Free Consultation Request",
          htmlContent: `
            <h2>New Free Consultation Request</h2>
            <p><b>Name:</b> ${fullName}</p>
            <p><b>Email:</b> ${emailAddress}</p>
            <p><b>Phone:</b> ${phoneNumber || "Not provided"}</p>
            <p><b>Message:</b><br/>${message || "No message provided"}</p>
            <hr />
            <p style="font-size:12px;opacity:0.6;">
              Submitted: ${new Date().toLocaleString()}
            </p>
          `
        },
        {
          headers: {
            "api-key": process.env.BREVO_API_KEY,
            "Content-Type": "application/json"
          }
        }
      );
      console.log("📧 Admin notification email sent!");
    } catch (emailError) {
      console.error("❌ Failed to send admin notification email:", emailError.message);
    }

    return res.status(200).json({
      success: true,
      message: "Consultation submitted successfully!"
    });

  } catch (error) {
    console.error("❌ Consultation submit error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error, please try again later."
    });
  }
};

exports.getConsultations = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        error: "Email query parameter is required" 
      });
    }

    const consultations = await Consultation.find({ emailAddress: email }).sort({
      createdAt: -1,
    });

    return res.status(200).json({ success: true, consultations });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
