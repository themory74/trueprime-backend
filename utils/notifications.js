// ==========================================
// 📬 TRUE PRIME DIGITAL - Notification Utilities
// ==========================================
// This file contains notification hooks and utilities
// for sending notifications after appointment creation.
//
// Currently structured for future implementation:
// - Email notifications via Brevo/Sendinblue
// - Push notifications (can be added later)
// - SMS notifications (can be added later)

const SibApiV3Sdk = require("sib-api-v3-sdk");

// ------------------------------------------
// 📧 Send Email Notification
// ------------------------------------------
exports.sendNotification = async (email, message) => {
  try {
    // Initialize Brevo client
    const brevoClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = brevoClient.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    if (!apiKey.apiKey) {
      console.warn("⚠️ BREVO_API_KEY not set. Skipping notification.");
      return { success: false, error: "Notification service not configured" };
    }

    const brevoApi = new SibApiV3Sdk.TransactionalEmailsApi();

    const sendSmtpEmail = {
      sender: {
        name: "True Prime Digital",
        email: process.env.SENDER_EMAIL || "noreply@trueprimedigital.com",
      },
      to: [{ email }],
      subject: "✅ Appointment Confirmation - True Prime Digital",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0077FF;">Appointment Confirmed!</h2>
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            ${message}
          </p>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            Thank you for choosing True Prime Digital!
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="color: #999; font-size: 12px;">
            This is an automated confirmation email. Please do not reply.
          </p>
        </div>
      `,
    };

    await brevoApi.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Notification email sent to:", email);

    return { success: true };
  } catch (error) {
    console.error("❌ Notification error:", error.message);
    return { success: false, error: error.message };
  }
};

// ------------------------------------------
// 🔔 Send Push Notification (Future Implementation)
// ------------------------------------------
exports.sendPushNotification = async (deviceToken, title, body) => {
  // TODO: Implement push notification service
  // This can use Firebase Cloud Messaging (FCM) or Apple Push Notification Service (APNs)
  console.log("📱 Push notification (not implemented):", { deviceToken, title, body });
  return { success: false, error: "Push notifications not yet implemented" };
};

// ------------------------------------------
// 📱 Send SMS Notification (Future Implementation)
// ------------------------------------------
exports.sendSMSNotification = async (phoneNumber, message) => {
  // TODO: Implement SMS notification service
  // This can use Twilio, AWS SNS, or similar service
  console.log("💬 SMS notification (not implemented):", { phoneNumber, message });
  return { success: false, error: "SMS notifications not yet implemented" };
};

