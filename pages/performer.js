// ============================================================
//  PERFORMER DASHBOARD - Shows all events with clickable cards
// ============================================================

function renderPerformer() {
    if (!currentUser || currentUser.role !== 'performer') {
        return `<div class="card" style="text-align: center; padding: 48px;"><i class="fas fa-lock"></i> Performer access only</div>`;
    }
    const stats = getPerformerStats(currentUser.performerId);

    return `
        <h2><i class="fas fa-microphone-alt"></i> Performer Dashboard</h2>
        <div style="margin-bottom: 24px;">
            <div class="card" style="padding: 24px; background: linear-gradient(135deg, var(--accent-subtle), transparent);">
                <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
                    <span style="font-size: 48px;">${currentUser.avatar || '🎤'}</span>
                    <div>
                        <h1 style="font-size: 28px;">${currentUser.name}</h1>
                        <p style="color: var(--text-secondary);">Welcome to your artist dashboard - Click on any event to see detailed analytics</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="performer-stats">
            <div class="performer-card">
                <div class="performer-card-value">${stats.events.length}</div>
                <div class="performer-card-label">Your Events</div>
            </div>
            <div class="performer-card">
                <div class="performer-card-value">${stats.totalSold.toLocaleString()}</div>
                <div class="performer-card-label">Total Tickets Sold</div>
            </div>
            <div class="performer-card">
                <div class="performer-card-value">${stats.remainingSeats.toLocaleString()}</div>
                <div class="performer-card-label">Remaining Seats</div>
            </div>
            <div class="performer-card">
                <div class="performer-card-value">${stats.totalRevenue.toLocaleString()} RWF</div>
                <div class="performer-card-label">Estimated Total Earnings*</div>
            </div>
        </div>

        <div class="card" style="margin-bottom: 24px; padding: 20px;">
            <h3><i class="fas fa-chart-pie"></i> Ticket Sales Breakdown (All Events)</h3>
            <div class="revenue-breakdown">
                <div class="revenue-item">
                    <span class="revenue-label"><span class="badge badge-info">Regular</span> Tickets</span>
                    <span class="revenue-amount">${stats.regularSold.toLocaleString()} sold · ${stats.regularRevenue.toLocaleString()} RWF</span>
                </div>
                <div class="revenue-item">
                    <span class="revenue-label"><span class="badge badge-warning">VIP</span> Tickets</span>
                    <span class="revenue-amount">${stats.vipSold.toLocaleString()} sold · ${stats.vipRevenue.toLocaleString()} RWF</span>
                </div>
                <div class="revenue-item">
                    <span class="revenue-label"><span class="badge badge-danger">VVIP</span> Tickets</span>
                    <span class="revenue-amount">${stats.vvipSold.toLocaleString()} sold · ${stats.vvipRevenue.toLocaleString()} RWF</span>
                </div>
                <div class="revenue-item" style="border-top: 1px solid var(--border); margin-top: 8px; padding-top: 8px;">
                    <span class="revenue-label"><strong>TOTAL</strong></span>
                    <span class="revenue-amount"><strong>${stats.totalSold.toLocaleString()} tickets · ${stats.totalRevenue.toLocaleString()} RWF</strong></span>
                </div>
            </div>
        </div>

        <h3><i class="fas fa-calendar-alt"></i> Your Events (Click on any event for details)</h3>
        <div class="events-grid">
            ${stats.events.map(event => renderPerformerEventCard(event)).join('')}
        </div>
        ${stats.events.length === 0 ? '<div class="card" style="text-align: center; padding: 48px;"><i class="fas fa-calendar-times"></i><p>No events assigned to you yet.</p><p>Contact admin to add your events.</p></div>' : ''}
        
        <div class="alert alert-info" style="margin-top: 24px;">
            <i class="fas fa-info-circle"></i> <strong>Tip:</strong> Click on any event card above to see detailed analytics including attendee lists, revenue breakdown, and gate scan history.
        </div>
    `;
}

function renderPerformerEventCard(event) {
    const totalSold = (event.sold?.regular || 0) + (event.sold?.vip || 0) + (event.sold?.vvip || 0);
    const available = event.totalCapacity - totalSold;
    const statusClass = available < 20 ? 'badge-danger' : (available < 50 ? 'badge-warning' : 'badge-success');
    const statusText = available < 20 ? 'Almost Sold Out' : (available < 50 ? 'Few Left' : 'Available');
    const occupancyRate = Math.round((totalSold / event.totalCapacity) * 100);

    // Calculate revenue for this event
    const regularRevenue = (event.sold?.regular || 0) * event.basePrice;
    const vipRevenue = (event.sold?.vip || 0) * (event.basePrice * 2.5);
    const vvipRevenue = (event.sold?.vvip || 0) * (event.basePrice * 5);
    const totalRevenue = regularRevenue + vipRevenue + vvipRevenue;

    return `
        <div class="event-card performer-event-card" onclick="window.location.hash='event-detail&id=${event.id}'; render();" style="cursor: pointer;">
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
                <div style="margin-top: 12px;">
                    <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                        <span>Sold: ${totalSold.toLocaleString()}/${event.totalCapacity.toLocaleString()}</span>
                        <span>${occupancyRate}%</span>
                    </div>
                    <div style="height: 4px; background: var(--bg-elevated); border-radius: 2px;">
                        <div style="width: ${occupancyRate}%; height: 4px; background: var(--accent); border-radius: 2px;"></div>
                    </div>
                </div>
                <div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid var(--border); display: flex; justify-content: space-between;">
                    <span style="font-size: 11px; color: var(--text-muted);"><i class="fas fa-ticket-alt"></i> ${totalSold.toLocaleString()} tickets</span>
                    <span style="font-size: 12px; font-weight: 700; color: var(--accent);">${totalRevenue.toLocaleString()} RWF</span>
                </div>
            </div>
        </div>
    `;
}