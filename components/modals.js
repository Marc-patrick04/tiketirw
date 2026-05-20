// ============================================================
//  MODAL COMPONENTS
// ============================================================

let selectedTier = null;

function selectEvent(eventId) {
    const event = window.DB.events.find(e => e.id === eventId);
    if (!event) return;

    const availableTiers = [];
    if (event.tiers.regular) availableTiers.push('regular');
    if (event.tiers.vip) availableTiers.push('vip');
    if (event.tiers.vvip) availableTiers.push('vvip');
    
    const canBuy = canBuyTickets();
    const buyButtonHtml = canBuy ? 
        `<button class="btn btn-primary" onclick="buyTickets('${event.id}')"><i class="fas fa-shopping-cart"></i> Buy Now</button>` :
        `<button class="btn btn-disabled" disabled style="opacity:0.5;cursor:not-allowed;"><i class="fas fa-ban"></i> Only Customers Can Buy</button>`;

    const modalHtml = `
        <div id="eventModal" class="modal" onclick="if(event.target===this) closeModal()">
            <div class="modal-content">
                <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
                    <h3>${event.name}</h3>
                    <button class="btn btn-outline btn-sm" onclick="closeModal()"><i class="fas fa-times"></i></button>
                </div>
                <img src="${event.image}" style="width: 100%; height: 140px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: 16px;">
                <div class="event-meta" style="margin-bottom: 20px;">
                    <span><i class="fas fa-map-marker-alt"></i> ${getLocationName(event.locationId)}</span>
                    <span><i class="far fa-calendar"></i> ${event.date} at ${event.time}</span>
                    <span><i class="fas fa-user"></i> ${event.performerName}</span>
                </div>

                <label class="label">Select Ticket Type</label>
                <div id="tierSelector">
                    ${availableTiers.map(tier => `
                        <div class="ticket-tier" data-tier="${tier}" onclick="selectTier('${tier}')">
                            <div>
                                <div class="tier-name">${TIERS[tier].name}</div>
                                <div style="font-size: 10px; color: var(--text-muted);">${TIERS[tier].benefits}</div>
                            </div>
                            <div class="tier-price">${(event.basePrice * TIERS[tier].multiplier).toLocaleString()} RWF</div>
                        </div>
                    `).join('')}
                </div>

                <div style="margin-top: 16px;">
                    <label class="label">Quantity</label>
                    <input type="number" id="ticketQty" min="1" max="10" value="1" class="input">
                </div>

                <div style="margin-top: 20px; display: flex; gap: 12px;">
                    ${buyButtonHtml}
                    <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
                </div>
                <div id="purchaseResult" style="margin-top: 12px;"></div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    selectedTier = availableTiers[0];
    document.querySelector(`.ticket-tier[data-tier="${availableTiers[0]}"]`)?.classList.add('selected');
}

function selectTier(tier) {
    selectedTier = tier;
    document.querySelectorAll('.ticket-tier').forEach(el => el.classList.remove('selected'));
    document.querySelector(`.ticket-tier[data-tier="${tier}"]`)?.classList.add('selected');
}

function buyTickets(eventId) {
    if (!canBuyTickets()) {
        alert('Only customers can purchase tickets. Please login with a customer account.');
        closeModal();
        window.location.hash = 'login';
        render();
        return;
    }
    const qty = parseInt(document.getElementById('ticketQty')?.value || 1);
    const result = purchaseTicket(eventId, selectedTier, qty, []);
    const resultDiv = document.getElementById('purchaseResult');
    if (result.success) {
        let message = `✓ Purchased ${qty} ticket(s)! Total: ${result.total.toLocaleString()} RWF\n\n`;
        if (result.ussdCodes && result.ussdCodes.length > 0) {
            message += `📱 USSD Entry Codes (valid 5 minutes):\n`;
            result.ussdCodes.forEach((u, i) => {
                message += `Ticket ${i+1}: *724*${u.code}#\n`;
            });
            message += `\nDial these codes at the gate if you don't have a smartphone.`;
        }
        alert(message);
        setTimeout(() => { closeModal(); render(); window.location.hash = 'wallet'; }, 1500);
    } else {
        resultDiv.innerHTML = `<div class="badge badge-danger" style="padding: 12px; display: block;">${result.msg}</div>`;
    }
}

function showQR(ticketId, eventName, attendeeName) {
    const ticket = window.DB.tickets.find(t => t.id === ticketId);
    if (!ticket) return;
    const qrData = generateOfflineQRCode(ticket.id, ticket.secret);

    const modalHtml = `
        <div id="qrModal" class="modal" onclick="if(event.target===this) closeModal()">
            <div class="modal-content" style="text-align: center;">
                <h3>${eventName}</h3>
                <p>${attendeeName}</p>
                <div class="qr-container" id="qrCodeContainer"></div>
                <p style="color: var(--accent); font-size: 28px; font-weight: 700; margin: 12px 0;">${qrData.code}</p>
                <p style="color: var(--text-secondary); font-size: 12px;">Code changes every 30s · Valid for entry</p>
                <p style="color: var(--text-muted); font-size: 11px;">Expires in: <span id="qrTimer">30</span>s</p>
                <button class="btn btn-primary" onclick="closeModal()">Close</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const container = document.getElementById('qrCodeContainer');
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 200, 200);
    ctx.fillStyle = 'black';
    ctx.font = 'bold 28px monospace';
    ctx.fillText(qrData.code, 25, 110);
    container.appendChild(canvas);

    let timeLeft = qrData.expiresIn;
    const timer = setInterval(() => {
        timeLeft--;
        const timerSpan = document.getElementById('qrTimer');
        if (timerSpan) timerSpan.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            closeModal();
            alert('QR code expired. Please refresh from My Tickets.');
        }
    }, 1000);
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(m => m.remove());
}