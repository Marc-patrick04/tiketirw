// ============================================================
//  REUSABLE CARD COMPONENTS
// ============================================================

function renderEventCard(event) {
    const totalSold = (event.sold?.regular || 0) + (event.sold?.vip || 0) + (event.sold?.vvip || 0);
    const available = event.totalCapacity - totalSold;
    const statusClass = available < 20 ? 'badge-danger' : (available < 50 ? 'badge-warning' : 'badge-success');
    const statusText = available < 20 ? 'Almost Sold Out' : (available < 50 ? 'Few Left' : 'Available');

    return `
        <div class="event-card" onclick="selectEvent('${event.id}')">
            <div class="event-image" style="background-image: url('${event.image}'); background-size: cover; background-position: center;">
                <span class="event-category">${event.category}</span>
            </div>
            <div class="event-info">
                <div class="event-title">${event.name}</div>
                <div class="event-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${getLocationName(event.locationId)}</span>
                    <span><i class="far fa-calendar"></i> ${event.date}</span>
                </div>
                <div class="event-footer">
                    <div>
                        <span class="event-price">${event.basePrice.toLocaleString()} RWF</span>
                        <span style="font-size: 10px; color: var(--text-muted);"> + tiers</span>
                    </div>
                    <span class="badge ${statusClass}"><i class="fas fa-tag"></i> ${statusText}</span>
                </div>
            </div>
        </div>
    `;
}

function renderStatCard(value, label, icon) {
    return `
        <div class="stat-card">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                <i class="fas ${icon}" style="font-size: 24px; color: var(--accent);"></i>
                <div class="stat-value">${value}</div>
            </div>
            <div class="stat-label">${label}</div>
        </div>
    `;
}

function renderTicketItem(ticket) {
    const isActive = ticket.status === 'active';
    const tierColor = ticket.tier === 'regular' ? 'info' : (ticket.tier === 'vip' ? 'warning' : 'danger');
    
    return `
        <div class="ticket-item">
            <div style="flex: 1;">
                <div style="font-weight: 700;">${ticket.eventName}</div>
                <div style="font-size: 12px; color: var(--text-secondary);">
                    <i class="fas fa-map-marker-alt"></i> ${ticket.location} | ${ticket.eventDate}
                </div>
                <div style="font-size: 12px; margin-top: 4px;">
                    <span class="badge badge-${tierColor}">${ticket.tierName}</span>
                    <span> Attendee: ${ticket.attendeeName}</span>
                    <span class="badge ${isActive ? 'badge-success' : 'badge-danger'}">${ticket.status}</span>
                </div>
            </div>
            ${isActive ? `
                <div>
                    <button class="btn btn-outline btn-sm" onclick="showQR('${ticket.id}', '${ticket.eventName}', '${ticket.attendeeName}')">
                        <i class="fas fa-qrcode"></i> Show QR
                    </button>
                </div>
            ` : ''}
        </div>
    `;
}