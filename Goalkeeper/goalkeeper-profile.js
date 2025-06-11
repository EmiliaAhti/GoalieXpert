// Goalkeeper Profile JavaScript

let currentGoalkeeper = null;

document.addEventListener('DOMContentLoaded', function() {
    loadGoalkeeperProfile();
});

function loadGoalkeeperProfile() {
    showLoading();
    
    const urlParams = new URLSearchParams(window.location.search);
    const goalkeeperId = parseInt(urlParams.get('id'));
    
    if (!goalkeeperId) {
        showNoProfile('Maalivahtia ei löytynyt');
        return;
    }
    
    let goalkeepers = [];
    try {
        goalkeepers = JSON.parse(localStorage.getItem('goalkeepers')) || [];
    } catch (e) {
        goalkeepers = [];
    }
    
    currentGoalkeeper = goalkeepers.find(gk => gk.id === goalkeeperId);
    
    if (!currentGoalkeeper) {
        showNoProfile('Maalivahdin profiilia ei löytynyt');
        return;
    }
    
    displayGoalkeeperProfile();
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
            <button class="btn btn-primary" onclick="window.location.href='goalkeepers-list.html'">
                Palaa maalivahtien listaan
            </button>
        </div>
    `;
}

function displayGoalkeeperProfile() {
    const profileContent = document.getElementById('profileContent');
    const initials = currentGoalkeeper.firstName.charAt(0) + currentGoalkeeper.lastName.charAt(0);
    const age = calculateAge(new Date(currentGoalkeeper.birthDate));
    
    profileContent.innerHTML = `
        <div class="profile-header">
            <div class="profile-avatar">${initials}</div>
            <div class="profile-name">${currentGoalkeeper.firstName} ${currentGoalkeeper.lastName}</div>
            <div class="profile-role">Maalivahti • ${age} vuotta</div>
            <div class="profile-location">${currentGoalkeeper.city}</div>
        </div>

        <div class="profile-content">
            <div class="profile-section">
                <h3 class="section-title">Perustiedot</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Kokemus:</span>
                        <span class="info-value">${getExperienceText(currentGoalkeeper.experience)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Pelitaso:</span>
                        <span class="info-value">${getLevelText(currentGoalkeeper.playingLevel)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Pelipaikka:</span>
                        <span class="info-value">${getPositionText(currentGoalkeeper.position)}</span>
                    </div>
                    ${currentGoalkeeper.currentTeam ? `
                    <div class="info-item">
                        <span class="info-label">Joukkue:</span>
                        <span class="info-value">${currentGoalkeeper.currentTeam}</span>
                    </div>
                    ` : ''}
                </div>
            </div>

            <div class="profile-section">
                <h3 class="section-title">Valmennustoiveet</h3>
                <h4 style="margin-bottom: 1rem; color: #333;">Toivotut päivät</h4>
                <div class="availability-grid">
                    ${currentGoalkeeper.preferredDays.map(day => `
                        <div class="availability-item">${getDayText(day)}</div>
                    `).join('')}
                </div>
                ${currentGoalkeeper.preferredTime ? `
                <h4 style="margin: 1.5rem 0 1rem; color: #333;">Toivottu aika</h4>
                <div class="availability-item" style="margin-bottom: 1rem;">
                    ${getTimeText(currentGoalkeeper.preferredTime)}
                </div>
                ` : ''}
                <div class="info-grid" style="margin-top: 1rem;">
                    <div class="info-item">
                        <span class="info-label">Tiheys:</span>
                        <span class="info-value">${getFrequencyText(currentGoalkeeper.trainingFrequency)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Max matka:</span>
                        <span class="info-value">${getDistanceText(currentGoalkeeper.maxDistance)}</span>
                    </div>
                </div>
            </div>

            <div class="profile-section full-width">
                <h3 class="section-title">Kehityskohteet</h3>
                <div class="specialties-grid">
                    ${currentGoalkeeper.weaknesses.map(weakness => `
                        <div class="specialty-item" style="background: #fff3cd; color: #856404; border-color: #ffeaa7;">
                            ${getWeaknessText(weakness)}
                        </div>
                    `).join('')}
                </div>
            </div>

            ${currentGoalkeeper.goals ? `
            <div class="profile-section full-width">
                <h3 class="section-title">Henkilökohtaiset tavoitteet</h3>
                <p class="bio-text">${currentGoalkeeper.goals}</p>
            </div>
            ` : ''}

            ${currentGoalkeeper.additionalInfo ? `
            <div class="profile-section full-width">
                <h3 class="section-title">Lisätietoja</h3>
                <p class="bio-text">${currentGoalkeeper.additionalInfo}</p>
            </div>
            ` : ''}

            <div class="profile-section contact-section full-width">
                <h3 class="section-title">Yhteystiedot</h3>
                <div class="contact-info">
                    <div class="contact-item">
                        <span>📧</span>
                        <span>${currentGoalkeeper.email}</span>
                    </div>
                    <div class="contact-item">
                        <span>📱</span>
                        <span>${currentGoalkeeper.phone}</span>
                    </div>
                </div>
                <div class="contact-actions">
                    <button class="btn-contact" onclick="contactGoalkeeper()">
                        Ota yhteyttä
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Helper functions
function calculateAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}

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

function getLevelText(level) {
    const levels = {
        'harrastaja': 'Harrastaja',
        'seurajuniorit': 'Seurajuniorit',
        'aluetaso': 'Aluetaso',
        'valtakunnallinen': 'Valtakunnallinen',
        'sm-sarja': 'SM-sarja'
    };
    return levels[level] || level;
}

function getPositionText(position) {
    const positions = {
        'maalivahti': 'Maalivahti',
        'varamaalivahti': 'Varamaalivahti',
        'kenttapelaaja-maalivahti': 'Kenttäpelaaja + Maalivahti'
    };
    return positions[position] || 'Maalivahti';
}

function getWeaknessText(weakness) {
    const weaknesses = {
        'torjuntatekniikka': 'Torjuntatekniikka',
        'jalkatyoskentely': 'Jalkatyöskentely',
        'syotot': 'Syötöt',
        'pelinluku': 'Pelinluku',
        'kommunikointi': 'Kommunikointi',
        'keskittyminen': 'Keskittyminen',
        'yksi-vastaan-yksi': '1v1 tilanteet',
        'kulmapallot': 'Kulmapallot',
        'ristisyotot': 'Ristisyötöt',
        'henkinen-valmius': 'Henkinen valmius'
    };
    return weaknesses[weakness] || weakness;
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

function getFrequencyText(frequency) {
    const frequencies = {
        'kerran-viikossa': 'Kerran viikossa',
        '2-kertaa-viikossa': '2 kertaa viikossa',
        '3-kertaa-viikossa': '3+ kertaa viikossa',
        'tarpeen-mukaan': 'Tarpeen mukaan'
    };
    return frequencies[frequency] || frequency;
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

// Action functions
function contactGoalkeeper() {
    alert(`Yhteystiedot:\nSähköposti: ${currentGoalkeeper.email}\nPuhelin: ${currentGoalkeeper.phone}\n\nTämä toiminto laajennettaisiin oikeassa sovelluksessa viestintäjärjestelmäksi.`);
}