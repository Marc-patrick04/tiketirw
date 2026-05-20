// ============================================================
//  GATE SCANNER PAGE (Worker/Admin only)
// ============================================================

function renderGate() {
    if (!currentUser || (currentUser.role !== 'worker' && currentUser.role !== 'admin')) {
        return `<div class="card" style="text-align: center; padding: 48px;"><i class="fas fa-lock" style="font-size: 48px;"></i><p>Worker/Admin access only.</p></div>`;
    }

    const recentScans = window.DB.scans?.slice(0, 10) || [];

    return `
        <h2><i class="fas fa-qrcode"></i> Gate Scanner</h2>
        <div class="scanner-sim">
            <div style="font-size: 48px;">📷</div>
            <div class="scanner-line"></div>
            <p style="color: var(--text-secondary);">Scan QR code OR enter USSD code (6 digits)</p>
            <div style="display: flex; gap: 12px; max-width: 400px; margin: 20px auto 0;">
                <input id="scanInput" class="input" placeholder="Enter QR code or USSD code (e.g., 123456)" style="flex: 1;">
                <button class="btn btn-primary" onclick="doScan()"><i class="fas fa-check"></i> Verify</button>
            </div>
        </div>

        <div id="scanResult"></div>

        <div class="card" style="padding: 20px;">
            <h3><i class="fas fa-history"></i> Recent Scans (${recentScans.length})</h3>
            ${recentScans.map(s => `
                <div style="padding: 10px 0; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                    <div>
                        <span class="badge badge-success"><i class="fas fa-check"></i> Valid</span>
                        <strong> ${s.eventName}</strong><br>
                        <span style="font-size: 11px;">${s.attendee} (${s.method || 'QR'})</span>
                    </div>
                    <span style="font-size: 10px; color: var(--text-muted);">${s.timestamp}</span>
                </div>
            `).join('')}
            ${recentScans.length === 0 ? '<p style="text-align: center; color: var(--text-muted);">No scans yet.</p>' : ''}
        </div>
    `;
}

function doScan() {
    const input = document.getElementById('scanInput')?.value;
    if (!input) {
        alert('Enter QR code or USSD code');
        return;
    }
    const result = validateTicket(input);
    const resultDiv = document.getElementById('scanResult');
    if (result.valid) {
        resultDiv.innerHTML = `<div class="alert alert-success" style="text-align: center;">
            <i class="fas fa-check-circle" style="font-size: 24px;"></i><br>
            <strong>✓ VALID ENTRY!</strong><br>
            Welcome ${result.ticket.attendeeName} to ${result.ticket.eventName}<br>
            <span style="font-size: 11px;">${result.ticket.tierName} Ticket</span>
        </div>`;
    } else {
        resultDiv.innerHTML = `<div class="alert alert-error" style="text-align: center;">
            <i class="fas fa-times-circle" style="font-size: 24px;"></i><br>
            <strong>✗ ACCESS DENIED</strong><br>
            ${result.reason}
        </div>`;
    }
    document.getElementById('scanInput').value = '';
    setTimeout(() => { if (window.location.hash === '#gate') renderGate(); }, 2000);
}