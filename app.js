// ============================================================
//  MAIN APPLICATION CONTROLLER
//  Loads all modules and handles page routing
// ============================================================

// Page registry
const pages = {
    home: renderHome,
    events: renderEvents,
    wallet: renderWallet,
    transfer: renderTransfer,
    group: renderGroup,
    ussd: renderUSSD,
    gate: renderGate,
    admin: renderAdmin,
    workers: renderWorkers,
    performer: renderPerformer,
    login: renderLogin,
    // In the pages object, add:
    eventDetail: renderEventDetail
};

// Main render function
// Replace the render function in app.js with this:

function render() {
    getSession();
    renderSidebar();

    let hash = window.location.hash.slice(1) || 'home';
    let pageFn = pages.home;
    let eventId = null;
    
    // Handle parameterized routes like event-detail&id=ev1
    if (hash.includes('&')) {
        const [pageName, param] = hash.split('&');
        if (pageName === 'event-detail' && param.startsWith('id=')) {
            eventId = param.split('=')[1];
            pageFn = () => renderEventDetail(eventId);
        } else {
            pageFn = pages[pageName] || pages.home;
        }
    } else {
        pageFn = pages[hash] || pages.home;
    }
    
    if (typeof pageFn === 'function') {
        document.getElementById('mainContent').innerHTML = pageFn();
    } else {
        document.getElementById('mainContent').innerHTML = pages.home();
    }

    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(el => {
        const pageName = hash.split('&')[0];
        if (el.dataset.page === pageName) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });
}

// Initialize app
function initApp() {
    initDB();
    getSession();
    render();
}

// Start the app
initApp();

// Handle hash changes
window.addEventListener('hashchange', () => render());

// Make functions globally available
window.render = render;
window.filterEvents = filterEvents;
window.resetFilters = resetFilters;
window.selectEvent = selectEvent;
window.selectTier = selectTier;
window.buyTickets = buyTickets;
window.doTransfer = doTransfer;
window.doGroupBooking = doGroupBooking;
window.updateGroupAttendees = updateGroupAttendees;
window.doScan = doScan;
window.doLogin = doLogin;
window.showQR = showQR;
window.simulateUSSD = simulateUSSD;
window.closeModal = closeModal;
window.logout = logout;
window.addNewEvent = addNewEvent;
window.addWorkerAction = addWorkerAction;
window.removeWorkerAction = removeWorkerAction;