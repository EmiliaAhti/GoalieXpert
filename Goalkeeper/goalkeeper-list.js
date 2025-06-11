// Goalkeepers List JavaScript

// Tallennetut maalivahdit (tyhjä aluksi - täyttyy rekisteröintien myötä)
// HUOM: Oikeassa sovelluksessa localStorage korvataan tietokannalla
let goalkeepers = [];

// Simuloidaan localStorage olemassaolo demoa varten
try {
    goalkeepers = JSON.parse(localStorage.getItem('goalkeepers')) || [];
} catch (e) {
    goalkeepers = [];
}

let filteredGoalkeepers = [...goalkeepers];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    displayGoalkeepers(goalkeepers);
    setupFilters();
});

// Display goalkeepers
function displayGoalkeepers(goalkeepersToShow) {
    const grid = document.getElementById('goalkeepersGrid');
    const noResults = document.getElementById('noResults');
    
    if (goalkeepersToShow.length === 0) {
        grid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    grid.style.display = 'grid';
    noResults.style.display = 'none';
    
    grid.innerHTML = goalkeepersToShow.map(goalkeeper => createGoalkeeperCard(goalkeeper)).join('');
}

// Create goalkeeper card HTML
function createGoalkeeperCard(goalkeeper) {
    const initials = goalkeeper.firstName.charAt(0) + goalkeeper.lastName.charAt(0);
    const experienceText = getExperienceText(goalkeeper.experience);
    const levelText = getLevelText(goalkeeper.playingLevel);
    const age = calculateAge(new Date(goalkeeper.birthDate));
    
    return `
        <div class="goalkeeper-card" data-goalkeeper-id="${goalkeeper.id}">
            <div class="goalkeeper-header">
                <div class="goalkeeper-avatar">${initials}</div>
                <div class="goalkeeper-name">${goalkeeper.firstName} ${goalkeeper.lastName}</div>
                <div class="goalkeeper-location">${goalkeeper.city}</div>
                <div class="goalkeeper-age">${age} vuotta</div>
            </div>
            <div class="goalkeeper-content">
                <div class="goalkeeper-info">
                    <div class="info-item">
                        <div class="info-label">Kokemus</div>
                        <div class="info-value">${experienceText}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Pelitaso</div>
                        <div class="info-value">${levelText}</div>
                    </div>
                </div>
                
                ${goalkeeper.currentTeam ? `
                <div class="goalkeeper-team">
                    <h4>Nykyinen joukkue</h4>
                    <div class="team-name">${goalkeeper.currentTeam}</div>
                </div>
                ` : ''}
                
                <div class="goalkeeper-weaknesses">
                    <h4>Kehityskohteet</h4>
                    <div class="weaknesses-tags">
                        ${goalkeeper.weaknesses.map(weakness => 
                            `<span class="weakness-tag">${getWeaknessText(weakness)}</span>`
                        ).join('')}
                    </div>
                </div>
                
                ${goalkeeper.goals ? `
                <div class="goalkeeper-goals">
                    <h4>Tavoitteet</h4>
                    <p class="goals-text">${goalkeeper.goals}</p>
                </div>
                ` : ''}
                
                <div class="goalkeeper-availability">
                    <h4>Toivottu valmennusaika</h4>
                    <div class="availability-info">
                        <div><strong>Päivät:</strong> ${goalkeeper.preferredDays.map(day => getDayText(day)).join(', ')}</div>
                        <div><strong>Aika:</strong> ${getTimeText(goalkeeper.preferredTime)}</div>
                        <div><strong>Tiheys:</strong> ${getFrequencyText(goalkeeper.trainingFrequency)}</div>
                        <div><strong>Matka:</strong> ${getDistanceText(goalkeeper.maxDistance)}</div>
                    </div>
                </div>
                
                <div class="goalkeeper-actions">
                    <button class="btn btn-contact" onclick="contactGoalkeeper(${goalkeeper.id})">Ota yhteyttä</button>
                    <button class="btn btn-profile" onclick="viewGoalkeeperProfile(${goalkeeper.id})">Näytä profiili</button>
                </div>
            </div>
        </div>
    `;
}

// Helper functions for text conversion
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
        'alle-1v': 'Alle 1v',
        '1-3v': '1-3v',
        '3-5v': '3-5v', 
        '5-10v': '5-10v',
        'yli-10v': 'Yli 10v'
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
        'aamur': 'Aamu',
        'paiva': 'Päivä',
        'alkuilta': 'Alkuilta',
        'ilta': 'Ilta'
    };
    return times[time] || time || 'Ei määritelty';
}

