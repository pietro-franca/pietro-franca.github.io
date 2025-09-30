import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fetch from "node-fetch";
import rateLimit from "express-rate-limit";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: "Too many requests, try again later." },
});
app.use("/send-email", limiter);

// 🔹 Rota de envio de email
app.post("/send-email", async (req, res) => {
  try {
    const { name, email, message, token } = req.body;

    if (!name || !email || !message || !token) {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }

    const params = new URLSearchParams();
    params.append("secret", process.env.RECAPTCHA_SECRET);
    params.append("response", token);

    const captchaRes = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      }
    );
    const captchaData = await captchaRes.json();

    if (!captchaData.success) {
      return res
        .status(403)
        .json({ success: false, error: "Failed reCAPTCHA verification" });
    }

    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_USER_ID,
        accessToken: process.env.EMAILJS_ACCESS_TOKEN,
        template_params: {
          from_name: name,
          from_email: email,
          message: message,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`EmailJS API error: ${response.statusText}`);
    }

    res.json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ success: false, error: "Failed to send email" });
  }
});

app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});
