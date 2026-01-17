import apiFetch from '@wordpress/api-fetch';
import { useCallback, useEffect, useMemo, useState } from '@wordpress/element';

const defaultSummary = {
    security_posture: {
        score: 0,
        label: 'Unknown',
        enabled: 0,
        total: 0,
        pending: 0,
    },
    recent_activity: {
        blocked_last_7_days: 0,
        total_last_7_days: 0,
        spark: [],
        trend: 'steady',
    },
    scanner: {
        status: 'idle',
        progress: 0,
        last_scan: '',
        issues_count: 0,
    },
    firewall: {
        blocklist_count: 0,
        allowlist_count: 0,
        active_rules: 0,
        blocked_countries: 0,
    },
    notifications: {
        recipient_email: '',
        alerts_enabled: 0,
        weekly_summary_enabled: false,
    },
    general: {
        ip_anonymization: false,
        log_retention_days: 0,
    },
};

const Dashboard = () => {
    const [summary, setSummary] = useState(defaultSummary);
    const [isLoading, setIsLoading] = useState(true);
    const [isStartingScan, setIsStartingScan] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchSummary = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const data = await apiFetch({ path: '/saman-security/v1/dashboard/summary' });
            setSummary({
                ...defaultSummary,
                ...data,
                security_posture: { ...defaultSummary.security_posture, ...(data?.security_posture || {}) },
                recent_activity: { ...defaultSummary.recent_activity, ...(data?.recent_activity || {}) },
                scanner: { ...defaultSummary.scanner, ...(data?.scanner || {}) },
                firewall: { ...defaultSummary.firewall, ...(data?.firewall || {}) },
                notifications: { ...defaultSummary.notifications, ...(data?.notifications || {}) },
                general: { ...defaultSummary.general, ...(data?.general || {}) },
            });
        } catch (error) {
            setErrorMessage(error?.message || 'Unable to load dashboard data.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSummary();
    }, [fetchSummary]);

    const startQuickScan = async () => {
        if (summary.scanner.status === 'running') {
            return;
        }

        setIsStartingScan(true);
        setErrorMessage('');
        try {
            await apiFetch({
                path: '/saman-security/v1/scanner/start',
                method: 'POST',
            });
            await fetchSummary();
        } catch (error) {
            setErrorMessage(error?.message || 'Unable to start a quick scan.');
        } finally {
            setIsStartingScan(false);
        }
    };

    const postureClass = summary.security_posture.score >= 85
        ? 'success'
        : summary.security_posture.score >= 70
            ? 'warning'
            : 'danger';

    const scannerStatus = summary.scanner.status === 'running'
        ? 'warning'
        : summary.scanner.issues_count > 0
            ? 'danger'
            : 'success';

    const sparkBars = useMemo(() => {
        const values = Array.isArray(summary.recent_activity.spark)
            ? summary.recent_activity.spark
            : [];
        const max = Math.max(1, ...values);
        const padded = values.length >= 7
            ? values.slice(values.length - 7)
            : Array(7 - values.length).fill(0).concat(values);
        return padded.map((value) => Math.max(12, Math.round((value / max) * 90)));
    }, [summary.recent_activity.spark]);

    const formatDate = (dateString) => {
        if (!dateString) {
            return 'No scans yet';
        }

        const normalized = dateString.includes('T') ? dateString : dateString.replace(' ', 'T');
        const parsed = new Date(normalized);
        if (Number.isNaN(parsed.getTime())) {
            return dateString;
        }

        return parsed.toLocaleString();
    };

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Security posture, recent activity, and scanner status at a glance.</p>
                </div>
                <button
                    type="button"
                    className="button primary"
                    onClick={startQuickScan}
                    disabled={isStartingScan || summary.scanner.status === 'running'}
                >
                    {summary.scanner.status === 'running' ? 'Scan Running' : isStartingScan ? 'Starting...' : 'Run Quick Scan'}
                </button>
            </div>
            {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
            <div className="card-grid">
                <div className="card">
                    <div className="card-header">
                        <h3>Security Posture</h3>
                        <span className={`pill ${postureClass}`}>{summary.security_posture.score}% Secure</span>
                    </div>
                    <div className="gauge" style={{ '--value': summary.security_posture.score }}>
                        <div className="gauge-center">
                            <div className="gauge-value">{summary.security_posture.score}%</div>
                            <div className="gauge-label">{summary.security_posture.label}</div>
                        </div>
                    </div>
                    <p className="card-note">
                        {summary.security_posture.pending} hardening rules pending.
                    </p>
                </div>
                <div className="card">
                    <div className="card-header">
                        <h3>Recent Activity</h3>
                        <span className="pill warning">7 days</span>
                    </div>
                    <div className="spark-bars" aria-hidden="true">
                        {sparkBars.map((height, index) => (
                            <span key={`spark-${index}`} style={{ height: `${height}%` }} />
                        ))}
                    </div>
                    <p className="card-note">
                        {summary.recent_activity.blocked_last_7_days} blocked attacks, trending {summary.recent_activity.trend}.
                    </p>
                </div>
                <div className="card">
                    <div className="card-header">
                        <h3>Scanner Status</h3>
                        <span className={`pill ${scannerStatus}`}>{summary.scanner.status}</span>
                    </div>
                    <div className="status-row">
                        <span className={`status-dot ${scannerStatus}`} aria-hidden="true" />
                        <div>
                            <div className="status-title">
                                {summary.scanner.issues_count > 0 ? 'Issues detected' : 'All clear'}
                            </div>
                            <div className="status-subtitle">Last scan: {formatDate(summary.scanner.last_scan)}</div>
                        </div>
                    </div>
                    <p className="card-note">{summary.scanner.issues_count} issues found.</p>
                    {summary.scanner.status === 'running' ? (
                        <div className="progress-bar compact">
                            <span style={{ width: `${summary.scanner.progress}%` }} />
                        </div>
                    ) : null}
                </div>
                <div className="card">
                    <div className="card-header">
                        <h3>Firewall Overview</h3>
                        <span className="pill">Live</span>
                    </div>
                    <div className="stat-list">
                        <div className="stat-item">
                            <span className="muted">Blocklist IPs</span>
                            <strong>{summary.firewall.blocklist_count}</strong>
                        </div>
                        <div className="stat-item">
                            <span className="muted">Allowlist IPs</span>
                            <strong>{summary.firewall.allowlist_count}</strong>
                        </div>
                        <div className="stat-item">
                            <span className="muted">Active Rules</span>
                            <strong>{summary.firewall.active_rules}</strong>
                        </div>
                        <div className="stat-item">
                            <span className="muted">Geo Blocks</span>
                            <strong>{summary.firewall.blocked_countries}</strong>
                        </div>
                    </div>
                    <p className="card-note">Auto-block rules are active when rate limits are exceeded.</p>
                </div>
                <div className="card">
                    <div className="card-header">
                        <h3>Notifications</h3>
                        <span className="pill">Configured</span>
                    </div>
                    <div className="stat-list">
                        <div className="stat-item">
                            <span className="muted">Recipient</span>
                            <strong>{summary.notifications.recipient_email || 'Admin Email'}</strong>
                        </div>
                        <div className="stat-item">
                            <span className="muted">Alerts Enabled</span>
                            <strong>{summary.notifications.alerts_enabled}</strong>
                        </div>
                        <div className="stat-item">
                            <span className="muted">Weekly Summary</span>
                            <strong>{summary.notifications.weekly_summary_enabled ? 'On' : 'Off'}</strong>
                        </div>
                        <div className="stat-item">
                            <span className="muted">Log Retention</span>
                            <strong>{summary.general.log_retention_days} days</strong>
                        </div>
                    </div>
                    <p className="card-note">
                        IP anonymization {summary.general.ip_anonymization ? 'enabled' : 'disabled'} for logs.
                    </p>
                </div>
            </div>
            {isLoading ? <p className="muted">Refreshing dashboard data...</p> : null}
        </div>
    );
};

export default Dashboard;
