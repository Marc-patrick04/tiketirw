// ============================================================
//  USSD GUIDE PAGE (For non-smartphone users)
// ============================================================

function renderUSSD() {
    let userTickets = [];
    let ussdCodesHtml = '';
    
    if (currentUser && currentUser.role === 'customer') {
        userTickets = getUserTickets().filter(t => t.status === 'active');
        const activeCodes = window.DB.ussdCodes?.filter(u => 
            userTickets.some(t => t.id === u.ticketId) && !u.used && u.expiry > Date.now()
        ) || [];
        if (activeCodes.length > 0) {
            ussdCodesHtml = `
                <div class="card" style="margin-top: 20px; padding: 20px;">
                    <h3><i class="fas fa-qrcode"></i> Your Active USSD Codes</h3>
                    ${activeCodes.map(code => {
                        const ticket = userTickets.find(t => t.id === code.ticketId);
                        const expiryMin = Math.max(0, Math.floor((code.expiry - Date.now()) / 60000));
                        return `
                            <div style="padding: 12px; border-bottom: 1px solid var(--border);">
                                <div><strong>${ticket?.eventName}</strong> - ${ticket?.attendeeName}</div>
                                <div style="font-size: 20px; font-weight: 700; color: var(--accent); margin: 8px 0;">*724*${code.code}#</div>
                                <div style="font-size: 11px; color: var(--text-muted);">⏱️ Expires in ${expiryMin} minute(s)</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        }
    }
    
    return `
        <div style="max-width: 450px; margin: 0 auto;">
            <div class="card" style="text-align: center; padding: 32px;">
                <div style="font-size: 48px;">📱</div>
                <h2>USSD Entry - No Smartphone Needed!</h2>
                <div style="font-size: 28px; font-weight: 800; color: var(--accent); margin: 16px 0;">*724#</div>
                <p style="color: var(--text-secondary);">Dial on ANY phone — even feature phones without internet</p>
            </div>

            <div class="card" style="margin-top: 20px; padding: 24px;">
                <div class="ussd-screen">
                    <div>📱 USSD SIMULATION</div>
                    <div style="margin-top: 12px;">1. My Tickets</div>
                    <div>2. Get Entry Code (valid 5min)</div>
                    <div>3. Buy Ticket</div>
                    <div>4. Check Event</div>
                    <hr style="border-color: #333; margin: 12px 0;">
                    <div id="ussdCodeDisplay" style="font-size: 16px; font-weight: bold; color: var(--accent);">Select option 2</div>
                    <div style="display: flex; gap: 8px; margin-top: 16px;">
                        <button class="btn btn-outline btn-sm" onclick="simulateUSSD(2)">Get Entry Code</button>
                        <button class="btn btn-outline btn-sm" onclick="simulateUSSD(1)">My Tickets</button>
                    </div>
                </div>
            </div>
            
            ${ussdCodesHtml}
            
            <div class="card" style="margin-top: 20px; padding: 20px; background: var(--accent-subtle);">
                <h4><i class="fas fa-info-circle"></i> How it works:</h4>
                <ul style="margin-top: 12px; padding-left: 20px; color: var(--text-secondary); font-size: 13px;">
                    <li>1. Buy tickets online (with internet)</li>
                    <li>2. Get a unique 6-digit USSD code</li>
                    <li>3. At the gate, dial *724*CODE#</li>
                    <li>4. Show the confirmation to the worker</li>
                    <li>5. Code expires after 5 minutes for security</li>
                </ul>
            </div>
        </div>
    `;
}

function simulateUSSD(option) {
    const display = document.getElementById('ussdCodeDisplay');
    if (option === 2) {
        if (!currentUser || currentUser.role !== 'customer') {
            display.innerHTML = `❌ Please login with customer account first`;
            return;
        }
        const activeTickets = getUserTickets().filter(t => t.status === 'active');
        if (activeTickets.length === 0) {
            display.innerHTML = `📋 You have no active tickets. Buy tickets first!`;
            return;
        }
        const ticket = activeTickets[0];
        let ussdCode = window.DB.ussdCodes?.find(u => u.ticketId === ticket.id && !u.used);
        if (!ussdCode || ussdCode.expiry < Date.now()) {
            ussdCode = generateUSSDCode(ticket.id);
        }
        const expiryMin = Math.floor((ussdCode.expiry - Date.now()) / 60000);
        display.innerHTML = `🎟️ Entry Code: <strong style="font-size: 20px;">*724*${ussdCode.code}#</strong><br>Valid for ${expiryMin} minutes<br>Show this at the gate`;
    } else if (option === 1) {
        const ticketCount = currentUser && currentUser.role === 'customer' ? getUserTickets().length : 0;
        display.innerHTML = `📋 You have ${ticketCount} active ticket(s)`;
    }
}