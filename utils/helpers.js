// ============================================================
//  HELPER FUNCTIONS
// ============================================================

function getLocationName(locationId) {
    if (!window.DB) return "Venue";
    const location = window.DB.locations.find(l => l.id === locationId);
    return location?.name || "Venue";
}

function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatPrice(price) {
    return price.toLocaleString() + ' RWF';
}

function showToast(message, type = 'success') {
    // Simple alert for now - can be enhanced with toast notification
    alert(message);
}

function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

function generateId(prefix = '') {
    return prefix + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
}