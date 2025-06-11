// Booking JavaScript

let currentCoach = null;
let selectedTimeSlot = null;

document.addEventListener('DOMContentLoaded', function() {
    loadCoachInfo();
    setupBookingForm();
    setMinDate();
});

function loadCoachInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const coachId = parseInt(urlParams.get('coachId'));
    
    if (!coachId) {
        alert('Valmentajaa ei löytynyt. Palaat valmentajien listaan.');
        window.location.href = 'coaches-list.html';
        return;
    }
    
    const coaches = JSON.parse(localStorage.getItem('coaches')) || [];
    currentCoach = coaches.find(coach => coach.id === coachId);
    
    if (!currentCoach) {
        alert('Valmentajaa ei löytynyt. Palaat valmentajien listaan.');
        window.location.href = 'coaches-list.html';
        return;
    }
    
    displayCoachInfo();
    populateAvailableTimes();
}

function displayCoachInfo() {
    const coachInfoSection = document.getElementById('coachInfo');
    const initials = currentCoach.firstName.charAt(0) + currentCoach.lastName.charAt(0);
    const experienceText = getExperienceText(currentCoach.coachingExperience);
    
    coachInfoSection.innerHTML = `
        <div class="coach-info-header">
            <div class="coach-avatar-large">${initials}</div>
            <div class="coach-name-large">${currentCoach.firstName} ${currentCoach.lastName}</div>
            <div class="coach-location-large">${currentCoach.city}</div>
        </div>
        
        <div class="coach-info-details">
            <div class="detail-item">
                <span class="detail-label">Kokemus:</span>
                <span class="detail-value">${experienceText}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Hinta:</span>
                <span class="detail-value">${currentCoach.sessionPrice}€/tunti</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Matka:</span>
                <span class="detail-value">${getDistanceText(currentCoach.travelDistance)}</span>
            </div>
        </div>
        
        <div class="coach-specialties-info">
            <h4>Erikoisalueet</h4>
            <div class="specialties-list">
                ${currentCoach.specialties.map(specialty => 
                    `<span class="specialty-badge">${getSpecialtyText(specialty)}</span>`
                ).join('')}
            </div>
        </div>
    `;
}

function populateAvailableTimes() {
    const timeSelect = document.getElementById('preferredTime');
    
    // Clear existing options
    timeSelect.innerHTML = '<option value="">Valitse aika</option>';
    
    // Add time slots based on coach's available times
    const timeSlots = generateTimeSlots();
    
    timeSlots.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot.value;
        option.textContent = slot.label;
        timeSelect.appendChild(option);
    });
}

function generateTimeSlots() {
    const slots = [];
    const availableTimes = currentCoach.availableTimes || [];
    
    if (availableTimes.includes('aamur')) {
        slots.push({value: '08:00', label: '08:00'});
        slots.push({value: '09:00', label: '09:00'});
        slots.push({value: '10:00', label: '10:00'});
        slots.push({value: '11:00', label: '11:00'});
    }
    
    if (availableTimes.includes('paiva')) {
        slots.push({value: '12:00', label: '12:00'});
        slots.push({value: '13:00', label: '13:00'});
        slots.push({value: '14:00', label: '14:00'});
        slots.push({value: '15:00', label: '15:00'});
    }
    
    if (availableTimes.includes('alkuilta')) {
        slots.push({value: '16:00', label: '16:00'});
        slots.push({value: '17:00', label: '17:00'});
    }
    
    if (availableTimes.includes('ilta')) {
        slots.push({value: '18:00', label: '18:00'});
        slots.push({value: '19:00', label: '19:00'});
        slots.push({value: '20:00', label: '20:00'});
    }
    
    return slots;
}

function setMinDate() {
    const dateInput = document.getElementById('preferredDate');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    dateInput.min = tomorrow.toISOString().split('T')[0];
}

