import { useCallback, useEffect, useState } from 'react';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Firewall from './pages/Firewall';
import Hardening from './pages/Hardening';
import Scanner from './pages/Scanner';
import ActivityLog from './pages/ActivityLog';
import Settings from './pages/Settings';
import More from './pages/More';

const viewToPage = {
    dashboard: 'wp-security-pilot-dashboard',
    firewall: 'wp-security-pilot-firewall',
    scanner: 'wp-security-pilot-scanner',
    hardening: 'wp-security-pilot-hardening',
    activity: 'wp-security-pilot-activity',
    settings: 'wp-security-pilot-settings',
    more: 'wp-security-pilot-more',
};

const pageToView = Object.entries(viewToPage).reduce((acc, [view, page]) => {
    acc[page] = view;
    return acc;
}, {});

const App = ({ initialView = 'dashboard' }) => {
    const [currentView, setCurrentView] = useState(initialView);

    const updateAdminMenuHighlight = useCallback((view) => {
        if (typeof document === 'undefined') {
            return;
        }

        const menu = document.getElementById('toplevel_page_wp-security-pilot');
        if (!menu) {
            return;
        }

        const submenuLinks = menu.querySelectorAll('.wp-submenu a[href*="page=wp-security-pilot"]');
        submenuLinks.forEach((link) => {
            link.removeAttribute('aria-current');
            const listItem = link.closest('li');
            if (listItem) {
                listItem.classList.remove('current');
            }
        });

        const page = viewToPage[view] || viewToPage.dashboard;
        const activeLink = menu.querySelector(`.wp-submenu a[href*="page=${page}"]`);
        if (activeLink) {
            activeLink.setAttribute('aria-current', 'page');
            const listItem = activeLink.closest('li');
            if (listItem) {
                listItem.classList.add('current');
            }
        }

        menu.classList.add('current', 'wp-has-current-submenu');
    }, []);

    const handleNavigate = useCallback(
        (view) => {
            if (view === currentView) {
                return;
            }

            setCurrentView(view);
            if (typeof window === 'undefined') {
                return;
            }
            const page = viewToPage[view] || viewToPage.dashboard;
            const url = new URL(window.location.href);
            url.searchParams.set('page', page);
            url.searchParams.delete('tab');
            window.history.pushState({}, '', url.toString());
            updateAdminMenuHighlight(view);
        },
        [currentView, updateAdminMenuHighlight]
    );

    useEffect(() => {
        const handlePopState = () => {
            const url = new URL(window.location.href);
            const page = url.searchParams.get('page');
            if (page && pageToView[page]) {
                setCurrentView(pageToView[page]);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    useEffect(() => {
        updateAdminMenuHighlight(currentView);
    }, [currentView, updateAdminMenuHighlight]);

    useEffect(() => {
        const handleMenuClick = (event) => {
            const link = event.target.closest('a');
            if (!link || typeof window === 'undefined') {
                return;
            }

            const menu = document.getElementById('toplevel_page_wp-security-pilot');
            if (!menu || !menu.contains(link)) {
                return;
            }

            const href = link.getAttribute('href');
            if (!href || !href.includes('page=wp-security-pilot')) {
                return;
            }

            const url = new URL(href, window.location.origin);
            const page = url.searchParams.get('page');
            if (!page || !pageToView[page]) {
                return;
            }

            event.preventDefault();
            handleNavigate(pageToView[page]);
        };

        document.addEventListener('click', handleMenuClick);
        return () => document.removeEventListener('click', handleMenuClick);
    }, [handleNavigate]);

    const renderView = () => {
        switch (currentView) {
            case 'firewall':
                return <Firewall />;
            case 'hardening':
                return <Hardening />;
            case 'scanner':
                return <Scanner />;
            case 'activity':
                return <ActivityLog />;
            case 'settings':
                return <Settings />;
            case 'more':
                return <More />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="wp-security-pilot-admin">
            <div className="wp-security-pilot-shell">
                <Header currentView={currentView} onNavigate={handleNavigate} />
                <div className="content-area">
                    {renderView()}
                </div>
            </div>
        </div>
    );
};

export default App;
