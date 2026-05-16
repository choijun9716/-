document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('surveyForm');
    const steps = document.querySelectorAll('.form-step');
    const nextBtns = document.querySelectorAll('.next-step');
    const prevBtns = document.querySelectorAll('.prev-step');
    const progressFill = document.getElementById('progressFill');
    const dots = document.querySelectorAll('.step-dot');
    const successMessage = document.getElementById('successMessage');

    let currentStep = 1;

    // --- Slack Webhook URL (Put your Slack Webhook URL here) ---
    const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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'; 

    // --- Formspree Endpoint (Put your Formspree ID or Email here) ---
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mykoroln'; 

    // --- Navigation Logic ---
    function updateStep(step) {
        steps.forEach(s => s.classList.remove('active'));
        document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');
        
        // Update Progress Bar
        const percent = ((step - 1) / (steps.length - 1)) * 100;
        progressFill.style.width = `${percent}%`;

        // Update Dots
        dots.forEach((dot, idx) => {
            if (idx < step) dot.classList.add('active');
            else dot.classList.remove('active');
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                currentStep++;
                updateStep(currentStep);
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentStep--;
            updateStep(currentStep);
        });
    });

    function validateStep(step) {
        const currentStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
        const inputs = currentStepEl.querySelectorAll('input[required], select[required], textarea[required]');
        
        let isValid = true;
        inputs.forEach(input => {
            if (!input.value || (input.type === 'checkbox' && !input.checked) || (input.type === 'radio' && !document.querySelector(`input[name="${input.name}"]:checked`))) {
                input.style.borderColor = '#ef4444';
                isValid = false;
            } else {
                input.style.borderColor = '#e0e0e0';
            }
        });

        // Special check for treatments
        if (step === 1) {
            const checkedTreatments = currentStepEl.querySelectorAll('input[name="treatment"]:checked');
            if (checkedTreatments.length === 0) {
                alert('Please select at least one treatment option.');
                return false;
            }
        }

        if (!isValid) {
            alert('Please fill in all required fields.');
        }
        return isValid;
    }

    // --- Conditional Visibility ---
    const residencyRadios = document.querySelectorAll('input[name="residency"]');
    const stayDurationField = document.getElementById('stayDuration');

    residencyRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'visitor') {
                stayDurationField.classList.remove('hidden');
            } else {
                stayDurationField.classList.add('hidden');
            }
        });
    });

    // --- Form Submission ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Get all selected treatments
        data.treatments = Array.from(formData.getAll('treatment'));

        console.log('Submission Data:', data);

        // Submit Button State
        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending...';

        try {
            // 1. Send to Slack (If URL is provided)
            let slackPromise = Promise.resolve();
            if (SLACK_WEBHOOK_URL) {
                slackPromise = sendToSlack(data);
            }

            // 2. Send to Email via Formspree
            const emailPromise = sendToEmail(data);

            // Wait for both to complete
            await Promise.all([slackPromise, emailPromise]);

            // Show Success
            form.classList.add('hidden');
            document.querySelector('.progress-bar').classList.add('hidden');
            successMessage.classList.remove('hidden');

        } catch (error) {
            console.error('Submission failed:', error);
            alert('An error occurred during transmission. Please try again.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });

    async function sendToSlack(data) {
        const message = {
            text: "🔔 *New treatment reservation request received*",
            attachments: [{
                color: "#BA7626",
                fields: [
                    { title: "Name", value: data.fullName, short: true },
                    { title: "Phone", value: data.phone, short: true },
                    { title: "Email", value: data.email, short: true },
                    { title: "Birth Date", value: data.birthDate, short: true },
                    { title: "Treatments", value: data.treatments.join(', '), short: false },
                    { title: "Preferred Dates", value: `${data.preferredDate1}, ${data.preferredDate2 || '-'}, ${data.preferredDate3 || '-'}`, short: false },
                    { title: "Message", value: data.message || "N/A", short: false }
                ]
            }]
        };

        return fetch(SLACK_WEBHOOK_URL, {
            method: 'POST',
            body: JSON.stringify(message),
            headers: { 'Content-Type': 'application/json' }
        });
    }

    async function sendToEmail(data) {
        // Prepare data for Formspree
        const formBody = new FormData();
        for (const key in data) {
            if (Array.isArray(data[key])) {
                formBody.append(key, data[key].join(', '));
            } else {
                formBody.append(key, data[key]);
            }
        }

        return fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            body: formBody,
            headers: {
                'Accept': 'application/json'
            }
        });
    }
});
