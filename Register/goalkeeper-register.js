// Goalkeeper Registration JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('goalkeeperForm');
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
    const goalkeeperData = collectFormData(formData);
    
    // Generate unique ID
    goalkeeperData.id = Date.now();
    goalkeeperData.registrationDate = new Date().toISOString();
    
    // Save to localStorage
    saveGoalkeeper(goalkeeperData);
    
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
    const checkboxFields = ['weaknesses', 'preferredDays'];
    checkboxFields.forEach(field => {
        if (data[field] && !Array.isArray(data[field])) {
            data[field] = [data[field]];
        } else if (!data[field]) {
            data[field] = [];
        }
    });
    
    return data;
}

function saveGoalkeeper(goalkeeperData) {
    // Get existing goalkeepers
    let goalkeepers = JSON.parse(localStorage.getItem('goalkeepers')) || [];
    
    // Add new goalkeeper
    goalkeepers.push(goalkeeperData);
    
    // Save back to localStorage
    localStorage.setItem('goalkeepers', JSON.stringify(goalkeepers));
    
    // Save current goalkeeper ID for profile redirect
    localStorage.setItem('currentGoalkeeperId', goalkeeperData.id);
}

function validateForm() {
    const form = document.getElementById('goalkeeperForm');
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
    if (!validateCheckboxGroup('weaknesses', 'Valitse vähintään yksi kehitysalue')) {
        isValid = false;
    }
    
    if (!validateCheckboxGroup('preferredDays', 'Valitse vähintään yksi päivä')) {
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
    
    // Validate age (must be reasonable)
    const birthDate = document.getElementById('birthDate');
    if (birthDate.value) {
        const age = calculateAge(new Date(birthDate.value));
        if (age < 5 || age > 60) {
            showFieldError(birthDate, 'Ikä tulee olla välillä 5-60 vuotta');
            isValid = false;
        }
    }
    
    return isValid;
}

function calculateAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
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
    const form = document.getElementById('goalkeeperForm');
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
    const form = document.getElementById('goalkeeperForm');
    form.style.opacity = '0.6';
    form.style.pointerEvents = 'none';
    
    // Show success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <h3>Rekisteröinti onnistui!</h3>
        <p>Maalivahtikoprofiilisi on luotu onnistuneesti. Voit nyt selata valmentajia ja varata tunteja.</p>
        <p>Ohjataan sinut valmentajien listaan...</p>
    `;
    
    form.parentNode.insertBefore(successDiv, form);
    
    // Redirect after 2 seconds
    setTimeout(() => {
        window.location.href = 'coaches-list.html';
    }, 2000);
}