function getFrequencyText(frequency) {
    const frequencies = {
        'kerran-viikossa': '1x/vko',
        '2-kertaa-viikossa': '2x/vko',
        '3-kertaa-viikossa': '3+x/vko',
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

// Setup filters
function setupFilters() {
    const cityFilter = document.getElementById('cityFilter');
    const experienceFilter = document.getElementById('experienceFilter');
    const levelFilter = document.getElementById('levelFilter');
    const ageFilter = document.getElementById('ageFilter');
    const clearButton = document.getElementById('clearFilters');
    
    // Add event listeners
    [cityFilter, experienceFilter, levelFilter, ageFilter].forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });
    
    clearButton.addEventListener('click', clearFilters);
    
    // Populate city options from goalkeepers
    populateCityOptions();
}

function populateCityOptions() {
    const cityFilter = document.getElementById('cityFilter');
    const cities = [...new Set(goalkeepers.map(gk => gk.city))].sort();
    
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
    const levelFilter = document.getElementById('levelFilter').value;
    const ageFilter = document.getElementById('ageFilter').value;
    
    filteredGoalkeepers = goalkeepers.filter(goalkeeper => {
        // City filter
        if (cityFilter && goalkeeper.city.toLowerCase() !== cityFilter) {
            return false;
        }
        
        // Experience filter
        if (experienceFilter && goalkeeper.experience !== experienceFilter) {
            return false;
        }
        
        // Level filter
        if (levelFilter && goalkeeper.playingLevel !== levelFilter) {
            return false;
        }
        
        // Age filter
        if (ageFilter) {
            const age = calculateAge(new Date(goalkeeper.birthDate));
            switch(ageFilter) {
                case 'alle-12':
                    if (age >= 12) return false;
                    break;
                case '12-16':
                    if (age < 12 || age > 16) return false;
                    break;
                case '17-20':
                    if (age < 17 || age > 20) return false;
                    break;
                case 'yli-20':
                    if (age <= 20) return false;
                    break;
            }
        }
        
        return true;
    });
    
    displayGoalkeepers(filteredGoalkeepers);
}

// Clear filters
function clearFilters() {
    document.getElementById('cityFilter').value = '';
    document.getElementById('experienceFilter').value = '';
    document.getElementById('levelFilter').value = '';
    document.getElementById('ageFilter').value = '';
    
    filteredGoalkeepers = [...goalkeepers];
    displayGoalkeepers(filteredGoalkeepers);
}

// Goalkeeper actions
function contactGoalkeeper(goalkeeperId) {
    const goalkeeper = goalkeepers.find(gk => gk.id === goalkeeperId);
    if (goalkeeper) {
        alert(`Yhteystiedot:\nNimi: ${goalkeeper.firstName} ${goalkeeper.lastName}\nSähköposti: ${goalkeeper.email}\nPuhelin: ${goalkeeper.phone}\n\nTämä toiminto laajennettaisiin oikeassa sovelluksessa viestintäjärjestelmäksi.`);
    }
}

function viewGoalkeeperProfile(goalkeeperId) {
    // Redirect to goalkeeper profile page
    window.location.href = `goalkeeper-profile.html?id=${goalkeeperId}`;
}

// Refresh goalkeepers data (call when new goalkeeper registers)
function refreshGoalkeepers() {
    goalkeepers = JSON.parse(localStorage.getItem('goalkeepers')) || [];
    filteredGoalkeepers = [...goalkeepers];
    displayGoalkeepers(goalkeepers);
    populateCityOptions();
}