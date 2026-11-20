# V6 deployment guide — Dr. S. Pawar's Homoeopathy

## Included in this package
- Existing 10-page responsive clinic website and supplied assets
- Vercel serverless endpoint: `api/appointments.js` (POST `/api/appointments`)
- Gmail SMTP notification via Nodemailer
- Appointment forms on Contact and Online Consultation pages
- WhatsApp fallback when the API/email service cannot complete a submission
- Existing direct Google Maps links for Gangakhed and Parbhani

## Deploy to Vercel
1. Upload/commit the **contents of this ZIP** to the root of the connected GitHub repository. `index.html`, `package.json`, `api/`, `assets/` must be at repository root (not nested inside another folder).
2. In Vercel, open the project and confirm the GitHub repository is connected. Trigger a deployment from the Production branch (usually `main`).
3. In Vercel → Project → Settings → Environment Variables, add these for **Production** (and Preview if you want preview deployments to send test emails):
   - `SMTP_USER` = `sanjivanihomoeoclinic9@gmail.com`
   - `SMTP_PASS` = the Gmail App Password (paste it directly into Vercel; remove spaces if Google displayed them grouped)
   - `CLINIC_EMAIL` = `sanjivanihomoeoclinic9@gmail.com`
4. Save variables and redeploy the latest deployment. Never put the App Password in GitHub, HTML, JavaScript, chat, or this ZIP.
5. Verify `https://YOUR-DEPLOYED-DOMAIN/api/appointments` with GET returns 405 (expected; endpoint accepts POST only). Submit a real test enquiry using the website form and confirm the email arrives. Check Vercel → Logs if it fails.

## Important items that still require account-owner action
- **Domain:** replace `YOUR-DOMAIN.com` in canonical URLs, `sitemap.xml`, and `robots.txt` with the actual domain after it is attached in Vercel. Do not guess the domain.
- **Google Meet:** this build collects online consultation requests. The clinic must review/confirm the appointment and manually create/share a Google Meet link. Automatic Calendar/Meet creation requires a Google Cloud project, OAuth consent and authorized account; none is supplied in this package.
- **Google Search Console / Business Profile:** verify ownership using the clinic's Google account and submit the sitemap after the real domain is live.
- **Anti-abuse:** the endpoint includes field validation and a honeypot. Before substantial public traffic, add a persistent rate limiter / CAPTCHA provider; serverless in-memory throttling is not reliable across instances.
- **Clinical content:** review qualifications, patient testimonials, outcome statements and all treatment/advertising claims with the responsible registered practitioner and applicable Indian rules before publication. Testimonials are individual accounts, not promises or evidence of guaranteed outcomes. Do not imply that homoeopathy replaces emergency or evidence-based specialist care.

## Email behavior
The API sends a plain-text appointment notification to `CLINIC_EMAIL`. It does not store enquiries in a database or send an automatic patient confirmation. A successful response means Gmail accepted the message for sending; verify actual receipt in the clinic inbox/spam during launch testing.

## Form fields
Name, Indian mobile number, doctor, clinic, preferred date/time, consultation type and optional message. Do not ask patients to submit highly sensitive medical records through this general enquiry form.
