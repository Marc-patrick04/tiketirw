// ============================================================
//  SIDEBAR COMPONENT
// ============================================================

function renderSidebar() {
    const isLoggedIn = !!currentUser;
    const role = currentUser?.role || 'guest';
    
    // Define navigation based on role
    let navGroups = [
        { title: "MAIN", items: [
            { icon: "fas fa-home", label: "Home", page: "home", show: true }
        ]}
    ];
    
    // Events are visible to all logged in users
    if (isLoggedIn) {
        navGroups[0].items.push({ icon: "fas fa-calendar-alt", label: "Events", page: "events", show: true });
    }
    
    if (!isLoggedIn) {
        navGroups[0].items.push({ icon: "fas fa-sign-in-alt", label: "Login", page: "login", show: true });
    } else {
        // Customer specific pages
        if (role === 'customer') {
            navGroups.push({ title: "MY TICKETS", items: [
                { icon: "fas fa-ticket-alt", label: "My Tickets", page: "wallet", show: true },
                { icon: "fas fa-exchange-alt", label: "Transfer", page: "transfer", show: true },
                { icon: "fas fa-users", label: "Group Booking", page: "group", show: true }
            ]});
        }
        
        // Common pages for all logged in users
        navGroups.push({ title: "TOOLS", items: [
            { icon: "fas fa-phone-alt", label: "USSD Guide", page: "ussd", show: true }
        ]});
        
        // Admin specific pages
        if (role === 'admin') {
            navGroups.push({ title: "ADMIN", items: [
                { icon: "fas fa-chart-line", label: "Dashboard", page: "admin", show: true },
                { icon: "fas fa-users-cog", label: "Workers", page: "workers", show: true },
                { icon: "fas fa-plus-circle", label: "Add Event", page: "admin", show: true }
            ]});
        }
        
        // Performer specific pages
        if (role === 'performer') {
            navGroups.push({ title: "PERFORMER", items: [
                { icon: "fas fa-microphone-alt", label: "Dashboard", page: "performer", show: true }
            ]});
        }
        
        // Worker/Admin gate access
        if (role === 'worker' || role === 'admin') {
            navGroups.push({ title: "GATE", items: [
                { icon: "fas fa-qrcode", label: "Scanner", page: "gate", show: true }
            ]});
        }
    }
    
    const navHtml = navGroups.map(group => `
        <div class="nav-group">
            <div class="nav-group-title">${group.title}</div>
            ${group.items.filter(i => i.show).map(item => `
                <div class="nav-item" data-page="${item.page}" onclick="window.location.hash='${item.page}'; render();">
                    <i class="${item.icon}"></i>
                    <span>${item.label}</span>
                </div>
            `).join('')}
        </div>
    `).join('');
    
    document.getElementById('sidebarNav').innerHTML = navHtml;
    
    // User info section
    const roleColor = currentUser ? getRoleColor(currentUser.role) : 'gray';
    const userHtml = currentUser ? `
        <div style="margin-bottom: 10px">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <span style="font-size: 32px;">${currentUser.avatar || '👤'}</span>
                <div>
                    <strong>${currentUser.name}</strong><br>
                    <span class="badge badge-${roleColor === 'green' ? 'success' : (roleColor === 'purple' ? 'purple' : (roleColor === 'blue' ? 'info' : 'orange'))}" style="font-size: 10px; text-transform: uppercase;">${currentUser.role}</span>
                </div>
            </div>
        </div>
        <button class="btn btn-outline btn-sm" style="width: 100%;" onclick="logout()">
            <i class="fas fa-sign-out-alt"></i> Logout
        </button>
    ` : `
        <div style="margin-bottom: 10px; color: var(--text-muted); text-align: center;">
            <i class="fas fa-user"></i> Not logged in
        </div>
        <button class="btn btn-primary btn-sm" style="width: 100%;" onclick="window.location.hash='login'; render();">
            <i class="fas fa-sign-in-alt"></i> Login
        </button>
    `;
    document.getElementById('userSection').innerHTML = userHtml;
}