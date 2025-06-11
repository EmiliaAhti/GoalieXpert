// Coaches List JavaScript

// Tallennetut valmentajat (tyhjä aluksi - täyttyy rekisteröintien myötä)
// HUOM: Oikeassa sovelluksessa localStorage korvataan tietokannalla
let coaches = [];

// Simuloidaan localStorage olemassaolo demoa varten
try {
    coaches = JSON.parse(localStorage.getItem('coaches')) || [];
} catch (e) {
    coaches = [];
}

let filteredCoaches = [...coaches];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    displayCoaches(coaches);
    setupFilters();
});

// Display coaches
function displayCoaches(coachesToShow) {
    const grid = document.getElementById('coachesGrid');
    const noResults = document.getElementById('noResults');
    
    if (coachesToShow.length === 0) {
        grid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    grid.style.display = 'grid';
    noResults.style.display = 'none';
    
    grid.innerHTML = coachesToShow.map(coach => createCoachCard(coach)).join('');
}

// Create coach card HTML
function createCoachCard(coach) {
    const initials = coach.firstName.charAt(0) + coach.lastName.charAt(0);
    const experienceText = getExperienceText(coach.coachingExperience);
    
    return `
        <div class="coach-card" data-coach-id="${coach.id}">
            <div class="coach-header">
                <div class="coach-avatar">${initials}</div>
                <div class="coach-name">${coach.firstName} ${coach.lastName}</div>
                <div class="coach-location">${coach.city}</div>
            </div>
            <div class="coach-content">
                <div class="coach-info">
                    <div class="info-item">
                        <div class="info-label">Kokemus</div>
                        <div class="info-value">${experienceText}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Hinta</div>
                        <div class="info-value">${coach.sessionPrice}€/h</div>
                    </div>
                </div>
                
                <div class="coach-specialties">
                    <h4>Erikoisalueet</h4>
                    <div class="specialties-tags">
                        ${coach.specialties.map(specialty => 
                            `<span class="specialty-tag">${getSpecialtyText(specialty)}</span>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="coach-bio">
                    <h4>Esittely</h4>
                    <p class="bio-text">${coach.bio || 'Ei esittelyä vielä lisätty.'}</p>
                </div>
                
                <div class="coach-availability">
                    <h4>Saatavuus</h4>
                    <div class="availability-info">
                        <div><strong>Päivät:</strong> ${coach.availableDays.map(day => getDayText(day)).join(', ')}</div>
                        <div><strong>Ajat:</strong> ${coach.availableTimes.map(time => getTimeText(time)).join(', ')}</div>
                    </div>
                </div>
                
                <div class="coach-actions">
                    <button class="btn btn-book" onclick="bookCoach(${coach.id})">Varaa tunti</button>
                    <button class="btn btn-profile" onclick="viewCoachProfile(${coach.id})">Näytä profiili</button>
                </div>
            </div>
        </div>
    `;
}

// Helper functions for text conversion
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

function getDayText(day) {
    const days = {
        'maanantai': 'Ma',
        'tiistai': 'Ti',
        'keskiviikko': 'Ke',
        'torstai': 'To',
        'perjantai': 'Pe',
        'lauantai': 'La',
        'sunnuntai': 'Su'
    };
    return days[day] || day;
}

function getTimeText(time) {
    const times = {
        'aamur': 'Aamu (8-12)',
        'paiva': 'Päivä (12-16)',
        'alkuilta': 'Alkuilta (16-18)',
        'ilta': 'Ilta (18-21)'
    };
    return times[time] || time;
}

// Setup filters
function setupFilters() {
    const cityFilter = document.getElementById('cityFilter');
    const experienceFilter = document.getElementById('experienceFilter');
    const priceFilter = document.getElementById('priceFilter');
    const specialtyFilter = document.getElementById('specialtyFilter');
    const clearButton = document.getElementById('clearFilters');
    
    // Add event listeners
    [cityFilter, experienceFilter, priceFilter, specialtyFilter].forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });
    
    clearButton.addEventListener('click', clearFilters);
    
    // Populate city options from coaches
    populateCityOptions();
}

function populateCityOptions() {
    const cityFilter = document.getElementById('cityFilter');
    const cities = [...new Set(coaches.map(coach => coach.city))].sort();
    
    // Clear existing options except first
    cityFilter.innerHTML = '<option value="">Kaikki kaupungit</option>';
    
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.toLowerCase();
        option.textContent = city;
        cityFilter.appendChild(option);
    });
}

// Apply filters
function applyFilters() {
    const cityFilter = document.getElementById('cityFilter').value;
    const experienceFilter = document.getElementById('experienceFilter').value;
    const priceFilter = document.getElementById('priceFilter').value;
    const specialtyFilter = document.getElementById('specialtyFilter').value;
    
    filteredCoaches = coaches.filter(coach => {
        // City filter
        if (cityFilter && coach.city.toLowerCase() !== cityFilter) {
            return false;
        }
        
        // Experience filter
        if (experienceFilter && coach.coachingExperience !== experienceFilter) {
            return false;
        }
        
        // Price filter
        if (priceFilter) {
            const price = parseInt(coach.sessionPrice);
            const [min, max] = priceFilter.split('-').map(p => parseInt(p));
            if (max && (price < min || price > max)) {
                return false;
            }
            if (!max && price < min) {
                return false;
            }
        }
        
        // Specialty filter
        if (specialtyFilter && !coach.specialties.includes(specialtyFilter)) {
            return false;
        }
        
        return true;
    });
    
    displayCoaches(filteredCoaches);
}

// Clear filters
function clearFilters() {
    document.getElementById('cityFilter').value = '';
    document.getElementById('experienceFilter').value = '';
    document.getElementById('priceFilter').value = '';
    document.getElementById('specialtyFilter').value = '';
    
    filteredCoaches = [...coaches];
    displayCoaches(filteredCoaches);
}

// Coach actions
function bookCoach(coachId) {
    // Redirect to booking page
    window.location.href = `booking.html?coachId=${coachId}`;
}

function viewCoachProfile(coachId) {
    // Redirect to coach profile page
    window.location.href = `coach-profile.html?id=${coachId}`;
}

// Refresh coaches data (call when new coach registers)
function refreshCoaches() {
    coaches = JSON.parse(localStorage.getItem('coaches')) || [];
    filteredCoaches = [...coaches];
    displayCoaches(coaches);
    populateCityOptions();
}