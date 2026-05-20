// ============================================================
//  GROUP BOOKING PAGE (Customer only)
// ============================================================

function renderGroup() {
    if (!currentUser) return renderLogin();
    if (currentUser.role !== 'customer') {
        return `<div class="card" style="text-align: center; padding: 48px;"><i class="fas fa-ban"></i><p>Only customers can make group bookings.</p></div>`;
    }
    
    return `
        <div style="max-width: 500px; margin: 0 auto;">
            <h2><i class="fas fa-users"></i> Group Booking (2-10 tickets)</h2>
            <div class="card" style="padding: 24px;">
                <div class="alert alert-info" style="margin-bottom: 16px;">
                    <i class="fas fa-info-circle"></i> Each attendee must have a UNIQUE name. No duplicate names allowed.
                </div>
                <label class="label">Select Event</label>
                <select id="groupEvent" class="input" style="margin-bottom: 16px;" onchange="updateGroupAttendees()">
                    <option value="">-- Select event --</option>
                    ${window.DB.events.map(e => `<option value="${e.id}">${e.name} - from ${e.basePrice} RWF</option>`).join('')}
                </select>
                <label class="label">Ticket Tier</label>
                <select id="groupTier" class="input" style="margin-bottom: 16px;">
                    <option value="regular">Regular</option>
                    <option value="vip">VIP</option>
                    <option value="vvip">VVIP</option>
                </select>
                <label class="label">Number of Tickets (2-10)</label>
                <input id="groupQty" type="number" min="2" max="10" class="input" style="margin-bottom: 16px;" onchange="updateGroupAttendees()">
                <div id="attendeeFields"></div>
                <button class="btn btn-primary" style="width: 100%; margin-top: 16px;" onclick="doGroupBooking()">
                    <i class="fas fa-shopping-cart"></i> Purchase Group Tickets
                </button>
                <div id="groupResult" style="margin-top: 16px;"></div>
            </div>
        </div>
    `;
}

function updateGroupAttendees() {
    const qty = parseInt(document.getElementById('groupQty')?.value);
    if (qty && qty >= 2 && qty <= 10) {
        let html = '<label class="label">Attendee Names (MUST be unique)</label>';
        for (let i = 1; i <= qty; i++) {
            html += `<input id="attendee_${i}" class="input" placeholder="Attendee ${i} full name" style="margin-bottom: 8px;">`;
        }
        html += '<p style="font-size: 11px; color: var(--text-muted); margin-top: 4px;"><i class="fas fa-exclamation-triangle"></i> Duplicate names will be rejected</p>';
        document.getElementById('attendeeFields').innerHTML = html;
    } else {
        document.getElementById('attendeeFields').innerHTML = '<p style="color: var(--red); font-size: 12px;">Please enter a quantity between 2 and 10</p>';
    }
}

function doGroupBooking() {
    const eventId = document.getElementById('groupEvent')?.value;
    const tier = document.getElementById('groupTier')?.value;
    const qty = parseInt(document.getElementById('groupQty')?.value);
    if (!eventId || !qty) {
        alert('Select event and quantity');
        return;
    }
    const names = [];
    for (let i = 1; i <= qty; i++) {
        const name = document.getElementById(`attendee_${i}`)?.value;
        if (!name || name.trim() === '') {
            alert(`Please enter name for attendee ${i}`);
            return;
        }
        names.push(name.trim());
    }
    const result = purchaseTicket(eventId, tier, qty, names);
    if (result.success) {
        let message = `✓ Group booking successful! ${qty} tickets added.\n\n`;
        if (result.ussdCodes && result.ussdCodes.length > 0) {
            message += `📱 USSD Entry Codes (valid 5 minutes):\n`;
            result.ussdCodes.forEach((u, i) => {
                message += `${names[i]}: *724*${u.code}#\n`;
            });
        }
        alert(message);
        setTimeout(() => { render(); window.location.hash = 'wallet'; }, 1500);
    } else {
        document.getElementById('groupResult').innerHTML = `<div class="alert alert-error">✗ ${result.msg}</div>`;
    }
}