function setupBookingForm() {
    const form = document.getElementById('bookingForm');
    form.addEventListener('submit', handleBookingSubmit);
    
    // Add event listeners for real-time summary updates
    const formInputs = form.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('change', updateBookingSummary);
        input.addEventListener('input', updateBookingSummary);
    });
    
    // Setup validation
    setupBookingValidation();
}

function updateBookingSummary() {
    const summaryDiv = document.getElementById('bookingSummary');
    
    const date = document.getElementById('preferredDate').value;
    const time = document.getElementById('preferredTime').value;
    const duration = document.getElementById('duration').value;
    const location = document.getElementById('location').value;
    const focusAreas = Array.from(document.querySelectorAll('input[name="focus"]:checked'))
        .map(cb => getSpecialtyText(cb.value));
    
    if (!date || !time || !duration) {
        summaryDiv.style.display = 'none';
        return;
    }
    
    const price = calculateTotalPrice(duration);
    const formattedDate = formatDate(date);
    
    summaryDiv.style.display = 'block';
    summaryDiv.innerHTML = `
        <h3>Varauksen yhteenveto</h3>
        <div class="summary-grid">
            <div class="summary-item">
                <span class="summary-label">Valmentaja:</span>
                <span class="summary-value">${currentCoach.firstName} ${currentCoach.lastName}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Päivämäärä:</span>
                <span class="summary-value">${formattedDate}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Kellonaika:</span>
                <span class="summary-value">${time}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Kesto:</span>
                <span class="summary-value">${duration} min</span>
            </div>
            ${location ? `
            <div class="summary-item">
                <span class="summary-label">Paikka:</span>
                <span class="summary-value">${getLocationText(location)}</span>
            </div>
            ` : ''}
            ${focusAreas.length > 0 ? `
            <div class="summary-item" style="grid-column: 1 / -1;">
                <span class="summary-label">Painopisteet:</span>
                <span class="summary-value">${focusAreas.join(', ')}</span>
            </div>
            ` : ''}
        </div>
        <div class="total-price">
            Yhteensä: ${price}€
        </div>
    `;
}

function calculateTotalPrice(duration) {
    if (!duration) return 0;
    
    const hourlyRate = currentCoach.sessionPrice;
    const hours = parseInt(duration) / 60;
    
    return Math.round(hourlyRate * hours);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('fi-FI', options);
}

function handleBookingSubmit(e) {
    e.preventDefault();
    
    if (!validateBookingForm()) {
        return;
    }
    
    const formData = new FormData(e.target);
    const bookingData = collectBookingData(formData);
    
    // Generate unique booking ID
    bookingData.id = Date.now();
    bookingData.coachId = currentCoach.id;
    bookingData.status = 'pending';
    bookingData.createdAt = new Date().toISOString();
    
    // Save booking
    saveBooking(bookingData);
    
    // Show success message
    showBookingSuccess();
}

function collectBookingData(formData) {
    const data = {};
    
    // Collect basic form data
    for (let [key, value] of formData.entries()) {
        if (data[key]) {
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    }
    
    // Convert checkbox arrays
    if (data.focus && !Array.isArray(data.focus)) {
        data.focus = [data.focus];
    } else if (!data.focus) {
        data.focus = [];
    }
    
    // Calculate total price
    data.totalPrice = calculateTotalPrice(data.duration);
    
    return data;
}

function saveBooking(bookingData) {
    let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push(bookingData);
    localStorage.setItem('bookings', JSON.stringify(bookings));
}

function validateBookingForm() {
    const requiredFields = [
        'preferredDate', 'preferredTime', 'duration', 'location',
        'clientName', 'clientEmail', 'clientPhone'
    ];
    
    let isValid = true;
    
    // Clear previous errors
    clearBookingErrors();
    
    // Check required fields
    requiredFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (!field.value.trim()) {
            showFieldError(field, 'Tämä kenttä on pakollinen');
            isValid = false;
        }
    });
    
    // Check focus areas
    const focusAreas = document.querySelectorAll('input[name="focus"]:checked');
    if (focusAreas.length === 0) {
        const focusGroup = document.querySelector('input[name="focus"]').closest('.form-group');
        showGroupError(focusGroup, 'Valitse vähintään yksi painopistealue');
        isValid = false;
    }
    
    // Validate email
    const email = document.getElementById('clientEmail');
    if (email.value && !isValidEmail(email.value)) {
        showFieldError(email, 'Syötä kelvollinen sähköpostiosoite');
        isValid = false;
    }
    
    // Validate date (not in past)
    const date = document.getElementById('preferredDate');
    if (date.value) {
        const selectedDate = new Date(date.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate <= today) {
            showFieldError(date, 'Valitse tulevaisuuden päivämäärä');
            isValid = false;
        }
    }
    
    return isValid;
}

