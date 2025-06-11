// Main navigation functions
function openOnlineCoaching() {
    alert('Verkkovalmennukset-osio tulossa pian! Tässä olisi lista saatavilla olevista verkkokursseista.');
}

function openGoalieConnect() {
    alert('GoalieConnect-osio aukeaa! Tässä voitaisiin navigoida valmentaja- ja maalivahtiprofiilit-sivulle.');
}

// Modal functions
function showLogin() {
    document.getElementById('loginModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function loginAs(userType) {
    if (userType === 'goalkeeper') {
        alert('Maalivahti-kirjautuminen: Tässä avautuisi maalivahtien profiilinhallinta ja valmennusvaraukset');
    } else if (userType === 'coach') {
        alert('Valmentaja-kirjautuminen: Tässä avautuisi valmentajien profiilinhallinta ja aikataulujen hallinta');
    }
    closeModal();
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('loginModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.getAttribute('href') !== '#login') {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Add some interactive animations
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Additional utility functions can be added here
// For example, form validation, API calls, etc.

// Example function for future use - form validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = 'red';
            isValid = false;
        } else {
            input.style.borderColor = '';
        }
    });
    
    return isValid;
}

// Example function for future use - API calls
async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(endpoint, options);
        return await response.json();
    } catch (error) {
        console.error('API call error:', error);
        return null;
    }
}