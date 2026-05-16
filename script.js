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

    // --- Intl-Tel-Input Initializtion ---
    const phoneInput = document.querySelector('input[name="phone"]');
    const iti = window.intlTelInput(phoneInput, {
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js",
        separateDialCode: true,
        initialCountry: "auto",
        geoIpLookup: function(success, failure) {
            fetch("https://ipapi.co/json").then(res => res.json()).then(data => success(data.country_code)).catch(() => success("us"));
        }
    });

    // --- Country Data for Nationality ---
    const countries = [
        { name: "Afghanistan", code: "af" }, { name: "Albania", code: "al" }, { name: "Algeria", code: "dz" }, { name: "Andorra", code: "ad" }, { name: "Angola", code: "ao" }, { name: "Antigua and Barbuda", code: "ag" }, { name: "Argentina", code: "ar" }, { name: "Armenia", code: "am" }, { name: "Australia", code: "au" }, { name: "Austria", code: "at" }, { name: "Azerbaijan", code: "az" }, { name: "Bahamas", code: "bs" }, { name: "Bahrain", code: "bh" }, { name: "Bangladesh", code: "bd" }, { name: "Barbados", code: "bb" }, { name: "Belarus", code: "by" }, { name: "Belgium", code: "be" }, { name: "Belize", code: "bz" }, { name: "Benin", code: "bj" }, { name: "Bhutan", code: "bt" }, { name: "Bolivia", code: "bo" }, { name: "Bosnia and Herzegovina", code: "ba" }, { name: "Botswana", code: "bw" }, { name: "Brazil", code: "br" }, { name: "Brunei", code: "bn" }, { name: "Bulgaria", code: "bg" }, { name: "Burkina Faso", code: "bf" }, { name: "Burundi", code: "bi" }, { name: "Cambodia", code: "kh" }, { name: "Cameroon", code: "cm" }, { name: "Canada", code: "ca" }, { name: "Cape Verde", code: "cv" }, { name: "Central African Republic", code: "cf" }, { name: "Chad", code: "td" }, { name: "Chile", code: "cl" }, { name: "China", code: "cn" }, { name: "Colombia", code: "co" }, { name: "Comoros", code: "km" }, { name: "Congo", code: "cg" }, { name: "Costa Rica", code: "cr" }, { name: "Croatia", code: "hr" }, { name: "Cuba", code: "cu" }, { name: "Cyprus", code: "cy" }, { name: "Czech Republic", code: "cz" }, { name: "Denmark", code: "dk" }, { name: "Djibouti", code: "dj" }, { name: "Dominica", code: "dm" }, { name: "Dominican Republic", code: "do" }, { name: "East Timor", code: "tl" }, { name: "Ecuador", code: "ec" }, { name: "Egypt", code: "eg" }, { name: "El Salvador", code: "sv" }, { name: "Equatorial Guinea", code: "gq" }, { name: "Eritrea", code: "er" }, { name: "Estonia", code: "ee" }, { name: "Ethiopia", code: "et" }, { name: "Fiji", code: "fj" }, { name: "Finland", code: "fi" }, { name: "France", code: "fr" }, { name: "Gabon", code: "ga" }, { name: "Gambia", code: "gm" }, { name: "Georgia", code: "ge" }, { name: "Germany", code: "de" }, { name: "Ghana", code: "gh" }, { name: "Greece", code: "gr" }, { name: "Grenada", code: "gd" }, { name: "Guatemala", code: "gt" }, { name: "Guinea", code: "gn" }, { name: "Guinea-Bissau", code: "gw" }, { name: "Guyana", code: "gy" }, { name: "Haiti", code: "ht" }, { name: "Honduras", code: "hn" }, { name: "Hong Kong", code: "hk" }, { name: "Hungary", code: "hu" }, { name: "Iceland", code: "is" }, { name: "India", code: "in" }, { name: "Indonesia", code: "id" }, { name: "Iran", code: "ir" }, { name: "Iraq", code: "iq" }, { name: "Ireland", code: "ie" }, { name: "Israel", code: "il" }, { name: "Italy", code: "it" }, { name: "Ivory Coast", code: "ci" }, { name: "Jamaica", code: "jm" }, { name: "Japan", code: "jp" }, { name: "Jordan", code: "jo" }, { name: "Kazakhstan", code: "kz" }, { name: "Kenya", code: "ke" }, { name: "Kiribati", code: "ki" }, { name: "Korea, North", code: "kp" }, { name: "Korea, South", code: "kr" }, { name: "Kuwait", code: "kw" }, { name: "Kyrgyzstan", code: "kg" }, { name: "Laos", code: "la" }, { name: "Latvia", code: "lv" }, { name: "Lebanon", code: "lb" }, { name: "Lesotho", code: "ls" }, { name: "Liberia", code: "lr" }, { name: "Libya", code: "ly" }, { name: "Liechtenstein", code: "li" }, { name: "Lithuania", code: "lt" }, { name: "Luxembourg", code: "lu" }, { name: "Macedonia", code: "mk" }, { name: "Madagascar", code: "mg" }, { name: "Malawi", code: "mw" }, { name: "Malaysia", code: "my" }, { name: "Maldives", code: "mv" }, { name: "Mali", code: "ml" }, { name: "Malta", code: "mt" }, { name: "Marshall Islands", code: "mh" }, { name: "Mauritania", code: "mr" }, { name: "Mauritius", code: "mu" }, { name: "Mexico", code: "mx" }, { name: "Micronesia", code: "fm" }, { name: "Moldova", code: "md" }, { name: "Monaco", code: "mc" }, { name: "Mongolia", code: "mn" }, { name: "Montenegro", code: "me" }, { name: "Morocco", code: "ma" }, { name: "Mozambique", code: "mz" }, { name: "Myanmar", code: "mm" }, { name: "Namibia", code: "na" }, { name: "Nauru", code: "nr" }, { name: "Nepal", code: "np" }, { name: "Netherlands", code: "nl" }, { name: "New Zealand", code: "nz" }, { name: "Nicaragua", code: "ni" }, { name: "Niger", code: "ne" }, { name: "Nigeria", code: "ng" }, { name: "Norway", code: "no" }, { name: "Oman", code: "om" }, { name: "Pakistan", code: "pk" }, { name: "Palau", code: "pw" }, { name: "Panama", code: "pa" }, { name: "Papua New Guinea", code: "pg" }, { name: "Paraguay", code: "py" }, { name: "Peru", code: "pe" }, { name: "Philippines", code: "ph" }, { name: "Poland", code: "pl" }, { name: "Portugal", code: "pt" }, { name: "Qatar", code: "qa" }, { name: "Romania", code: "ro" }, { name: "Russia", code: "ru" }, { name: "Rwanda", code: "rw" }, { name: "Saint Kitts and Nevis", code: "kn" }, { name: "Saint Lucia", code: "lc" }, { name: "Saint Vincent and the Grenadines", code: "vc" }, { name: "Samoa", code: "ws" }, { name: "San Marino", code: "sm" }, { name: "Sao Tome and Principe", code: "st" }, { name: "Saudi Arabia", code: "sa" }, { name: "Senegal", code: "sn" }, { name: "Serbia", code: "rs" }, { name: "Seychelles", code: "sc" }, { name: "Sierra Leone", code: "sl" }, { name: "Singapore", code: "sg" }, { name: "Slovakia", code: "sk" }, { name: "Slovenia", code: "si" }, { name: "Solomon Islands", code: "sb" }, { name: "Somalia", code: "so" }, { name: "South Africa", code: "za" }, { name: "Spain", code: "es" }, { name: "Sri Lanka", code: "lk" }, { name: "Sudan", code: "sd" }, { name: "Suriname", code: "sr" }, { name: "Swaziland", code: "sz" }, { name: "Sweden", code: "se" }, { name: "Switzerland", code: "ch" }, { name: "Syria", code: "sy" }, { name: "Taiwan", code: "tw" }, { name: "Tajikistan", code: "tj" }, { name: "Tanzania", code: "tz" }, { name: "Thailand", code: "th" }, { name: "Togo", code: "tg" }, { name: "Tonga", code: "to" }, { name: "Trinidad and Tobago", code: "tt" }, { name: "Tunisia", code: "tn" }, { name: "Turkey", code: "tr" }, { name: "Turkmenistan", code: "tm" }, { name: "Tuvalu", code: "tv" }, { name: "Uganda", code: "ug" }, { name: "Ukraine", code: "ua" }, { name: "United Arab Emirates", code: "ae" }, { name: "United Kingdom", code: "gb" }, { name: "United States", code: "us" }, { name: "Uruguay", code: "uy" }, { name: "Uzbekistan", code: "uz" }, { name: "Vanuatu", code: "vu" }, { name: "Vatican City", code: "va" }, { name: "Venezuela", code: "ve" }, { name: "Vietnam", code: "vn" }, { name: "Western Sahara", code: "eh" }, { name: "Yemen", code: "ye" }, { name: "Zambia", code: "zm" }, { name: "Zimbabwe", code: "zw" }
    ];

    // --- Populate Country Dropdown ---
    const countryOptionsContainer = document.getElementById('countryOptions');
    const nationalityInput = document.getElementById('nationalityInput');
    const customSelect = document.getElementById('nationalitySelect');
    const selectTrigger = customSelect.querySelector('.select-trigger');

    countries.forEach(country => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.dataset.value = country.name;
        optionDiv.innerHTML = `<span class="fi fi-${country.code}"></span> ${country.name}`;
        
        optionDiv.addEventListener('click', () => {
            selectTrigger.innerHTML = optionDiv.innerHTML;
            nationalityInput.value = country.name;
            customSelect.classList.remove('active');
        });
        
        countryOptionsContainer.appendChild(optionDiv);
    });

    selectTrigger.addEventListener('click', () => {
        customSelect.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!customSelect.contains(e.target)) {
            customSelect.classList.remove('active');
        }
    });

    // --- Navigation Logic ---
    function updateStep(step) {
        steps.forEach(s => s.classList.remove('active'));
        const targetStep = document.querySelector(`.form-step[data-step="${step}"]`);
        if (targetStep) targetStep.classList.add('active');
        
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
        
        // Get full phone number with dial code
        data.phone = iti.getNumber();

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
