const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'firewall', label: 'Firewall' },
    { id: 'scanner', label: 'Scanner' },
    { id: 'hardening', label: 'Hardening' },
    { id: 'activity', label: 'Activity Log' },
    { id: 'settings', label: 'Settings' },
    { id: 'more', label: 'More' },
];

const Header = ({ currentView, onNavigate }) => {
    return (
        <header className="top-bar">
            <div className="brand">
                <span className="brand-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" role="img" focusable="false" preserveAspectRatio="xMidYMid meet">
                        <path d="M12 2L4 5.4v6.2c0 5.1 3.4 9.7 8 10.4 4.6-.7 8-5.3 8-10.4V5.4L12 2zm0 2.2l6 2.3v5.1c0 4-2.5 7.6-6 8.3-3.5-.7-6-4.3-6-8.3V6.5l6-2.3z" />
                        <path d="M10.5 12.7l-2-2-1.3 1.3 3.3 3.3 5.3-5.3-1.3-1.3-4 4z" />
                    </svg>
                </span>
                <span className="brand-name">Saman Security</span>
            </div>
            <nav className="main-nav" aria-label="Primary">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        className={`nav-tab ${currentView === item.id ? 'is-active' : ''}`}
                        aria-current={currentView === item.id ? 'page' : undefined}
                        onClick={() => onNavigate(item.id)}
                    >
                        {item.label}
                    </button>
                ))}
            </nav>
            <div className="nav-actions">
                <a
                    className="icon-button"
                    href="https://github.com/SamanLabs/Saman-Security"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Open GitHub repository"
                >
                    <svg viewBox="0 0 24 24" role="img" focusable="false">
                        <path d="M12 2C6.5 2 2 6.6 2 12.3c0 4.6 2.9 8.5 6.9 9.9.5.1.7-.2.7-.5v-1.9c-2.8.6-3.3-1.2-3.3-1.2-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 .1.7 1.7 2.6 1.2.1-.8.4-1.2.7-1.5-2.2-.2-4.5-1.2-4.5-5.2 0-1.1.4-2 1-2.7-.1-.2-.4-1.3.1-2.7 0 0 .8-.2 2.7 1a9.2 9.2 0 0 1 4.9 0c1.9-1.2 2.7-1 2.7-1 .5 1.4.2 2.5.1 2.7.6.7 1 1.6 1 2.7 0 4-2.3 5-4.5 5.2.4.3.8 1 .8 2.1v3c0 .3.2.6.7.5 4-1.4 6.9-5.3 6.9-9.9C22 6.6 17.5 2 12 2z" />
                    </svg>
                </a>
            </div>
        </header>
    );
};

export default Header;
