// Coach Profile JavaScript

let currentCoach = null;

document.addEventListener('DOMContentLoaded', function() {
    loadCoachProfile();
});

function loadCoachProfile() {
    // Show loading
    showLoading();
    
    const urlParams = new URLSearchParams(window.location.search);
    const coachId = parseInt(urlParams.get('id'));
    
    if (!coachId) {
        showNoProfile('Valmentajaa ei löytynyt');
        return;
    }
    
    const coaches = JSON.parse(localStorage.getItem('coaches')) || [];
    currentCoach = coaches.find(coach => coach.id === coachId);
    
    if (!currentCoach) {
        showNoProfile('Valmentajan profiilia ei löytynyt');
        return;
    }
    
    displayCoachProfile();
}

function showLoading() {
    const profileContent = document.getElementById('profileContent');
    profileContent.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
        </div>
    `;
}

function showNoProfile(message) {
    const profileContent = document.getElementById('profileContent');
    profileContent.innerHTML = `
        <div class="no-profile">
            <h3>Profiilia ei löytynyt</h3>
            <p>${message}</p>
            <button class="btn btn-primary" onclick="window.location.href='coaches-list.html'">
                Palaa valmentajien listaan
            </button>
        </div>
    `;
}

function displayCoachProfile() {
    const profileContent = document.getElementById('profileContent');
    const initials = currentCoach.firstName.charAt(0) + currentCoach.lastName.charAt(0);
    
    profileContent.innerHTML = `
        <div class="profile-header">
            <div class="profile-avatar">${initials}</div>
            <div class="profile-name">${currentCoach.firstName} ${currentCoach.lastName}</div>
            <div class="profile-role">Maalivahtivalmentaja</div>
            <div class="profile-location">${currentCoach.city}</div>
        </div>

        <div class="profile-content">
            <div class="profile-section">
                <h3 class="section-title">Perustiedot</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Kokemus:</span>
                        <span class="info-value">${getExperienceText(currentCoach.coachingExperience)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Pelitausta:</span>
                        <span class="info-value">${getPlayingLevelText(currentCoach.playingExperience)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Hinta:</span>
                        <span class="info-value">${currentCoach.sessionPrice}€/tunti</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Matkaetäisyys:</span>
                        <span class="info-value">${getDistanceText(currentCoach.travelDistance)}</span>
                    </div>
                    ${currentCoach.currentRole ? `
                    <div class="info-item">
                        <span class="info-label">Nykyinen rooli:</span>
                        <span class="info-value">${currentCoach.currentRole}</span>
                    </div>
                    ` : ''}
                    ${currentCoach.qualifications ? `
                    <div class="info-item">
                        <span class="info-label">Pätevyydet:</span>
                        <span class="info-value">${currentCoach.qualifications}</span>
                    </div>
                    ` : ''}
                </div>
            </div>

            <div class="profile-section">
                <h3 class="section-title">Saatavuus</h3>
                <h4 style="margin-bottom: 1rem; color: #333;">Päivät</h4>
                <div class="availability-grid">
                    ${currentCoach.availableDays.map(day => `
                        <div class="availability-item">${getDayText(day)}</div>
                    `).join('')}
                </div>
                <h4 style="margin: 1.5rem 0 1rem; color: #333;">Ajat</h4>
                <div class="availability-grid">
                    ${currentCoach.availableTimes.map(time => `
                        <div class="availability-item">${getTimeText(time)}</div>
                    `).join('')}
                </div>
            </div>

            <div class="profile-section full-width">
                <h3 class="section-title">Erikoisalueet</h3>
                <div class="specialties-grid">
                    ${currentCoach.specialties.map(specialty => `
                        <div class="specialty-item">${getSpecialtyText(specialty)}</div>
                    `).join('')}
                </div>
            </div>

            <div class="profile-section full-width">
                <h3 class="section-title">Ikäryhmät</h3>
                <div class="age-groups-grid">
                    ${currentCoach.ageGroups.map(group => `
                        <div class="age-group-item">${getAgeGroupText(group)}</div>
                    `).join('')}
                </div>
            </div>

            ${currentCoach.bio ? `
            <div class="profile-section full-width">
                <h3 class="section-title">Esittely</h3>
                <p class="bio-text">${currentCoach.bio}</p>
            </div>
            ` : ''}

            ${currentCoach.trainingLocations ? `
            <div class="profile-section full-width">
                <h3 class="section-title">Valmennuspaikat</h3>
                <p class="bio-text">${currentCoach.trainingLocations}</p>
            </div>
            ` : ''}

            <div class="profile-section contact-section full-width">
                <h3 class="section-title">Ota yhteyttä</h3>
                <div class="contact-info">
                    <div class="contact-item">
                        <span>📧</span>
                        <span>${currentCoach.email}</span>
                    </div>
                    <div class="contact-item">
                        <span>📱</span>
                        <span>${currentCoach.phone}</span>
                    </div>
                </div>
                <div class="contact-actions">
                    <button class="btn-contact" onclick="contactCoach()">
                        Lähetä viesti
                    </button>
                    <button class="btn-book" onclick="bookCoach()">
                        Varaa tunti
                    </button>
                </div>
            </div>
        </div>
    `;
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

function getPlayingLevelText(level) {
    const levels = {
        'harrastaja': 'Harrastajataso',
        'seurajuniorit': 'Seurajuniorit',
        'aluetaso': 'Aluetaso',
        'valtakunnallinen': 'Valtakunnallinen',
        'sm-sarja': 'SM-sarja',
        'maajoukkue': 'Maajoukkue'
    };
    return levels[level] || level;
}

function getSpecialtyText(specialty) {
    const specialties = {
        'torjuntatekniikka': 'Torjuntatekniikka',
        'jalkatyoskentely': 'Jalkatyöskentely',
        'syotot': 'Syötöt ja aloitukset',
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
        'maanantai': 'Maanantai',
        'tiistai': 'Tiistai',
        'keskiviikko': 'Keskiviikko',
        'torstai': 'Torstai',
        'perjantai': 'Perjantai',
        'lauantai': 'Lauantai',
        'sunnuntai': 'Sunnuntai'
    };
    return days[day] || day;
}

function getTimeText(time) {
    const times = {
        'aamur': 'Aamupäivä (8-12)',
        'paiva': 'Päivä (12-16)',
        'alkuilta': 'Alkuilta (16-18)',
        'ilta': 'Ilta (18-21)'
    };
    return times[time] || time;
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

function getAgeGroupText(group) {
    const groups = {
        'alle-10': 'Alle 10v',
        '10-14': '10-14v',
        '15-18': '15-18v',
        'aikuiset': 'Aikuiset'
    };
    return groups[group] || group;
}

// Action functions
function contactCoach() {
    alert(`Yhteystiedot:\nSähköposti: ${currentCoach.email}\nPuhelin: ${currentCoach.phone}\n\nTämä toiminto laajennettaisiin oikeassa sovelluksessa viestintäjärjestelmäksi.`);
}

function bookCoach() {
    window.location.href = `booking.html?coachId=${currentCoach.id}`;
}