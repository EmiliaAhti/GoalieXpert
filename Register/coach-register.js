// Coach Registration JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('coachForm');
    form.addEventListener('submit', handleSubmit);
    
    // Add real-time validation
    setupValidation();
});

function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    const formData = new FormData(e.target);
    const coachData = collectFormData(formData);
    
    // Generate unique ID
    coachData.id = Date.now();
    coachData.registrationDate = new Date().toISOString();
    
    // Save to localStorage
    saveCoach(coachData);
    
    // Show success message and redirect
    showSuccessMessage();
}

function collectFormData(formData) {
    const data = {};
    
    // Basic form fields
    for (let [key, value] of formData.entries()) {
        if (data[key]) {
            // Handle multiple values (checkboxes)
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    }
    
    // Convert checkbox arrays to proper arrays
    const checkboxFields = ['specialties', 'ageGroups', 'availableDays', 'availableTimes'];
    checkboxFields.forEach(field => {
        if (data[field] && !Array.isArray(data[field])) {
            data[field] = [data[field]];
        } else if (!data[field]) {
            data[field] = [];
        }
    });
    
    return data;
}

function saveCoach(coachData) {
    // Get existing coaches
    let coaches = JSON.parse(localStorage.getItem('coaches')) || [];
    
    // Add new coach
    coaches.push(coachData);
    
    // Save back to localStorage
    localStorage.setItem('coaches', JSON.stringify(coaches));
    
    // Save current coach ID for profile redirect
    localStorage.setItem('currentCoachId', coachData.id);
}

function validateForm() {
    const form = document.getElementById('coachForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    // Clear previous errors
    clearErrors();
    
    // Check required fields
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Check required checkboxes
    if (!validateCheckboxGroup('specialties', 'Valitse vähintään yksi erikoisalue')) {
        isValid = false;
    }
    
    if (!validateCheckboxGroup('ageGroups', 'Valitse vähintään yksi ikäryhmä')) {
        isValid = false;
    }
    
    if (!validateCheckboxGroup('availableDays', 'Valitse vähintään yksi päivä')) {
        isValid = false;
    }
    
    if (!validateCheckboxGroup('availableTimes', 'Valitse vähintään yksi aika')) {
        isValid = false;
    }
    
    // Validate email format
    const email = document.getElementById('email');
    if (email.value && !isValidEmail(email.value)) {
        showFieldError(email, 'Syötä kelvollinen sähköpostiosoite');
        isValid = false;
    }
    
    // Validate phone format
    const phone = document.getElementById('phone');
    if (phone.value && !isValidPhone(phone.value)) {
        showFieldError(phone, 'Syötä kelvollinen puhelinnumero');
        isValid = false;
    }
    
    // Validate price
    const price = document.getElementById('sessionPrice');
    if (price.value && (price.value < 20 || price.value > 200)) {
        showFieldError(price, 'Hinta tulee olla 20-200€ välillä');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    if (field.type === 'checkbox') {
        return true; // Handle checkbox groups separately
    }
    
    if (!field.value.trim()) {
        showFieldError(field, 'Tämä kenttä on pakollinen');
        return false;
    }
    
    return true;
}

function validateCheckboxGroup(name, errorMessage) {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
    if (checkboxes.length === 0) {
        const group = document.querySelector(`input[name="${name}"]`).closest('.form-group');
        showGroupError(group, errorMessage);
        return false;
    }
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^(\+358|0)[0-9\s\-]{8,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function showFieldError(field, message) {
    field.style.borderColor = '#dc3545';
    
    // Remove existing error
    const existingError = field.parentNode.querySelector('.error-text');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-text';
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function showGroupError(group, message) {
    // Remove existing error
    const existingError = group.querySelector('.error-text');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-text';
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '0.5rem';
    errorDiv.textContent = message;
    
    group.appendChild(errorDiv);
}

function clearErrors() {
    // Remove all error styling and messages
    const errorTexts = document.querySelectorAll('.error-text');
    errorTexts.forEach(error => error.remove());
    
    const fields = document.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        field.style.borderColor = '';
    });
}

function setupValidation() {
    const form = document.getElementById('coachForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required')) {
                validateField(this);
            }
        });
        
        input.addEventListener('input', function() {
            // Clear error when user starts typing
            if (this.style.borderColor === 'rgb(220, 53, 69)') {
                this.style.borderColor = '';
                const errorText = this.parentNode.querySelector('.error-text');
                if (errorText) {
                    errorText.remove();
                }
            }
        });
    });
}

function showSuccessMessage() {
    // Disable form
    const form = document.getElementById('coachForm');
    form.style.opacity = '0.6';
    form.style.pointerEvents = 'none';
    
    // Show success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <h3>Rekisteröinti onnistui!</h3>
        <p>Valmentajaprofiilisi on luotu onnistuneesti. Ohjataan sinut profiilisivullesi...</p>
    `;
    
    form.parentNode.insertBefore(successDiv, form);
    
    // Redirect after 2 seconds
    setTimeout(() => {
        const coachId = localStorage.getItem('currentCoachId');
        window.location.href = `coach-profile.html?id=${coachId}`;
    }, 2000);
}