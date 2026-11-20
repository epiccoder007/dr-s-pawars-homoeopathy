const nodemailer = require("nodemailer");

const allowedDoctors = new Set(["Dr. Sanjay W. Pawar", "Dr. Sushant S. Pawar"]);
const allowedClinics = new Set(["Gangakhed", "Parbhani"]);
const text = (value, max = 1500) => typeof value === "string" ? value.trim().slice(0, max) : "";

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, message: "Method not allowed." });
  }

  try {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    // Honeypot: bots commonly fill hidden fields; silently accept without emailing.
    if (text(body.website, 200)) return res.status(200).json({ success: true });

    const data = {
      name: text(body.name, 100),
      phone: text(body.phone, 25),
      doctor: text(body.doctor, 80),
      clinic: text(body.clinic, 40),
      date: text(body.date, 10),
      time: text(body.time, 5),
      consultation: text(body.consultation, 40) || "Clinic visit",
      message: text(body.message, 1500)
    };
    const phoneDigits = data.phone.replace(/\D/g, "");
    if (!data.name || !/^[\p{L}\p{M} .'-]{2,100}$/u.test(data.name) || !/^[6-9]\d{9}$/.test(phoneDigits) ||
        !allowedDoctors.has(data.doctor) || !allowedClinics.has(data.clinic) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(data.date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(data.time)) {
      return res.status(400).json({ success: false, message: "Please check the required fields and enter a valid 10-digit Indian mobile number." });
    }
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.CLINIC_EMAIL) {
      console.error("Appointment mail service is missing SMTP_USER, SMTP_PASS or CLINIC_EMAIL.");
      return res.status(503).json({ success: false, message: "The appointment email service is temporarily unavailable. Please contact the clinic on WhatsApp." });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
    await transporter.sendMail({
      from: `Dr. S. Pawar's Homoeopathy <${process.env.SMTP_USER}>`,
      to: process.env.CLINIC_EMAIL,
      replyTo: process.env.SMTP_USER,
      subject: `Website appointment enquiry — ${data.name}`,
      text: [
        "NEW APPOINTMENT ENQUIRY", "", `Patient: ${data.name}`, `Mobile / WhatsApp: ${data.phone}`,
        `Preferred doctor: ${data.doctor}`, `Preferred clinic: ${data.clinic}`,
        `Preferred date: ${data.date}`, `Preferred time: ${data.time}`,
        `Consultation: ${data.consultation}`, "", `Message: ${data.message || "Not provided"}`,
        "", "Dr. S. Pawar's Homoeopathy website"
      ].join("\n")
    });
    return res.status(200).json({ success: true, message: "Your appointment enquiry has been sent to the clinic. The clinic will contact you to confirm availability." });
  } catch (error) {
    console.error("Appointment email delivery failed:", error && error.message);
    return res.status(500).json({ success: false, message: "We could not send your enquiry right now. Please contact the clinic through WhatsApp." });
  }
};
