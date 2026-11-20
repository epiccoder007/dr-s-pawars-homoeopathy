# Appointment enquiry workflow (V6)
The Contact and Online Consultation forms POST JSON to `/api/appointments`, implemented as a Vercel serverless function at `api/appointments.js`.

Configure `SMTP_USER`, `SMTP_PASS`, and `CLINIC_EMAIL` in Vercel Project Settings → Environment Variables. The App Password must never be committed to GitHub or placed in client-side code. See `VERCEL_DEPLOYMENT_GUIDE.md`.

If the email API fails, the browser opens WhatsApp to clinic number 9125262756 with the enquiry prefilled. The visitor must press Send in WhatsApp. A successful API response means Gmail accepted the message; verify actual delivery in the clinic inbox/spam folder.

Google Meet is a confirmation-stage workflow: the clinic reviews the request, creates a meeting in its Google account and shares the link with the patient. Automatic Calendar/Meet creation is not configured in this build.
