import { useCallback, useEffect, useState } from 'react';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Firewall from './pages/Firewall';
import Hardening from './pages/Hardening';
import Scanner from './pages/Scanner';
import ActivityLog from './pages/ActivityLog';
import Settings from './pages/Settings';
import More from './pages/More';
import { setAnalyticsEnabled, trackPageView } from './utils/analytics';

const viewToPage = {
    dashboard: 'saman-security-dashboard',
    firewall: 'saman-security-firewall',
    scanner: 'saman-security-scanner',
    hardening: 'saman-security-hardening',
    activity: 'saman-security-activity',
    settings: 'saman-security-settings',
    more: 'saman-security-more',
};

const pageToView = Object.entries(viewToPage).reduce((acc, [view, page]) => {
    acc[page] = view;
    return acc;
}, {});

const App = ({ initialView = 'dashboard' }) => {
    const [currentView, setCurrentView] = useState(initialView);
    const viewLabels = {
        dashboard: 'Dashboard',
        firewall: 'Firewall',
        scanner: 'Scanner',
        hardening: 'Hardening',
        activity: 'Activity Log',
        settings: 'Settings',
        more: 'More',
    };

    const updateAdminMenuHighlight = useCallback((view) => {
        if (typeof document === 'undefined') {
            return;
        }

        const menu = document.getElementById('toplevel_page_saman-security');
        if (!menu) {
            return;
        }

        const submenuLinks = menu.querySelectorAll('.wp-submenu a[href*="page=saman-security"]');
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
        if (typeof window === 'undefined') {
            return;
        }

        const analyticsConfig = window.samanSecuritySettings?.analytics;
        setAnalyticsEnabled(Boolean(analyticsConfig?.enabled), analyticsConfig || {});
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const label = viewLabels[currentView] || 'Dashboard';
        trackPageView(`/saman-security/${currentView}`, `Saman Security - ${label}`);
    }, [currentView]);

    useEffect(() => {
        const handleMenuClick = (event) => {
            const link = event.target.closest('a');
            if (!link || typeof window === 'undefined') {
                return;
            }

            const menu = document.getElementById('toplevel_page_saman-security');
            if (!menu || !menu.contains(link)) {
                return;
            }

            const href = link.getAttribute('href');
            if (!href || !href.includes('page=saman-security')) {
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
        <div className="saman-security-admin">
            <div className="saman-security-shell">
                <Header currentView={currentView} onNavigate={handleNavigate} />
                <div className="content-area">
                    {renderView()}
                </div>
            </div>
        </div>
    );
};

export default App;
