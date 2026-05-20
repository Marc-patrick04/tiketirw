// ============================================================
//  LOGIN PAGE with Demo Accounts
// ============================================================

function renderLogin() {
    const demoAccounts = [
        { role: "CUSTOMER", name: "Eric Niyomugabo", phone: "+250788123456", pass: "pass123", icon: "fa-user", color: "success" },
        { role: "ADMIN", name: "Admin User", phone: "+250788000001", pass: "admin123", icon: "fa-crown", color: "purple" },
        { role: "WORKER", name: "John Muwanga", phone: "+250788000002", pass: "worker123", icon: "fa-shield-alt", color: "info" },
        { role: "PERFORMER", name: "Michael Jackson", phone: "+250788000003", pass: "performer123", icon: "fa-microphone-alt", color: "orange" }
    ];

    return `
        <div class="auth-container">
            <div class="card" style="padding: 32px;">
                <h2 style="text-align: center; margin-bottom: 8px;"><i class="fas fa-sign-in-alt"></i> Welcome Back</h2>
                <p style="text-align: center; color: var(--text-muted); font-size: 13px; margin-bottom: 24px;">Sign in to your account</p>

                <label class="label">Phone or Email</label>
                <input id="loginIdentifier" class="input" placeholder="+250788123456 or email" style="margin-bottom: 16px;">
                <label class="label">Password</label>
                <input id="loginPassword" type="password" class="input" placeholder="Password" style="margin-bottom: 24px;">
                <button class="btn btn-primary" style="width: 100%;" onclick="doLogin()">
                    <i class="fas fa-arrow-right"></i> Login
                </button>

                <div style="margin-top: 28px;">
                    <p style="text-align: center; font-size: 12px; color: var(--text-muted); margin-bottom: 16px;">━━━ Demo Accounts ━━━</p>
                    <div class="demo-grid">
                        ${demoAccounts.map(acc => `
                            <div class="demo-item" onclick="document.getElementById('loginIdentifier').value='${acc.phone}'; document.getElementById('loginPassword').value='${acc.pass}'; doLogin();">
                                <div class="demo-icon"><i class="fas ${acc.icon}"></i></div>
                                <div class="demo-info">
                                    <div class="demo-role"><span class="badge badge-${acc.color}" style="padding: 2px 8px;">${acc.role}</span></div>
                                    <div class="demo-phone">${acc.phone}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="alert alert-info" style="margin-top: 20px; font-size: 12px;">
                    <i class="fas fa-info-circle"></i> <strong>Role Restrictions:</strong><br>
                    • Only <strong>CUSTOMERS</strong> can buy tickets<br>
                    • <strong>ADMIN</strong> can add events & manage workers<br>
                    • <strong>WORKERS</strong> scan tickets at gate<br>
                    • <strong>PERFORMERS</strong> view sales & earnings
                </div>
            </div>
        </div>
    `;
}

function doLogin() {
    const identifier = document.getElementById('loginIdentifier')?.value;
    const password = document.getElementById('loginPassword')?.value;
    if (login(identifier, password)) {
        render();
        window.location.hash = 'home';
    } else {
        alert('Invalid credentials. Click on a demo account above!');
    }
}