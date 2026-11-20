# V6 changes
- Added Vercel serverless appointment API at `/api/appointments`.
- Added server-side validation, allowed doctor/clinic values, payload limits through field truncation, and a honeypot field.
- Connected Contact and Online Consultation forms to the API.
- Updated browser workflow with loading state, response handling and WhatsApp fallback.
- Added root-level Nodemailer dependency for Vercel deployment.
- Removed duplicate script loading and duplicate floating WhatsApp link on affected pages.
- Added deployment guide with secret handling, domain, Google Meet and launch verification steps.
