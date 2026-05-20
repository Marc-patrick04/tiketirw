// ============================================================
//  AUTHENTICATION FUNCTIONS
// ============================================================

let currentUser = null;

function login(identifier, password) {
    const user = window.DB.users.find(u => 
        (u.phone === identifier || u.email === identifier) && u.password === password
    );
    if (user) {
        currentUser = { ...user };
        localStorage.setItem('tiketirw_session', JSON.stringify(currentUser));
        return true;
    }
    return false;
}

function logout() {
    currentUser = null;
    localStorage.removeItem('tiketirw_session');
    if (typeof render === 'function') render();
}

function getSession() {
    const session = localStorage.getItem('tiketirw_session');
    if (session && !currentUser) {
        currentUser = JSON.parse(session);
    }
    return currentUser;
}

function isLoggedIn() {
    return !!getSession();
}

function getCurrentUser() {
    return currentUser;
}

function getUserRole() {
    return currentUser?.role || 'guest';
}

function canBuyTickets() {
    return currentUser?.role === 'customer';
}

function canAccessAdmin() {
    return currentUser?.role === 'admin';
}

function canAccessWorker() {
    return currentUser?.role === 'worker' || currentUser?.role === 'admin';
}

function canAccessPerformer() {
    return currentUser?.role === 'performer';
}

function getRoleColor(role) {
    const colors = {
        customer: 'green',
        admin: 'purple',
        worker: 'blue',
        performer: 'orange'
    };
    return colors[role] || 'gray';
}

function getRoleIcon(role) {
    const icons = {
        customer: 'fa-user',
        admin: 'fa-crown',
        worker: 'fa-shield-alt',
        performer: 'fa-microphone-alt'
    };
    return icons[role] || 'fa-user';
}