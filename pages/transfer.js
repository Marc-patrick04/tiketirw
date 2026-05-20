// ============================================================
//  TRANSFER PAGE (Customer only)
// ============================================================

function renderTransfer() {
    if (!currentUser) return renderLogin();
    if (currentUser.role !== 'customer') {
        return `<div class="card" style="text-align: center; padding: 48px;"><i class="fas fa-ban"></i><p>Only customers can transfer tickets.</p></div>`;
    }
    
    const activeTickets = getUserTickets().filter(t => t.status === 'active');

    return `
        <div style="max-width: 500px; margin: 0 auto;">
            <h2><i class="fas fa-exchange-alt"></i> Transfer Ticket</h2>
            <div class="card" style="padding: 24px;">
                <label class="label">Select Ticket</label>
                <select id="transferTicket" class="input" style="margin-bottom: 16px;">
                    <option value="">-- Select ticket --</option>
                    ${activeTickets.map(t => `<option value="${t.id}">${t.eventName} - ${t.tierName} (${t.attendeeName})</option>`).join('')}
                </select>
                <label class="label">Recipient Phone Number (must be customer)</label>
                <input id="transferPhone" class="input" placeholder="+250 7XX XXX XXX" style="margin-bottom: 20px;">
                <button class="btn btn-primary" style="width: 100%;" onclick="doTransfer()">
                    <i class="fas fa-paper-plane"></i> Transfer
                </button>
                <div id="transferMsg" style="margin-top: 16px;"></div>
            </div>
        </div>
    `;
}

function doTransfer() {
    const ticketId = document.getElementById('transferTicket')?.value;
    const phone = document.getElementById('transferPhone')?.value;
    if (!ticketId || !phone) {
        alert('Select ticket and enter recipient phone');
        return;
    }
    if (transferTicket(ticketId, phone)) {
        document.getElementById('transferMsg').innerHTML = '<div class="alert alert-success">✓ Ticket transferred successfully!</div>';
        setTimeout(() => { render(); window.location.hash = 'wallet'; }, 1500);
    } else {
        document.getElementById('transferMsg').innerHTML = '<div class="alert alert-error">✗ Transfer failed. Recipient must be a customer account.</div>';
    }
}