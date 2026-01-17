import apiFetch from '@wordpress/api-fetch';
import { useCallback, useEffect, useState } from '@wordpress/element';

const ActivityLog = () => {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterValue, setFilterValue] = useState('');
    const [activeFilter, setActiveFilter] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isExporting, setIsExporting] = useState(false);

    const fetchLogs = useCallback(async (search) => {
        setIsLoading(true);
        setErrorMessage('');
        const query = search ? `?search=${encodeURIComponent(search)}` : '';
        try {
            const data = await apiFetch({ path: `/saman-security/v1/activity/logs${query}` });
            setLogs(Array.isArray(data) ? data : []);
        } catch (error) {
            setErrorMessage(error?.message || 'Unable to load activity logs.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLogs(activeFilter);
    }, [activeFilter, fetchLogs]);

    const formatDate = (dateString) => {
        if (!dateString) {
            return '—';
        }

        const normalized = dateString.includes('T') ? dateString : dateString.replace(' ', 'T');
        const parsed = new Date(normalized);
        if (Number.isNaN(parsed.getTime())) {
            return dateString;
        }

        return parsed.toLocaleString();
    };

    const formatEventType = (eventType) => {
        switch (eventType) {
            case 'blocked':
                return { label: 'Blocked', className: 'danger' };
            case 'alert':
                return { label: 'Alert', className: 'warning' };
            case 'allowed':
                return { label: 'Allowed', className: 'success' };
            default:
                return { label: 'Info', className: '' };
        }
    };

    const applyFilter = () => {
        setActiveFilter(filterValue.trim());
    };

    const exportLogs = async () => {
        setIsExporting(true);
        setErrorMessage('');
        const query = activeFilter ? `?search=${encodeURIComponent(activeFilter)}` : '';
        try {
            const response = await apiFetch({
                path: `/saman-security/v1/activity/logs/export${query}`,
                parse: false,
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'saman-security-activity-log.csv';
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            setErrorMessage(error?.message || 'Unable to export activity logs.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>Activity Log</h1>
                    <p>Review recent security events and administrative actions.</p>
                </div>
                <button type="button" className="button ghost" onClick={exportLogs} disabled={isExporting}>
                    {isExporting ? 'Exporting...' : 'Export Logs'}
                </button>
            </div>
            <section className="panel">
                <div className="table-toolbar">
                    <div>
                        <h3>Recent Events</h3>
                        <p className="muted">Latest 24 hours</p>
                    </div>
                    <div className="inline-form">
                        <input
                            type="text"
                            placeholder="Filter by user or IP"
                            value={filterValue}
                            onChange={(event) => setFilterValue(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    applyFilter();
                                }
                            }}
                        />
                        <button type="button" className="button" onClick={applyFilter}>
                            Apply Filter
                        </button>
                        {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
                    </div>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Event</th>
                            <th>User</th>
                            <th>IP</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="4">Loading activity logs...</td>
                            </tr>
                        ) : logs.length ? (
                            logs.map((entry) => {
                                const eventType = formatEventType(entry.event_type);
                                return (
                                    <tr key={entry.id}>
                                        <td>
                                            <span className={`pill ${eventType.className}`}>{eventType.label}</span>{' '}
                                            {entry.event_message}
                                        </td>
                                        <td>{entry.user_name || 'Unknown'}</td>
                                        <td>{entry.ip_address || '—'}</td>
                                        <td>{formatDate(entry.created_at)}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="4">No activity recorded yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default ActivityLog;
