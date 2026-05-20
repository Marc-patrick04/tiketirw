// ============================================================
//  EVENT DETAIL PAGE - For Performers to see event analytics
//  Simplified - No Attendee List, Just Numbers
// ============================================================

function renderEventDetail(eventId) {
    const event = window.DB.events.find(e => e.id === eventId);
    if (!event) return `<div class="card">Event not found</div>`;
    
    // Check if current user is the performer of this event
    if (currentUser?.role === 'performer' && currentUser.performerId !== event.performerId) {
        return `<div class="card"><i class="fas fa-lock"></i> You don't have access to this event.</div>`;
    }
    
    // Get ticket counts from event.sold
    const regularSold = event.sold?.regular || 0;
    const vipSold = event.sold?.vip || 0;
    const vvipSold = event.sold?.vvip || 0;
    
    const regularRevenue = regularSold * event.basePrice;
    const vipRevenue = vipSold * (event.basePrice * 2.5);
    const vvipRevenue = vvipSold * (event.basePrice * 5);
    const totalRevenue = regularRevenue + vipRevenue + vvipRevenue;
    
    const totalCapacity = event.totalCapacity;
    const totalSold = regularSold + vipSold + vvipSold;
    const remainingSeats = totalCapacity - totalSold;
    const occupancyRate = totalCapacity > 0 ? Math.round((totalSold / totalCapacity) * 100) : 0;
    
    // Count used tickets (scanned at gate)
    const eventTickets = window.DB.tickets.filter(t => t.eventId === event.id);
    const scannedCount = eventTickets.filter(t => t.status === 'used').length;
    
    // Status badge
    const statusClass = remainingSeats < 20 ? 'badge-danger' : (remainingSeats < 50 ? 'badge-warning' : 'badge-success');
    const statusText = remainingSeats < 20 ? 'Almost Sold Out' : (remainingSeats < 50 ? 'Few Left' : 'Available');
    
    // Get performer name
    const performerName = event.performerName || 'No performer assigned';
    const locationName = getLocationName(event.locationId);
    
    // Get recent scans for this event (last 5)
    const eventScans = (window.DB.scans?.filter(s => s.eventName === event.name) || []).slice(0, 5);
    
    return `
        <div style="margin-bottom: 24px;">
            <button class="btn btn-outline btn-sm" onclick="window.location.hash='performer'; render();">
                <i class="fas fa-arrow-left"></i> Back to Dashboard
            </button>
        </div>
        
        <div class="event-detail-container">
            <!-- Event Header -->
            <div class="card" style="padding: 0; overflow: hidden; margin-bottom: 24px;">
                <img src="${event.image}" style="width: 100%; height: 200px; object-fit: cover;">
                <div style="padding: 24px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
                        <div>
                            <div class="hero-badge" style="margin-bottom: 12px;">
                                <i class="fas fa-tag"></i> ${event.category}
                                <span class="badge ${statusClass}" style="margin-left: 8px;">${statusText}</span>
                            </div>
                            <h1 style="font-size: 32px; margin-bottom: 8px;">${event.name}</h1>
                            <div class="event-meta" style="margin-bottom: 16px;">
                                <span><i class="fas fa-map-marker-alt"></i> ${locationName}</span>
                                <span><i class="far fa-calendar"></i> ${event.date} at ${event.time}</span>
                                <span><i class="fas fa-user"></i> ${performerName}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Main Stats Grid -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${totalSold.toLocaleString()}/${totalCapacity.toLocaleString()}</div>
                    <div class="stat-label">Tickets Sold</div>
                    <div style="margin-top: 8px; height: 4px; background: var(--bg-elevated); border-radius: 2px;">
                        <div style="width: ${occupancyRate}%; height: 4px; background: var(--accent); border-radius: 2px;"></div>
                    </div>
                    <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">${occupancyRate}% Occupied</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${remainingSeats.toLocaleString()}</div>
                    <div class="stat-label">Remaining Seats</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${scannedCount.toLocaleString()}</div>
                    <div class="stat-label">Entries Scanned</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${totalRevenue.toLocaleString()} RWF</div>
                    <div class="stat-label">Total Revenue</div>
                </div>
            </div>
            
            <!-- Revenue Breakdown by Tier -->
            <div class="card" style="margin-bottom: 24px; padding: 24px;">
                <h3><i class="fas fa-chart-line"></i> Revenue Breakdown by Ticket Tier</h3>
                <div class="revenue-breakdown" style="margin-top: 16px;">
                    <div class="revenue-item">
                        <span class="revenue-label">
                            <span class="badge badge-info">Regular</span> 
                            (${event.basePrice.toLocaleString()} RWF)
                        </span>
                        <span class="revenue-amount">${regularSold.toLocaleString()} sold · ${regularRevenue.toLocaleString()} RWF</span>
                    </div>
                    <div class="revenue-item">
                        <span class="revenue-label">
                            <span class="badge badge-warning">VIP</span> 
                            (${(event.basePrice * 2.5).toLocaleString()} RWF)
                        </span>
                        <span class="revenue-amount">${vipSold.toLocaleString()} sold · ${vipRevenue.toLocaleString()} RWF</span>
                    </div>
                    <div class="revenue-item">
                        <span class="revenue-label">
                            <span class="badge badge-danger">VVIP</span> 
                            (${(event.basePrice * 5).toLocaleString()} RWF)
                        </span>
                        <span class="revenue-amount">${vvipSold.toLocaleString()} sold · ${vvipRevenue.toLocaleString()} RWF</span>
                    </div>
                    <div class="revenue-item" style="border-top: 2px solid var(--border); margin-top: 8px; padding-top: 12px;">
                        <span class="revenue-label"><strong>TOTAL REVENUE</strong></span>
                        <span class="revenue-amount"><strong>${totalRevenue.toLocaleString()} RWF</strong></span>
                    </div>
                </div>
                <p style="font-size: 11px; color: var(--text-muted); margin-top: 12px;">
                    <i class="fas fa-info-circle"></i> *Revenue estimates based on ticket sales. Actual payouts processed after event.
                </p>
            </div>
            
            <!-- Ticket Distribution Chart -->
            <div class="card" style="margin-bottom: 24px; padding: 24px;">
                <h3><i class="fas fa-chart-pie"></i> Ticket Distribution</h3>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 16px;">
                    <div style="text-align: center; padding: 16px; background: var(--bg-elevated); border-radius: var(--radius-md);">
                        <div style="font-size: 28px; font-weight: 800; color: var(--blue);">${regularSold.toLocaleString()}</div>
                        <div style="font-size: 11px; color: var(--text-muted);">Regular Tickets</div>
                        <div style="margin-top: 8px; height: 4px; background: var(--bg-card); border-radius: 2px;">
                            <div style="width: ${totalSold ? (regularSold/totalSold)*100 : 0}%; height: 4px; background: var(--blue); border-radius: 2px;"></div>
                        </div>
                        <div style="font-size: 11px; margin-top: 4px;">${totalSold ? Math.round((regularSold/totalSold)*100) : 0}% of sales</div>
                    </div>
                    <div style="text-align: center; padding: 16px; background: var(--bg-elevated); border-radius: var(--radius-md);">
                        <div style="font-size: 28px; font-weight: 800; color: var(--orange);">${vipSold.toLocaleString()}</div>
                        <div style="font-size: 11px; color: var(--text-muted);">VIP Tickets</div>
                        <div style="margin-top: 8px; height: 4px; background: var(--bg-card); border-radius: 2px;">
                            <div style="width: ${totalSold ? (vipSold/totalSold)*100 : 0}%; height: 4px; background: var(--orange); border-radius: 2px;"></div>
                        </div>
                        <div style="font-size: 11px; margin-top: 4px;">${totalSold ? Math.round((vipSold/totalSold)*100) : 0}% of sales</div>
                    </div>
                    <div style="text-align: center; padding: 16px; background: var(--bg-elevated); border-radius: var(--radius-md);">
                        <div style="font-size: 28px; font-weight: 800; color: var(--red);">${vvipSold.toLocaleString()}</div>
                        <div style="font-size: 11px; color: var(--text-muted);">VVIP Tickets</div>
                        <div style="margin-top: 8px; height: 4px; background: var(--bg-card); border-radius: 2px;">
                            <div style="width: ${totalSold ? (vvipSold/totalSold)*100 : 0}%; height: 4px; background: var(--red); border-radius: 2px;"></div>
                        </div>
                        <div style="font-size: 11px; margin-top: 4px;">${totalSold ? Math.round((vvipSold/totalSold)*100) : 0}% of sales</div>
                    </div>
                </div>
            </div>
            
            <!-- Recent Gate Scans -->
            <div class="card" style="padding: 24px;">
                <h3><i class="fas fa-qrcode"></i> Recent Gate Activity</h3>
                <div style="margin-top: 16px;">
                    ${eventScans.length > 0 ? eventScans.map(scan => `
                        <div style="padding: 10px 0; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <span class="badge badge-success"><i class="fas fa-check"></i> Scanned</span>
                                <strong> ${scan.attendee}</strong>
                                <span style="font-size: 11px; color: var(--text-muted);">(${scan.method || 'QR'})</span>
                            </div>
                            <span style="font-size: 11px; color: var(--text-muted);">${scan.timestamp}</span>
                        </div>
                    `).join('') : '<p style="text-align: center; padding: 20px; color: var(--text-muted);">No scans recorded yet.</p>'}
                </div>
                ${scannedCount > 5 ? `<div style="margin-top: 12px; text-align: center;"><span class="badge badge-info">+${scannedCount - 5} more entries</span></div>` : ''}
            </div>
        </div>
    `;
}

function editEvent(eventId) {
    const event = window.DB.events.find(e => e.id === eventId);
    if (!event) return;
    
    const newName = prompt('Event Name:', event.name);
    if (newName && newName !== event.name) {
        event.name = newName;
    }
    
    const newDate = prompt('Event Date (YYYY-MM-DD):', event.date);
    if (newDate && newDate !== event.date) {
        event.date = newDate;
    }
    
    const newTime = prompt('Event Time (HH:MM):', event.time);
    if (newTime && newTime !== event.time) {
        event.time = newTime;
    }
    
    const newPrice = prompt('Base Price (RWF):', event.basePrice);
    if (newPrice && !isNaN(newPrice) && parseInt(newPrice) !== event.basePrice) {
        event.basePrice = parseInt(newPrice);
    }
    
    saveDB();
    alert('Event updated successfully!');
    render();
    window.location.hash = `event-detail&id=${eventId}`;
}