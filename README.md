# True Prime Digital Backend API

Unified backend API for True Prime Digital - handling consultations and appointments with MongoDB and Brevo email integration.

## 🚀 Features

- **Consultation Form API** - Free consultation requests with email notifications
- **Appointment Booking API** - Full appointment system with email confirmations
- **MongoDB Integration** - Persistent data storage with Mongoose
- **Brevo Email Service** - Automated email notifications via Brevo API
- **Production Ready** - Configured for Render deployment

## 📋 Prerequisites

- Node.js 18.x or higher
- MongoDB Atlas account
- Brevo (Sendinblue) account with API key

## 🔧 Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your actual values:
   - `MONGO_URI` - MongoDB Atlas connection string
   - `BREVO_API_KEY` - Your Brevo API key
   - `SENDER_EMAIL` - Email address for sending emails
   - `RECEIVER_EMAIL` - Email address to receive notifications
   - `ADMIN_EMAIL` - Admin email for appointment notifications

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Run production server:**
   ```bash
   npm start
   ```

## 📡 API Endpoints

### Consultation Endpoints

**POST `/send-message`**
- Submit a free consultation request
- Body: `{ name, email, phone, message }`
- Saves to MongoDB and sends email notification

### Appointment Endpoints

**POST `/api/appointments`**
- Create a new appointment
- Body: `{ fullName, email, phone, serviceType, date, time }`
- Saves to MongoDB and sends confirmation emails

**GET `/api/appointments/:email`**
- Get all appointments for a user by email
- Returns appointments sorted by date (newest first)

### Health Check

**GET `/`**
- Returns server status

## 🗂️ Project Structure

```
trueprime-backend/
├── server.js                    # Main Express server
├── package.json                 # Dependencies and scripts
├── render.yaml                  # Render deployment configuration
├── .env.example                 # Environment variables template
├── controllers/
│   ├── appointmentController.js  # Appointment business logic
│   └── consultationController.js # Consultation business logic
├── models/
│   ├── Appointment.js           # Appointment MongoDB schema
│   ├── Consultation.js          # Consultation MongoDB schema
│   └── Contact.js               # Contact MongoDB schema
├── routes/
│   ├── appointmentRoutes.js     # Appointment API routes
│   └── consultationRoutes.js    # Consultation API routes
└── utils/
    ├── mail.js                  # Nodemailer transporter (if needed)
    └── notifications.js         # Notification utilities
```

## 🌐 Deployment

This backend is configured for Render deployment:

- **Root Directory:** `trueprime-backend`
- **Build Command:** `npm install`
- **Start Command:** `node server.js`

The `render.yaml` file is included for automatic configuration.

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **axios** - HTTP client for Brevo API
- **sib-api-v3-sdk** - Brevo SDK
- **@getbrevo/brevo** - Brevo package
- **nodemailer** - Email transporter (optional)

## 🔐 Environment Variables

See `.env.example` for all required environment variables.

## 📝 License

Copyright © True Prime Digital LLC

