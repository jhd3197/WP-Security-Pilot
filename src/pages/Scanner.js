import apiFetch from '@wordpress/api-fetch';
import { useCallback, useEffect, useState } from '@wordpress/element';
import SubTabs from '../components/SubTabs';
import useUrlTab from '../hooks/useUrlTab';

const scanTabs = [
    { id: 'scan', label: 'Scan Now' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'ignore', label: 'Ignore List' },
];

const initialJobState = {
    status: 'idle',
    progress: 0,
    message: '',
    results: [],
    started_at: '',
    completed_at: '',
};

const initialSchedule = {
    enabled: false,
    frequency: 'daily',
    time: '02:00',
};

const Scanner = () => {
    const [activeTab, setActiveTab] = useUrlTab({ tabs: scanTabs, defaultTab: 'scan' });
    const [job, setJob] = useState(initialJobState);
    const [jobId, setJobId] = useState(null);
    const [isStarting, setIsStarting] = useState(false);
    const [isStopping, setIsStopping] = useState(false);
    const [scanError, setScanError] = useState('');

    const [schedule, setSchedule] = useState(initialSchedule);
    const [isScheduleSaving, setIsScheduleSaving] = useState(false);
    const [scheduleError, setScheduleError] = useState('');

    const [ignoreText, setIgnoreText] = useState('');
    const [isIgnoreSaving, setIsIgnoreSaving] = useState(false);
    const [ignoreError, setIgnoreError] = useState('');

    const fetchLatestStatus = useCallback(async () => {
        try {
            const data = await apiFetch({ path: '/saman-security/v1/scanner/status' });
            if (data?.id) {
                setJobId(data.id);
            }
            setJob({
                ...initialJobState,
                ...data,
                results: Array.isArray(data?.results) ? data.results : [],
            });
        } catch (error) {
            setScanError(error?.message || 'Unable to load scan status.');
        }
    }, []);

    const fetchStatus = useCallback(async (id) => {
        try {
            const data = await apiFetch({ path: `/saman-security/v1/scanner/status/${id}` });
            setJob({
                ...initialJobState,
                ...data,
                results: Array.isArray(data?.results) ? data.results : [],
            });
            return data;
        } catch (error) {
            setScanError(error?.message || 'Unable to refresh scan status.');
            return null;
        }
    }, []);

    const fetchSchedule = useCallback(async () => {
        try {
            const data = await apiFetch({ path: '/saman-security/v1/scanner/schedule' });
            setSchedule({
                ...initialSchedule,
                ...data,
            });
        } catch (error) {
            setScheduleError(error?.message || 'Unable to load schedule settings.');
        }
    }, []);

    const fetchIgnoreList = useCallback(async () => {
        try {
            const data = await apiFetch({ path: '/saman-security/v1/scanner/ignore' });
            const list = Array.isArray(data) ? data : [];
            setIgnoreText(list.join('\n'));
        } catch (error) {
            setIgnoreError(error?.message || 'Unable to load ignore list.');
        }
    }, []);

    useEffect(() => {
        fetchLatestStatus();
        fetchSchedule();
        fetchIgnoreList();
    }, [fetchLatestStatus, fetchSchedule, fetchIgnoreList]);

    useEffect(() => {
        if (!jobId || job.status !== 'running') {
            return undefined;
        }

        const interval = setInterval(() => {
            fetchStatus(jobId).then((data) => {
                if (data && data.status !== 'running') {
                    clearInterval(interval);
                }
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [jobId, job.status, fetchStatus]);

    const startScan = async () => {
        setIsStarting(true);
        setScanError('');
        try {
            const data = await apiFetch({
                path: '/saman-security/v1/scanner/start',
                method: 'POST',
            });
            setJobId(data.job_id);
            await fetchStatus(data.job_id);
        } catch (error) {
            setScanError(error?.message || 'Unable to start scan.');
        } finally {
            setIsStarting(false);
        }
    };

    const stopScan = async () => {
        if (!jobId) {
            return;
        }

        setIsStopping(true);
        setScanError('');
        try {
            await apiFetch({
                path: `/saman-security/v1/scanner/stop/${jobId}`,
                method: 'POST',
            });
            await fetchStatus(jobId);
        } catch (error) {
            setScanError(error?.message || 'Unable to stop scan.');
        } finally {
            setIsStopping(false);
        }
    };

    const saveSchedule = async () => {
        setIsScheduleSaving(true);
        setScheduleError('');
        try {
            const data = await apiFetch({
                path: '/saman-security/v1/scanner/schedule',
                method: 'POST',
                data: schedule,
            });
            setSchedule({
                ...initialSchedule,
                ...data,
            });
        } catch (error) {
            setScheduleError(error?.message || 'Unable to save schedule.');
        } finally {
            setIsScheduleSaving(false);
        }
    };

    const saveIgnoreList = async () => {
        setIsIgnoreSaving(true);
        setIgnoreError('');
        const patterns = ignoreText
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean);
        try {
            const data = await apiFetch({
                path: '/saman-security/v1/scanner/ignore',
                method: 'POST',
                data: {
                    patterns,
                },
            });
            setIgnoreText((Array.isArray(data) ? data : patterns).join('\n'));
        } catch (error) {
            setIgnoreError(error?.message || 'Unable to save ignore list.');
        } finally {
            setIsIgnoreSaving(false);
        }
    };

    const renderStatusPill = (status) => {
        if (status === 'flagged') {
            return 'danger';
        }
        if (status === 'modified') {
            return 'warning';
        }
        return 'success';
    };

    const isRunning = job.status === 'running';

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>Scanner</h1>
                    <p>Monitor file integrity, malware signatures, and core checks.</p>
                </div>
                <button type="button" className="button ghost">View Scan History</button>
            </div>

            <SubTabs tabs={scanTabs} activeTab={activeTab} onChange={setActiveTab} ariaLabel="Scanner sections" />

            <section className="panel">
                {activeTab === 'scan' ? (
                    <div className="scan-layout">
                        <div className="scan-action">
                            <h3>Run a manual scan</h3>
                            <p className="muted">Check plugins, themes, and core files for changes.</p>
                            <div className="inline-form">
                                <button
                                    type="button"
                                    className="button primary"
                                    onClick={startScan}
                                    disabled={isRunning || isStarting}
                                >
                                    {isStarting ? 'Starting...' : 'Start New Scan'}
                                </button>
                                <button
                                    type="button"
                                    className="button"
                                    onClick={stopScan}
                                    disabled={!isRunning || isStopping}
                                >
                                    {isStopping ? 'Stopping...' : 'Stop Scan'}
                                </button>
                                {scanError ? <p className="form-error">{scanError}</p> : null}
                            </div>
                        </div>
                        {isRunning && (
                            <div className="scan-progress">
                                <div className="progress-header">
                                    <span>{job.message || 'Scanning files...'}</span>
                                    <span className="muted">{job.progress}%</span>
                                </div>
                                <div className="progress-bar">
                                    <span style={{ width: `${job.progress}%` }} />
                                </div>
                            </div>
                        )}
                        {!isRunning && job.status !== 'idle' && (
                            <div className="scan-progress">
                                <div className="progress-header">
                                    <span>{job.message || 'Scan status updated.'}</span>
                                    <span className="muted">{job.progress}%</span>
                                </div>
                                <div className="progress-bar">
                                    <span style={{ width: `${job.progress}%` }} />
                                </div>
                            </div>
                        )}
                        <div className="scan-results">
                            <h3>Latest Results</h3>
                            {job.results.length ? (
                                <ul className="result-list">
                                    {job.results.map((result) => (
                                        <li key={`${result.file_path}-${result.created_at}`}>
                                            <span className={`pill ${renderStatusPill(result.status)}`}>
                                                {result.status}
                                            </span>
                                            <div className="result-details">
                                                <span>{result.file_path}</span>
                                                {result.details ? (
                                                    <span className="result-meta">{result.details}</span>
                                                ) : null}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="muted">No issues detected yet.</p>
                            )}
                        </div>
                    </div>
                ) : null}

                {activeTab === 'schedule' ? (
                    <form className="settings-form">
                        <div className="settings-row">
                            <div className="settings-label">
                                <label htmlFor="scan-schedule">Enable Scheduled Scans</label>
                                <p className="settings-help">Automatically run scans on a recurring schedule.</p>
                            </div>
                            <div className="settings-control">
                                <label className="toggle">
                                    <input
                                        id="scan-schedule"
                                        type="checkbox"
                                        checked={schedule.enabled}
                                        onChange={(event) => setSchedule((prev) => ({
                                            ...prev,
                                            enabled: event.target.checked,
                                        }))}
                                    />
                                    <span className="toggle-track" />
                                    <span className="toggle-text">{schedule.enabled ? 'Enabled' : 'Disabled'}</span>
                                </label>
                            </div>
                        </div>
                        <div className="settings-row">
                            <div className="settings-label">
                                <label htmlFor="scan-frequency">Frequency</label>
                                <p className="settings-help">Choose how often the scan should run.</p>
                            </div>
                            <div className="settings-control">
                                <select
                                    id="scan-frequency"
                                    value={schedule.frequency}
                                    onChange={(event) => setSchedule((prev) => ({
                                        ...prev,
                                        frequency: event.target.value,
                                    }))}
                                    disabled={!schedule.enabled}
                                >
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                </select>
                            </div>
                        </div>
                        <div className="settings-row">
                            <div className="settings-label">
                                <label htmlFor="scan-time">Run Time</label>
                                <p className="settings-help">Select the local time for scheduled scans.</p>
                            </div>
                            <div className="settings-control">
                                <input
                                    id="scan-time"
                                    type="time"
                                    value={schedule.time}
                                    onChange={(event) => setSchedule((prev) => ({
                                        ...prev,
                                        time: event.target.value,
                                    }))}
                                    disabled={!schedule.enabled}
                                />
                            </div>
                        </div>
                        <div className="form-footer">
                            <button
                                type="button"
                                className="button primary"
                                onClick={saveSchedule}
                                disabled={isScheduleSaving}
                            >
                                {isScheduleSaving ? 'Saving...' : 'Save Schedule'}
                            </button>
                            {scheduleError ? <p className="form-error">{scheduleError}</p> : null}
                        </div>
                    </form>
                ) : null}

                {activeTab === 'ignore' ? (
                    <form className="settings-form">
                        <div className="settings-row">
                            <div className="settings-label">
                                <label htmlFor="ignore-patterns">Ignore Paths</label>
                                <p className="settings-help">Add one path or wildcard pattern per line.</p>
                            </div>
                            <div className="settings-control">
                                <textarea
                                    id="ignore-patterns"
                                    value={ignoreText}
                                    onChange={(event) => setIgnoreText(event.target.value)}
                                    placeholder="wp-content/uploads/*.php"
                                />
                            </div>
                        </div>
                        <div className="form-footer">
                            <button
                                type="button"
                                className="button primary"
                                onClick={saveIgnoreList}
                                disabled={isIgnoreSaving}
                            >
                                {isIgnoreSaving ? 'Saving...' : 'Save Ignore List'}
                            </button>
                            {ignoreError ? <p className="form-error">{ignoreError}</p> : null}
                        </div>
                    </form>
                ) : null}
            </section>
        </div>
    );
};

export default Scanner;
