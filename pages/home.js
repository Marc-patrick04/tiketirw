// ============================================================
//  HOME PAGE
// ============================================================

function renderHome() {
    const featuredEvents = window.DB.events.slice(0, 6);
    const totalTickets = window.DB.tickets.length;

    return `
        <div class="hero">
            <div class="hero-content">
                <div class="hero-badge">
                    <i class="fas fa-bolt"></i> Made for Rwanda · Offline-Ready
                </div>
                <h1 class="hero-title">Tickets that work,<br><span>even offline.</span></h1>
                <p class="hero-desc">Buy with MoMo. Enter with QR or USSD. No internet at the gate? No problem. Rwanda's most reliable event ticketing platform.</p>
                <div class="hero-buttons">
                    <button class="btn btn-primary" onclick="window.location.hash='events'; render();">
                        <i class="fas fa-ticket-alt"></i> Browse Events
                    </button>
                    <button class="btn btn-outline" onclick="window.location.hash='login'; render();">
                        <i class="fas fa-sign-in-alt"></i> Login
                    </button>
                </div>
                <div class="hero-stats">
                    <div class="hero-stat">
                        <div class="hero-stat-value">${totalTickets}+</div>
                        <div class="hero-stat-label">Tickets Sold</div>
                    </div>
                    <div class="hero-stat">
                        <div class="hero-stat-value">${window.DB.events.length}</div>
                        <div class="hero-stat-label">Live Events</div>
                    </div>
                    <div class="hero-stat">
                        <div class="hero-stat-value">99%</div>
                        <div class="hero-stat-label">Gate Success</div>
                    </div>
                </div>
            </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2><i class="fas fa-star" style="color: var(--accent);"></i> Featured Events</h2>
            <button class="btn btn-outline btn-sm" onclick="window.location.hash='events'; render();">
                View All ${window.DB.events.length} Events <i class="fas fa-arrow-right"></i>
            </button>
        </div>

        <div class="events-grid">
            ${featuredEvents.map(e => renderEventCard(e)).join('')}
        </div>

        <div style="margin-top: 32px; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px;">
            <div class="card card-hover" style="padding: 24px; text-align: center;">
                <i class="fas fa-mobile-alt" style="font-size: 40px; color: var(--accent); margin-bottom: 12px;"></i>
                <h4>Works Offline</h4>
                <p style="font-size: 12px; color: var(--text-muted);">Gate scanners work without internet</p>
            </div>
            <div class="card card-hover" style="padding: 24px; text-align: center;">
                <i class="fas fa-phone-alt" style="font-size: 40px; color: var(--accent); margin-bottom: 12px;"></i>
                <h4>USSD Entry</h4>
                <p style="font-size: 12px; color: var(--text-muted);">Dial *724# for entry code (5min valid)</p>
            </div>
            <div class="card card-hover" style="padding: 24px; text-align: center;">
                <i class="fas fa-shield-virus" style="font-size: 40px; color: var(--accent); margin-bottom: 12px;"></i>
                <h4>Anti-Fraud</h4>
                <p style="font-size: 12px; color: var(--text-muted);">Codes change every 30 seconds</p>
            </div>
        </div>
        
        <div class="role-cards" style="margin-top: 32px;">
            <div class="role-card customer" onclick="document.getElementById('loginIdentifier').value='+250788123456'; document.getElementById('loginPassword').value='pass123'; doLogin();">
                <div class="role-icon">👨</div>
                <div class="role-name">Customer</div>
                <div class="role-desc">Buy tickets · View wallet · Transfer</div>
            </div>
            <div class="role-card admin" onclick="document.getElementById('loginIdentifier').value='+250788000001'; document.getElementById('loginPassword').value='admin123'; doLogin();">
                <div class="role-icon">👑</div>
                <div class="role-name">Admin</div>
                <div class="role-desc">Manage events · Workers · Analytics</div>
            </div>
            <div class="role-card worker" onclick="document.getElementById('loginIdentifier').value='+250788000002'; document.getElementById('loginPassword').value='worker123'; doLogin();">
                <div class="role-icon">🛡️</div>
                <div class="role-name">Worker</div>
                <div class="role-desc">Scan tickets · Gate access</div>
            </div>
            <div class="role-card performer" onclick="document.getElementById('loginIdentifier').value='+250788000003'; document.getElementById('loginPassword').value='performer123'; doLogin();">
                <div class="role-icon">🎤</div>
                <div class="role-name">Performer</div>
                <div class="role-desc">View sales · Track earnings</div>
            </div>
        </div>
    `;
}