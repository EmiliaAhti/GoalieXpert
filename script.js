// Main navigation functions
function openOnlineCoaching() {
    alert('Verkkovalmennukset-osio tulossa pian! Tässä olisi lista saatavilla olevista verkkokursseista.');
}

function openGoalieConnect() {
    window.location.href = 'coaches-list.html';
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
        window.location.href = 'goalkeeper-register.html';
    } else if (userType === 'coach') {
        window.location.href = 'coach-register.html';
    }
    closeModal();
}