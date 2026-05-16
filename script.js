document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('surveyForm');
    const steps = document.querySelectorAll('.form-step');
    const nextBtns = document.querySelectorAll('.next-step');
    const prevBtns = document.querySelectorAll('.prev-step');
    const progressFill = document.getElementById('progressFill');
    const dots = document.querySelectorAll('.step-dot');
    const successMessage = document.getElementById('successMessage');

    let currentStep = 1;

    // --- Formspree Endpoint ---
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mykoroln'; 

    // --- Custom Select Logic ---
    const customSelect = document.getElementById('nationalitySelect');
    const selectTrigger = customSelect.querySelector('.select-trigger');
    const selectOptions = customSelect.querySelectorAll('.option');
    const nationalityInput = document.getElementById('nationalityInput');

    selectTrigger.addEventListener('click', () => {
        customSelect.classList.toggle('active');
    });

    selectOptions.forEach(option => {
        option.addEventListener('click', () => {
            const val = option.getAttribute('data-value');
            const html = option.innerHTML;
            selectTrigger.innerHTML = html;
            nationalityInput.value = val;
            customSelect.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!customSelect.contains(e.target)) {
            customSelect.classList.remove('active');
        }
    });

    // --- Navigation Logic ---
    function updateStep(step) {
        steps.forEach(s => s.classList.remove('active'));
        document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');
        
        const percent = ((step - 1) / (steps.length - 1)) * 100;
        progressFill.style.width = `${percent}%`;

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
        data.treatments = Array.from(formData.getAll('treatment'));

        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending...';

        try {
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                form.classList.add('hidden');
                document.querySelector('.progress-bar').classList.add('hidden');
                successMessage.classList.remove('hidden');
            } else {
                throw new Error('Formspree response not ok');
            }

        } catch (error) {
            console.error('Submission failed:', error);
            alert('An error occurred during transmission. Please try again.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
});
