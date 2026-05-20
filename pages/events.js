// ============================================================
//  EVENTS PAGE
// ============================================================

function renderEvents() {
    return `
        <div class="filter-bar">
            <div class="filter-group">
                <label class="label"><i class="fas fa-search"></i> Search</label>
                <input type="text" id="searchInput" class="input" placeholder="Event name..." onkeyup="filterEvents()">
            </div>
            <div class="filter-group">
                <label class="label"><i class="fas fa-map-marker-alt"></i> Location</label>
                <select id="locationFilter" class="input" onchange="filterEvents()">
                    <option value="">All Locations</option>
                    ${window.DB.locations.map(l => `<option value="${l.id}">${l.name}</option>`).join('')}
                </select>
            </div>
            <div class="filter-group">
                <label class="label">&nbsp;</label>
                <button class="btn btn-outline btn-sm" onclick="resetFilters()" style="width: 100%;">
                    <i class="fas fa-undo"></i> Reset
                </button>
            </div>
        </div>
        <div id="eventsContainer">
            <div class="events-grid">
                ${window.DB.events.map(e => renderEventCard(e)).join('')}
            </div>
        </div>
    `;
}

function filterEvents() {
    const search = document.getElementById('searchInput')?.value || '';
    const locationId = document.getElementById('locationFilter')?.value || '';
    let filtered = window.DB.events.filter(e => 
        (!search || e.name.toLowerCase().includes(search.toLowerCase())) && 
        (!locationId || e.locationId === locationId)
    );
    document.getElementById('eventsContainer').innerHTML = `
        <div style="margin-bottom: 16px;"><span class="badge badge-info"><i class="fas fa-list"></i> ${filtered.length} events found</span></div>
        <div class="events-grid">${filtered.map(e => renderEventCard(e)).join('')}</div>
        ${filtered.length === 0 ? '<div class="card" style="text-align: center; padding: 48px;"><i class="fas fa-face-sad-tear" style="font-size: 48px;"></i><p>No events match.</p></div>' : ''}
    `;
}

function resetFilters() {
    const search = document.getElementById('searchInput');
    const location = document.getElementById('locationFilter');
    if (search) search.value = '';
    if (location) location.value = '';
    filterEvents();
}