import apiFetch from '@wordpress/api-fetch';
import { useCallback, useEffect, useState } from '@wordpress/element';
import { setAnalyticsEnabled } from '../utils/analytics';

const defaultSettings = {
    general: {
        ip_anonymization: true,
        log_retention_days: 30,
        delete_data_on_uninstall: false,
    },
    firewall: {
        ratelimit_threshold: 10,
        ratelimit_period_seconds: 60,
        autoblock_duration_minutes: 60,
    },
    scanner: {
        scan_intensity: 'medium',
        enable_auto_repair: false,
        scan_speed: 3,
        cache_enabled: true,
        cache_recheck_days: 30,
    },
    notifications: {
        recipient_email: '',
        alerts: {
            on_firewall_block: true,
            on_malware_found: true,
            on_core_file_modified: true,
            on_admin_login: false,
            on_user_login: false,
        },
        weekly_summary_enabled: true,
        weekly_summary_day: 'monday',
        weekly_summary_time: '09:00',
    },
    integrations: {
        slack: {
            webhook_url: '',
        },
    },
    analytics: {
        enabled: true,
    },
    updated_at: '',
};

const Settings = () => {
    const [settings, setSettings] = useState(defaultSettings);
    const [apiKeys, setApiKeys] = useState([]);
    const [generatedKey, setGeneratedKey] = useState('');
    const [newKeyLabel, setNewKeyLabel] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isKeySaving, setIsKeySaving] = useState(false);
    const [isKeyRemoving, setIsKeyRemoving] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [keyErrorMessage, setKeyErrorMessage] = useState('');
    const [analyticsExpanded, setAnalyticsExpanded] = useState(true);

    const fetchSettings = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const data = await apiFetch({ path: '/saman-security/v1/settings' });
            const { api_keys: apiKeysFromApi, ...rest } = data || {};
            const merged = {
                ...defaultSettings,
                ...rest,
                general: { ...defaultSettings.general, ...(rest?.general || {}) },
                firewall: { ...defaultSettings.firewall, ...(rest?.firewall || {}) },
                scanner: { ...defaultSettings.scanner, ...(rest?.scanner || {}) },
                notifications: {
                    ...defaultSettings.notifications,
                    ...(rest?.notifications || {}),
                    alerts: { ...defaultSettings.notifications.alerts, ...(rest?.notifications?.alerts || {}) },
                },
                integrations: {
                    ...defaultSettings.integrations,
                    ...(rest?.integrations || {}),
                    slack: { ...defaultSettings.integrations.slack, ...(rest?.integrations?.slack || {}) },
                },
                analytics: {
                    ...defaultSettings.analytics,
                    ...(rest?.analytics || {}),
                },
            };
            setSettings(merged);
            setApiKeys(Array.isArray(apiKeysFromApi) ? apiKeysFromApi : []);
        } catch (error) {
            setErrorMessage(error?.message || 'Unable to load settings.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const updateSection = (section, key, value) => {
        setSettings((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value,
            },
        }));
    };

    const updateAlert = (key, value) => {
        setSettings((prev) => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                alerts: {
                    ...prev.notifications.alerts,
                    [key]: value,
                },
            },
        }));
    };

    const saveSettings = async (overrideSettings) => {
        setIsSaving(true);
        setErrorMessage('');
        try {
            const payload = overrideSettings || settings;
            const data = await apiFetch({
                path: '/saman-security/v1/settings',
                method: 'POST',
                data: payload,
            });
            const { api_keys: apiKeysFromApi, ...rest } = data || {};
            const merged = {
                ...defaultSettings,
                ...rest,
                general: { ...defaultSettings.general, ...(rest?.general || {}) },
                firewall: { ...defaultSettings.firewall, ...(rest?.firewall || {}) },
                scanner: { ...defaultSettings.scanner, ...(rest?.scanner || {}) },
                notifications: {
                    ...defaultSettings.notifications,
                    ...(rest?.notifications || {}),
                    alerts: { ...defaultSettings.notifications.alerts, ...(rest?.notifications?.alerts || {}) },
                },
                integrations: {
                    ...defaultSettings.integrations,
                    ...(rest?.integrations || {}),
                    slack: { ...defaultSettings.integrations.slack, ...(rest?.integrations?.slack || {}) },
                },
                analytics: {
                    ...defaultSettings.analytics,
                    ...(rest?.analytics || {}),
                },
            };
            setSettings(merged);
            setApiKeys(Array.isArray(apiKeysFromApi) ? apiKeysFromApi : apiKeys);
        } catch (error) {
            setErrorMessage(error?.message || 'Unable to save settings.');
        } finally {
            setIsSaving(false);
        }
    };

    const resetDefaults = () => {
        setGeneratedKey('');
        setSettings(defaultSettings);
        if (typeof window !== 'undefined' && window.samanSecuritySettings?.analytics) {
            window.samanSecuritySettings.analytics.enabled = defaultSettings.analytics.enabled;
        }
        setAnalyticsEnabled(defaultSettings.analytics.enabled);
        saveSettings(defaultSettings);
    };

    const handleAnalyticsToggle = (event) => {
        const enabled = event.target.checked;
        updateSection('analytics', 'enabled', enabled);
        if (typeof window !== 'undefined' && window.samanSecuritySettings?.analytics) {
            window.samanSecuritySettings.analytics.enabled = enabled;
        }
        setAnalyticsEnabled(enabled);
    };

    const generateApiKey = async () => {
        setIsKeySaving(true);
        setKeyErrorMessage('');
        try {
            const data = await apiFetch({
                path: '/saman-security/v1/settings/api-keys',
                method: 'POST',
                data: {
                    label: newKeyLabel,
                },
            });
            setGeneratedKey(data?.key || '');
            if (data?.entry) {
                setApiKeys((prev) => [...prev, data.entry]);
            } else {
                await fetchSettings();
            }
            setNewKeyLabel('');
        } catch (error) {
            setKeyErrorMessage(error?.message || 'Unable to generate API key.');
        } finally {
            setIsKeySaving(false);
        }
    };

    const revokeApiKey = async (prefix) => {
        setIsKeyRemoving(prefix);
        setKeyErrorMessage('');
        try {
            const data = await apiFetch({
                path: `/saman-security/v1/settings/api-keys/${prefix}`,
                method: 'DELETE',
            });
            setApiKeys(Array.isArray(data) ? data : []);
        } catch (error) {
            setKeyErrorMessage(error?.message || 'Unable to revoke API key.');
        } finally {
            setIsKeyRemoving(null);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) {
            return 'Not saved yet';
        }

        const normalized = dateString.includes('T') ? dateString : dateString.replace(' ', 'T');
        const parsed = new Date(normalized);
        if (Number.isNaN(parsed.getTime())) {
            return dateString;
        }

        return parsed.toLocaleString();
    };

    const getScanSpeedLabel = (value) => {
        switch (Number(value)) {
            case 1:
                return 'Gentle';
            case 2:
                return 'Balanced';
            case 4:
                return 'Fast';
            case 5:
                return 'Turbo';
            case 3:
            default:
                return 'Standard';
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>Settings</h1>
                    <p>Manage notifications, API keys, and global preferences.</p>
                </div>
                <button type="button" className="button ghost" onClick={resetDefaults} disabled={isSaving}>
                    Reset Defaults
                </button>
            </div>
            <div className="page-body two-column">
                <section className="panel">
                    <div className="analytics-notice">
                        <div className="analytics-notice__header">
                            <div className="analytics-notice__icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                                    <path d="M12 16v-4"></path>
                                    <path d="M12 8h.01"></path>
                                </svg>
                            </div>
                            <div className="analytics-notice__content">
                                <h4>Help Improve Saman Security</h4>
                                <p>Share anonymous usage data to help us understand which features are most valuable and improve the plugin for everyone.</p>
                            </div>
                            <label className="toggle">
                                <input
                                    type="checkbox"
                                    checked={settings.analytics.enabled}
                                    onChange={handleAnalyticsToggle}
                                    disabled={isLoading || isSaving}
                                    aria-label="Enable analytics"
                                />
                                <span className="toggle-track"></span>
                            </label>
                        </div>
                        <button
                            type="button"
                            className="analytics-notice__expand"
                            onClick={() => setAnalyticsExpanded((prev) => !prev)}
                            aria-expanded={analyticsExpanded}
                        >
                            {analyticsExpanded ? 'Hide details' : 'Show details'}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </button>
                        {analyticsExpanded && (
                            <div className="analytics-notice__details">
                                <div className="analytics-privacy-info">
                                    <h5>What We Collect</h5>
                                    <ul>
                                        <li>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                            <span>Feature usage (e.g., "redirect created", "AI title generated")</span>
                                        </li>
                                        <li>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                            <span>Plugin version number</span>
                                        </li>
                                        <li>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                            <span>Pages visited within the plugin</span>
                                        </li>
                                        <li>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                            <span>Anonymized site identifier (hashed URL)</span>
                                        </li>
                                    </ul>
                                    <h5>What We Never Collect</h5>
                                    <ul className="analytics-privacy-info__never">
                                        <li>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                            <span>Personal information (names, emails, IP addresses)</span>
                                        </li>
                                        <li>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                            <span>Your content (posts, pages, meta data)</span>
                                        </li>
                                        <li>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                            <span>API keys or credentials</span>
                                        </li>
                                        <li>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                            <span>Your site's URL or domain name</span>
                                        </li>
                                    </ul>
                                    <h5>Privacy Measures</h5>
                                    <div className="analytics-privacy-info__measures">
                                        <div className="privacy-measure">
                                            <span className="privacy-measure__icon">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                                </svg>
                                            </span>
                                            <div>
                                                <strong>No Cookies</strong>
                                                <span>We don't use any tracking cookies</span>
                                            </div>
                                        </div>
                                        <div className="privacy-measure">
                                            <span className="privacy-measure__icon">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                                </svg>
                                            </span>
                                            <div>
                                                <strong>Admin Only</strong>
                                                <span>Only tracks within plugin admin pages</span>
                                            </div>
                                        </div>
                                        <div className="privacy-measure">
                                            <span className="privacy-measure__icon">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                                                </svg>
                                            </span>
                                            <div>
                                                <strong>Opt-out Anytime</strong>
                                                <span>Disable tracking at any time</span>
                                            </div>
                                        </div>
                                        <div className="privacy-measure">
                                            <span className="privacy-measure__icon">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
                                                </svg>
                                            </span>
                                            <div>
                                                <strong>Self-Hosted</strong>
                                                <span>Analytics on our own Matomo instance</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="analytics-privacy-info__footer">This data helps us prioritize features, fix common issues, and understand how the plugin is used in real-world scenarios. Thank you for helping us improve!</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <h3>General Settings</h3>
                    <div className="settings-row">
                        <div className="settings-label">
                            <label htmlFor="ip-anonymization">IP Anonymization</label>
                            <p className="settings-help">Mask the last segment of IPs stored in logs.</p>
                        </div>
                        <div className="settings-control">
                            <label className="toggle">
                                <input
                                    id="ip-anonymization"
                                    type="checkbox"
                                    checked={settings.general.ip_anonymization}
                                    onChange={(event) => updateSection('general', 'ip_anonymization', event.target.checked)}
                                    disabled={isLoading || isSaving}
                                />
                                <span className="toggle-track" />
                                <span className="toggle-text">{settings.general.ip_anonymization ? 'Enabled' : 'Disabled'}</span>
                            </label>
                        </div>
                    </div>
                    <div className="settings-row">
                        <div className="settings-label">
                            <label htmlFor="log-retention">Log Retention (Days)</label>
                            <p className="settings-help">Automatically purge logs older than this many days.</p>
                        </div>
                        <div className="settings-control">
                            <input
                                id="log-retention"
                                type="number"
                                min="0"
                                value={settings.general.log_retention_days}
                                onChange={(event) => updateSection('general', 'log_retention_days', Number(event.target.value))}
                                disabled={isLoading || isSaving}
                            />
                        </div>
                    </div>
                    <div className="settings-row">
                        <div className="settings-label">
                            <label htmlFor="delete-on-uninstall">Delete Data on Uninstall</label>
                            <p className="settings-help">Remove all plugin data when the plugin is deleted.</p>
                        </div>
                        <div className="settings-control">
                            <label className="toggle">
                                <input
                                    id="delete-on-uninstall"
                                    type="checkbox"
                                    checked={settings.general.delete_data_on_uninstall}
                                    onChange={(event) => updateSection('general', 'delete_data_on_uninstall', event.target.checked)}
                                    disabled={isLoading || isSaving}
                                />
                                <span className="toggle-track" />
                                <span className="toggle-text">{settings.general.delete_data_on_uninstall ? 'Enabled' : 'Disabled'}</span>
                            </label>
                        </div>
                    </div>

                    <h3>Firewall Controls</h3>
                    <div className="settings-row">
                        <div className="settings-label">
                            <label htmlFor="rate-threshold">Rate Limit Threshold</label>
                            <p className="settings-help">Number of rule hits before auto-blocking.</p>
                        </div>
                        <div className="settings-control">
                            <input
                                id="rate-threshold"
                                type="number"
                                min="1"
                                value={settings.firewall.ratelimit_threshold}
                                onChange={(event) => updateSection('firewall', 'ratelimit_threshold', Number(event.target.value))}
                                disabled={isLoading || isSaving}
                            />
                        </div>
                    </div>
                    <div className="settings-row">
                        <div className="settings-label">
                            <label htmlFor="rate-period">Rate Limit Period (Seconds)</label>
                            <p className="settings-help">Time window used to count repeated hits.</p>
                        </div>
                        <div className="settings-control">
                            <input
                                id="rate-period"
                                type="number"
                                min="10"
                                value={settings.firewall.ratelimit_period_seconds}
                                onChange={(event) => updateSection('firewall', 'ratelimit_period_seconds', Number(event.target.value))}
                                disabled={isLoading || isSaving}
                            />
                        </div>
                    </div>
                    <div className="settings-row">
                        <div className="settings-label">
                            <label htmlFor="autoblock-duration">Auto-Block Duration (Minutes)</label>
                            <p className="settings-help">How long auto-blocks remain active.</p>
                        </div>
                        <div className="settings-control">
                            <input
                                id="autoblock-duration"
                                type="number"
                                min="1"
                                value={settings.firewall.autoblock_duration_minutes}
                                onChange={(event) => updateSection('firewall', 'autoblock_duration_minutes', Number(event.target.value))}
                                disabled={isLoading || isSaving}
                            />
                        </div>
                    </div>

                    <h3>Scanner Controls</h3>
                    <div className="settings-row">
                        <div className="settings-label">
                            <label htmlFor="scan-intensity">Scan Intensity</label>
                            <p className="settings-help">Balance depth of scanning with server load.</p>
                        </div>
                        <div className="settings-control">
                            <select
                                id="scan-intensity"
                                value={settings.scanner.scan_intensity}
                                onChange={(event) => updateSection('scanner', 'scan_intensity', event.target.value)}
                                disabled={isLoading || isSaving}
                            >
                                <option value="low">Low (Core Only)</option>
                                <option value="medium">Medium (Core + Plugins/Themes)</option>
                                <option value="high">High (Full Coverage)</option>
                            </select>
                        </div>
                    </div>
                    <div className="settings-row">
                        <div className="settings-label">
                            <label htmlFor="scan-speed">Scan Speed</label>
                            <p className="settings-help">Control how aggressively the scanner processes files.</p>
                        </div>
                        <div className="settings-control">
                            <input
                                id="scan-speed"
                                type="range"
                                min="1"
                                max="5"
                                step="1"
                                value={settings.scanner.scan_speed}
                                onChange={(event) => updateSection('scanner', 'scan_speed', Number(event.target.value))}
                                disabled={isLoading || isSaving}
                            />
                            <div className="range-meta">
                                <span>Slow</span>
                                <strong>{getScanSpeedLabel(settings.scanner.scan_speed)}</strong>
                                <span>Fast</span>
                            </div>
                        </div>
                    </div>
                    <div className="settings-row">
                        <div className="settings-label">
                            <label htmlFor="auto-repair">Auto Repair Core Files</label>
                            <p className="settings-help">Automatically restore modified WordPress core files.</p>
                        </div>
                        <div className="settings-control">
                            <label className="toggle">
                                <input
                                    id="auto-repair"
                                    type="checkbox"
                                    checked={settings.scanner.enable_auto_repair}
                                    onChange={(event) => updateSection('scanner', 'enable_auto_repair', event.target.checked)}
                                    disabled={isLoading || isSaving}
                                />
                                <span className="toggle-track" />
                                <span className="toggle-text">{settings.scanner.enable_auto_repair ? 'Enabled' : 'Disabled'}</span>
                            </label>
                        </div>
                    </div>
                    <div className="settings-row">
                        <div className="settings-label">
                            <label htmlFor="cache-enabled">Skip Unchanged Files</label>
                            <p className="settings-help">Skip files that have not changed since the last clean scan.</p>
                        </div>
                        <div className="settings-control">
                            <label className="toggle">
                                <input
                                    id="cache-enabled"
                                    type="checkbox"
                                    checked={settings.scanner.cache_enabled}
                                    onChange={(event) => updateSection('scanner', 'cache_enabled', event.target.checked)}
                                    disabled={isLoading || isSaving}
                                />
                                <span className="toggle-track" />
                                <span className="toggle-text">{settings.scanner.cache_enabled ? 'Enabled' : 'Disabled'}</span>
                            </label>
                        </div>
                    </div>
                    <div className="settings-row">
                        <div className="settings-label">
                            <label htmlFor="cache-recheck">Recheck Unchanged Files (Days)</label>
                            <p className="settings-help">Force a full re-scan after this many days.</p>
                        </div>
                        <div className="settings-control">
                            <input
                                id="cache-recheck"
                                type="number"
                                min="1"
                                max="365"
                                value={settings.scanner.cache_recheck_days}
                                onChange={(event) => updateSection('scanner', 'cache_recheck_days', Number(event.target.value))}
                                disabled={isLoading || isSaving || !settings.scanner.cache_enabled}
                            />
                        </div>
                    </div>

                    <h3>Notifications</h3>
                    <div className="settings-row">
                        <div className="settings-label">
                            <label htmlFor="recipient-email">Recipient Email</label>
                            <p className="settings-help">Override the site admin email for alerts.</p>
                        </div>
                        <div className="settings-control">
                            <input
                                id="recipient-email"
                                type="text"
                                placeholder="security-team@example.com"
                                value={settings.notifications.recipient_email}
                                onChange={(event) => updateSection('notifications', 'recipient_email', event.target.value)}
                                disabled={isLoading || isSaving}
                            />
                        </div>
                    </div>
                    <div className="settings-row">
                        <div className="settings-label">
                            <label>Alert Types</label>
                            <p className="settings-help">Choose which events trigger notifications.</p>
                        </div>
                        <div className="settings-control">
                            <div className="checkbox-group">
                                <label className="checkbox">
                                    <input
                                        type="checkbox"
                                        checked={settings.notifications.alerts.on_firewall_block}
                                        onChange={(event) => updateAlert('on_firewall_block', event.target.checked)}
                                        disabled={isLoading || isSaving}
                                    />
                                    Firewall blocks
                                </label>
                                <label className="checkbox">
                                    <input
                                        type="checkbox"
                                        checked={settings.notifications.alerts.on_malware_found}
                                        onChange={(event) => updateAlert('on_malware_found', event.target.checked)}
                                        disabled={isLoading || isSaving}
                                    />
                                    Malware detected
                                </label>
                                <label className="checkbox">
                                    <input
                                        type="checkbox"
                                        checked={settings.notifications.alerts.on_core_file_modified}
                                        onChange={(event) => updateAlert('on_core_file_modified', event.target.checked)}
                                        disabled={isLoading || isSaving}
                                    />
                                    Core file modified
                                </label>
                                <label className="checkbox">
                                    <input
                                        type="checkbox"
                                        checked={settings.notifications.alerts.on_admin_login}
                                        onChange={(event) => updateAlert('on_admin_login', event.target.checked)}
                                        disabled={isLoading || isSaving}
                                    />
                                    Admin login
                                </label>
                                <label className="checkbox">
                                    <input
                                        type="checkbox"
                                        checked={settings.notifications.alerts.on_user_login}
                                        onChange={(event) => updateAlert('on_user_login', event.target.checked)}
                                        disabled={isLoading || isSaving}
                                    />
                                    Any user login
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="settings-row">
                        <div className="settings-label">
                            <label htmlFor="weekly-summary">Weekly Summary</label>
                            <p className="settings-help">Send a weekly security digest.</p>
                        </div>
                        <div className="settings-control">
                            <label className="toggle">
                                <input
                                    id="weekly-summary"
                                    type="checkbox"
                                    checked={settings.notifications.weekly_summary_enabled}
                                    onChange={(event) => updateSection('notifications', 'weekly_summary_enabled', event.target.checked)}
                                    disabled={isLoading || isSaving}
                                />
                                <span className="toggle-track" />
                                <span className="toggle-text">{settings.notifications.weekly_summary_enabled ? 'Enabled' : 'Disabled'}</span>
                            </label>
                        </div>
                    </div>
                    {settings.notifications.weekly_summary_enabled && (
                        <div className="settings-row">
                            <div className="settings-label">
                                <label>Weekly Summary Schedule</label>
                                <p className="settings-help">Choose when to receive the weekly digest.</p>
                            </div>
                            <div className="settings-control">
                                <div className="inline-form">
                                    <select
                                        value={settings.notifications.weekly_summary_day}
                                        onChange={(event) => updateSection('notifications', 'weekly_summary_day', event.target.value)}
                                        disabled={isLoading || isSaving}
                                    >
                                        <option value="sunday">Sunday</option>
                                        <option value="monday">Monday</option>
                                        <option value="tuesday">Tuesday</option>
                                        <option value="wednesday">Wednesday</option>
                                        <option value="thursday">Thursday</option>
                                        <option value="friday">Friday</option>
                                        <option value="saturday">Saturday</option>
                                    </select>
                                    <input
                                        type="time"
                                        value={settings.notifications.weekly_summary_time}
                                        onChange={(event) => updateSection('notifications', 'weekly_summary_time', event.target.value)}
                                        disabled={isLoading || isSaving}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="form-footer">
                        <button
                            type="button"
                            className="button primary"
                            onClick={() => saveSettings()}
                            disabled={isLoading || isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Save Settings'}
                        </button>
                        <span className="muted">Last saved {formatDate(settings.updated_at)}.</span>
                        {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
                    </div>
                </section>
                <aside className="side-panel">
                    <div className="side-card">
                        <h3>API Keys</h3>
                        <p className="muted">Generate keys to connect external dashboards.</p>
                        <div className="inline-form">
                            <input
                                type="text"
                                placeholder="Key label"
                                value={newKeyLabel}
                                onChange={(event) => setNewKeyLabel(event.target.value)}
                                disabled={isKeySaving}
                            />
                            <button
                                type="button"
                                className="button primary"
                                onClick={generateApiKey}
                                disabled={isKeySaving}
                            >
                                {isKeySaving ? 'Generating...' : 'Generate Key'}
                            </button>
                        </div>
                        {keyErrorMessage ? <p className="form-error">{keyErrorMessage}</p> : null}
                        {generatedKey ? (
                            <div className="key-preview">
                                <span className="muted">New Key (copy now):</span>
                                <span className="code">{generatedKey}</span>
                            </div>
                        ) : null}
                        <div className="api-key-list">
                            {apiKeys.length ? apiKeys.map((key) => (
                                <div key={key.key_prefix} className="api-key-row">
                                    <div>
                                        <div className="api-key-label">{key.label || 'API Key'}</div>
                                        <div className="muted">{key.key_prefix}</div>
                                    </div>
                                    <button
                                        type="button"
                                        className="link-button"
                                        onClick={() => revokeApiKey(key.key_prefix)}
                                        disabled={isKeyRemoving === key.key_prefix}
                                    >
                                        {isKeyRemoving === key.key_prefix ? 'Revoking...' : 'Revoke'}
                                    </button>
                                </div>
                            )) : (
                                <p className="muted">No API keys generated yet.</p>
                            )}
                        </div>
                    </div>
                    <div className="side-card highlight">
                        <h3>Integrations</h3>
                        <p className="muted">Connect Slack, webhooks, and custom endpoints.</p>
                        <div className="settings-control">
                            <input
                                type="text"
                                placeholder="Slack webhook URL"
                                value={settings.integrations.slack.webhook_url}
                                onChange={(event) => setSettings((prev) => ({
                                    ...prev,
                                    integrations: {
                                        ...prev.integrations,
                                        slack: {
                                            ...prev.integrations.slack,
                                            webhook_url: event.target.value,
                                        },
                                    },
                                }))}
                                disabled={isLoading || isSaving}
                            />
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Settings;