function setupBookingValidation() {
    const form = document.getElementById('bookingForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required')) {
                validateBookingField(this);
            }
        });
        
        input.addEventListener('input', function() {
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

function validateBookingField(field) {
    if (!field.value.trim()) {
        showFieldError(field, 'Tämä kenttä on pakollinen');
        return false;
    }
    return true;
}

function showBookingSuccess() {
    const form = document.getElementById('bookingForm');
    form.style.display = 'none';
    
    const successDiv = document.createElement('div');
    successDiv.className = 'booking-success';
    successDiv.innerHTML = `
        <h3>Varaus lähetetty onnistuneesti!</h3>
        <p>Varaussi on lähetetty valmentajalle ${currentCoach.firstName} ${currentCoach.lastName}.</p>
        <p>Saat vahvistuksen sähköpostitse 24 tunnin sisään.</p>
        <button class="btn btn-primary" onclick="window.location.href='coaches-list.html'">Palaa valmentajiin</button>
    `;
    
    form.parentNode.appendChild(successDiv);
}

// Helper functions
function getExperienceText(experience) {
    const experiences = {
        'alle-1v': 'Alle 1 vuosi',
        '1-3v': '1-3 vuotta',
        '3-5v': '3-5 vuotta',
        '5-10v': '5-10 vuotta',
        'yli-10v': 'Yli 10 vuotta'
    };
    return experiences[experience] || experience;
}

function getSpecialtyText(specialty) {
    const specialties = {
        'torjuntatekniikka': 'Torjuntatekniikka',
        'jalkatyoskentely': 'Jalkatyöskentely',
        'syotot': 'Syötöt',
        'pelinluku': 'Pelinluku',
        'kommunikointi': 'Kommunikointi',
        'henkinen-valmennus': 'Henkinen valmennus',
        'yksi-vastaan-yksi': '1v1 tilanteet',
        'kulmapallot': 'Kulmapallot',
        'ristisyotot': 'Ristisyötöt',
        'fyysinen-valmennus': 'Fyysinen valmennus'
    };
    return specialties[specialty] || specialty;
}

function getDistanceText(distance) {
    const distances = {
        '5': 'Alle 5 km',
        '10': 'Alle 10 km',
        '20': 'Alle 20 km',
        '50': 'Alle 50 km',
        '100': 'Yli 50 km'
    };
    return distances[distance] || distance + ' km';
}

function getLocationText(location) {
    const locations = {
        'valmentajan-paikka': 'Valmentajan ehdottama paikka',
        'oma-paikka': 'Oma harjoituspaikka',
        'sovitaan-erikseen': 'Sovitaan erikseen'
    };
    return locations[location] || location;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(field, message) {
    field.style.borderColor = '#dc3545';
    
    const existingError = field.parentNode.querySelector('.error-text');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-text';
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function showGroupError(group, message) {
    const existingError = group.querySelector('.error-text');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-text';
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '0.5rem';
    errorDiv.textContent = message;
    
    group.appendChild(errorDiv);
}

function clearBookingErrors() {
    const errorTexts = document.querySelectorAll('.error-text');
    errorTexts.forEach(error => error.remove());
    
    const fields = document.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        field.style.borderColor = '';
    });
}