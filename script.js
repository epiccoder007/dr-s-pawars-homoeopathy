const toggle = document.querySelector('.menu-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) toggle.addEventListener('click', () => links.classList.toggle('open'));

function submitDemo(event) {
  event.preventDefault();
  const status = document.getElementById('form-status');
  if (status) status.textContent = 'Please use the appointment request form to contact the clinic.';
  return false;
}

(() => {
  const form = document.querySelector('[data-appointment-form]');
  if (!form) return;
  const status = form.querySelector('[data-form-status]');
  const endpoint = form.dataset.endpoint || window.DR_SPAWAR_API_ENDPOINT || '/api/appointments';
  const submit = form.querySelector('button[type="submit"]');
  const dateInput = form.querySelector('input[name="date"]');
  if (dateInput) dateInput.min = new Date().toLocaleDateString('en-CA');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form).entries());
    if (submit) { submit.disabled = true; submit.dataset.originalText = submit.textContent; submit.textContent = 'Sending…'; }
    if (status) status.textContent = 'Submitting your enquiry securely…';
    try {
      const response = await fetch(endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) throw new Error(result.message || 'Submission failed');
      if (status) status.textContent = result.message || 'Your enquiry has been sent. The clinic will contact you to confirm.';
      form.reset();
      if (dateInput) dateInput.min = new Date().toLocaleDateString('en-CA');
    } catch (error) {
      console.error('Appointment enquiry:', error);
      const lines = [
        'New appointment request', '', `Patient: ${data.name || ''}`, `Mobile: ${data.phone || ''}`,
        `Doctor: ${data.doctor || ''}`, `Clinic: ${data.clinic || ''}`, `Preferred date: ${data.date || ''}`,
        `Preferred time: ${data.time || ''}`, `Consultation: ${data.consultation || 'Clinic visit'}`,
        `Message: ${data.message || ''}`
      ];
      if (status) status.textContent = 'Automatic email submission is unavailable. WhatsApp is opening with your enquiry; please press Send there.';
      window.open(`https://wa.me/919125262756?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
    } finally {
      if (submit) { submit.disabled = false; submit.textContent = submit.dataset.originalText || 'Submit'; }
    }
  });
})();
