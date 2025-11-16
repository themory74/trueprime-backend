const Appointment = require("../models/Appointment");
const axios = require("axios");

async function sendAppointmentEmail(appointment) {
  try {
    // Send notification email to admin
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "True Prime Digital",
          email: process.env.SENDER_EMAIL,
        },
        to: [{ email: process.env.RECEIVER_EMAIL || process.env.ADMIN_EMAIL }],
        subject: "New Appointment Booked",
        htmlContent: `
          <html>
            <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
              <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px;">
                <h2 style="color: #06142F; margin-bottom: 20px;">New Appointment Booked</h2>
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                  <p><b>Name:</b> ${appointment.fullName}</p>
                  <p><b>Email:</b> ${appointment.email}</p>
                  <p><b>Phone:</b> ${appointment.phone}</p>
                  <p><b>Service:</b> ${appointment.serviceType}</p>
                  <p><b>Date:</b> ${appointment.date}</p>
                  <p><b>Time:</b> ${appointment.time}</p>
                </div>
                <p style="color: #666; font-size: 12px; margin-top: 20px;">This is an automated notification from True Prime Digital.</p>
              </div>
            </body>
          </html>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    // Send confirmation email to user
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "True Prime Digital",
          email: process.env.SENDER_EMAIL,
        },
        to: [{ email: appointment.email }],
        subject: "✅ Your Appointment Is Confirmed",
        htmlContent: `
          <html>
            <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
              <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px;">
                <h2 style="color: #06142F; margin-bottom: 20px;">✅ Your Appointment Is Confirmed</h2>
                <p>Dear ${appointment.fullName},</p>
                <p>Thank you for booking with True Prime Digital. Your appointment has been confirmed.</p>
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                  <p><b>Service:</b> ${appointment.serviceType}</p>
                  <p><b>Date:</b> ${appointment.date}</p>
                  <p><b>Time:</b> ${appointment.time}</p>
                </div>
                <p>We look forward to meeting with you!</p>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
                <p style="color: #666; font-size: 12px;">True Prime Digital LLC</p>
              </div>
            </body>
          </html>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`📧 Appointment emails sent: admin notification + user confirmation to ${appointment.email}`);
  } catch (err) {
    console.log("❌ Appointment Email Error:", err.response?.data || err.message);
  }
}

exports.createAppointment = async (req, res) => {
  try {
    // Map frontend fields (name, service) to backend fields (fullName, serviceType)
    const appointmentData = {
      fullName: req.body.name || req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      serviceType: req.body.service || req.body.serviceType,
      date: req.body.date,
      time: req.body.time,
    };

    // Validate required fields
    if (!appointmentData.fullName || !appointmentData.email || !appointmentData.serviceType || !appointmentData.date || !appointmentData.time) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: name/fullName, email, service/serviceType, date, time"
      });
    }

    const appointment = new Appointment(appointmentData);
    await appointment.save();

    await sendAppointmentEmail(appointment);

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully!",
      appointment,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        error: "Email query parameter is required" 
      });
    }

    const appointments = await Appointment.find({ email }).sort({
      createdAt: -1,
    });

    return res.status(200).json({ success: true, appointments });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAppointmentsByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const appointments = await Appointment.find({ email }).sort({
      createdAt: -1,
    });

    return res.status(200).json({ success: true, appointments });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
