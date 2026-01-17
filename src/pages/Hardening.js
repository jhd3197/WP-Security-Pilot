import apiFetch from '@wordpress/api-fetch';
import { useCallback, useEffect, useMemo, useState } from '@wordpress/element';
import SubTabs from '../components/SubTabs';
import useUrlTab from '../hooks/useUrlTab';

const hardeningTabs = [
    { id: 'general', label: 'General Hardening' },
    { id: 'rest', label: 'REST API' },
    { id: 'passwords', label: 'Password Policy' },
    { id: 'export', label: 'Export Config' },
];

const defaultSettings = {
    general: {
        xmlrpc_mode: 'disable',
        disable_file_editor: true,
        limit_login_attempts: 3,
        hide_wp_version: true,
    },
    rest: {
        access: 'authenticated',
        allowed_roles: ['administrator'],
        allowlist: [],
    },
    passwords: {
        min_length: 12,
        require_upper: true,
        require_lower: true,
        require_number: true,
        require_special: false,
        block_common: true,
    },
    updated_at: '',
};

const Hardening = () => {
    const [activeTab, setActiveTab] = useUrlTab({ tabs: hardeningTabs, defaultTab: 'general' });
    const [settings, setSettings] = useState(defaultSettings);
    const [restRolesInput, setRestRolesInput] = useState('');
    const [restAllowlistInput, setRestAllowlistInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchSettings = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const data = await apiFetch({ path: '/saman-security/v1/hardening' });
            const merged = {
                ...defaultSettings,
                ...data,
                general: { ...defaultSettings.general, ...(data?.general || {}) },
                rest: { ...defaultSettings.rest, ...(data?.rest || {}) },
                passwords: { ...defaultSettings.passwords, ...(data?.passwords || {}) },
            };
            setSettings(merged);
            setRestRolesInput((merged.rest.allowed_roles || []).join(', '));
            setRestAllowlistInput((merged.rest.allowlist || []).join(', '));
        } catch (error) {
            setErrorMessage(error?.message || 'Unable to load hardening settings.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const updateGeneral = (key, value) => {
        setSettings((prev) => ({
            ...prev,
            general: {
                ...prev.general,
                [key]: value,
            },
        }));
    };

    const updateRest = (key, value) => {
        setSettings((prev) => ({
            ...prev,
            rest: {
                ...prev.rest,
                [key]: value,
            },
        }));
    };

    const updatePasswords = (key, value) => {
        setSettings((prev) => ({
            ...prev,
            passwords: {
                ...prev.passwords,
                [key]: value,
            },
        }));
    };

    const saveSettings = async (overrideSettings) => {
        setIsSaving(true);
        setErrorMessage('');
        const payload = overrideSettings || {
            ...settings,
            rest: {
                ...settings.rest,
                allowed_roles: restRolesInput.split(',').map((role) => role.trim()).filter(Boolean),
                allowlist: restAllowlistInput.split(',').map((route) => route.trim()).filter(Boolean),
            },
        };

        try {
            const data = await apiFetch({
                path: '/saman-security/v1/hardening',
                method: 'POST',
                data: payload,
            });
            const merged = {
                ...defaultSettings,
                ...data,
                general: { ...defaultSettings.general, ...(data?.general || {}) },
                rest: { ...defaultSettings.rest, ...(data?.rest || {}) },
                passwords: { ...defaultSettings.passwords, ...(data?.passwords || {}) },
            };
            setSettings(merged);
            setRestRolesInput((merged.rest.allowed_roles || []).join(', '));
            setRestAllowlistInput((merged.rest.allowlist || []).join(', '));
        } catch (error) {
            setErrorMessage(error?.message || 'Unable to save hardening settings.');
        } finally {
            setIsSaving(false);
        }
    };

    const applyDefaults = () => {
        const defaults = {
            ...defaultSettings,
            updated_at: settings.updated_at,
        };
        setSettings(defaults);
        setRestRolesInput(defaultSettings.rest.allowed_roles.join(', '));
        setRestAllowlistInput(defaultSettings.rest.allowlist.join(', '));
        saveSettings(defaults);
    };

    const exportConfig = async () => {
        setIsExporting(true);
        setErrorMessage('');
        try {
            const response = await apiFetch({
                path: '/saman-security/v1/hardening/export',
                parse: false,
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'saman-security-hardening.json';
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            setErrorMessage(error?.message || 'Unable to export hardening settings.');
        } finally {
            setIsExporting(false);
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

    const statusItems = useMemo(() => ([
        { label: 'File editor disabled', enabled: settings.general.disable_file_editor },
        {
            label: 'XML-RPC blocked',
            enabled: settings.general.xmlrpc_mode === 'disable' || settings.general.xmlrpc_mode === 'pingbacks',
        },
        { label: 'Login attempts limited', enabled: settings.general.limit_login_attempts > 0 },
        { label: 'WP version hidden', enabled: settings.general.hide_wp_version },
        { label: 'REST API limited', enabled: settings.rest.access !== 'open' },
        {
            label: 'Password policy enforced',
            enabled: settings.passwords.min_length >= 8 || settings.passwords.block_common,
        },
    ]), [settings]);

    const enabledCount = statusItems.filter((item) => item.enabled).length;

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>Hardening</h1>
                    <p>Lock down core WordPress settings and enforce best practices.</p>
                </div>
                <button type="button" className="button ghost">View Recommendations</button>
            </div>

            <SubTabs tabs={hardeningTabs} activeTab={activeTab} onChange={setActiveTab} ariaLabel="Hardening sections" />

            <div className="page-body two-column">
                <section className="panel">
                    {activeTab === 'general' ? (
                        <form className="settings-form">
                            <div className="settings-row">
                                <div className="settings-label">
                                    <label htmlFor="xmlrpc">XML-RPC Access</label>
                                    <p className="settings-help">Control legacy XML-RPC endpoints and pingbacks.</p>
                                </div>
                                <div className="settings-control">
                                    <div className="radio-group">
                                        <label>
                                            <input
                                                type="radio"
                                                name="xmlrpc"
                                                value="disable"
                                                checked={settings.general.xmlrpc_mode === 'disable'}
                                                onChange={() => updateGeneral('xmlrpc_mode', 'disable')}
                                                disabled={isLoading || isSaving}
                                            />
                                            Disable completely
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="xmlrpc"
                                                value="pingbacks"
                                                checked={settings.general.xmlrpc_mode === 'pingbacks'}
                                                onChange={() => updateGeneral('xmlrpc_mode', 'pingbacks')}
                                                disabled={isLoading || isSaving}
                                            />
                                            Disable pingbacks only
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="xmlrpc"
                                                value="allow"
                                                checked={settings.general.xmlrpc_mode === 'allow'}
                                                onChange={() => updateGeneral('xmlrpc_mode', 'allow')}
                                                disabled={isLoading || isSaving}
                                            />
                                            Allow all
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="settings-row">
                                <div className="settings-label">
                                    <label htmlFor="file-editor">File Editor in Admin</label>
                                    <p className="settings-help">Disables the Theme/Plugin file editor to prevent code injection.</p>
                                </div>
                                <div className="settings-control">
                                    <label className="toggle">
                                        <input
                                            id="file-editor"
                                            type="checkbox"
                                            checked={settings.general.disable_file_editor}
                                            onChange={(event) => updateGeneral('disable_file_editor', event.target.checked)}
                                            disabled={isLoading || isSaving}
                                        />
                                        <span className="toggle-track" />
                                        <span className="toggle-text">Protected</span>
                                    </label>
                                </div>
                            </div>

                            <div className="settings-row">
                                <div className="settings-label">
                                    <label htmlFor="login-attempts">Limit Login Attempts</label>
                                    <p className="settings-help">Block IPs after repeated failed logins.</p>
                                </div>
                                <div className="settings-control">
                                    <input
                                        id="login-attempts"
                                        type="number"
                                        min="0"
                                        value={settings.general.limit_login_attempts}
                                        onChange={(event) => updateGeneral('limit_login_attempts', Number(event.target.value))}
                                        disabled={isLoading || isSaving}
                                    />
                                </div>
                            </div>

                            <div className="settings-row">
                                <div className="settings-label">
                                    <label htmlFor="hide-version">Obscurity</label>
                                    <p className="settings-help">Remove the WordPress version from source code and feeds.</p>
                                </div>
                                <div className="settings-control">
                                    <label className="checkbox">
                                        <input
                                            id="hide-version"
                                            type="checkbox"
                                            checked={settings.general.hide_wp_version}
                                            onChange={(event) => updateGeneral('hide_wp_version', event.target.checked)}
                                            disabled={isLoading || isSaving}
                                        />
                                        Hide WP version
                                    </label>
                                </div>
                            </div>

                            <div className="form-footer">
                                <button
                                    type="button"
                                    className="button primary"
                                    onClick={() => saveSettings()}
                                    disabled={isLoading || isSaving}
                                >
                                    {isSaving ? 'Saving...' : 'Save Hardening Rules'}
                                </button>
                                <span className="muted">Last saved {formatDate(settings.updated_at)}.</span>
                                {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
                            </div>
                        </form>
                    ) : null}
                    {activeTab === 'rest' ? (
                        <form className="settings-form">
                            <div className="settings-row">
                                <div className="settings-label">
                                    <label htmlFor="rest-access">REST API Access</label>
                                    <p className="settings-help">Define who can access REST API endpoints.</p>
                                </div>
                                <div className="settings-control">
                                    <div className="radio-group">
                                        <label>
                                            <input
                                                type="radio"
                                                name="rest-access"
                                                value="open"
                                                checked={settings.rest.access === 'open'}
                                                onChange={() => updateRest('access', 'open')}
                                                disabled={isLoading || isSaving}
                                            />
                                            Allow public access
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="rest-access"
                                                value="authenticated"
                                                checked={settings.rest.access === 'authenticated'}
                                                onChange={() => updateRest('access', 'authenticated')}
                                                disabled={isLoading || isSaving}
                                            />
                                            Authenticated users only
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="rest-access"
                                                value="restricted"
                                                checked={settings.rest.access === 'restricted'}
                                                onChange={() => updateRest('access', 'restricted')}
                                                disabled={isLoading || isSaving}
                                            />
                                            Restricted by role
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="settings-row">
                                <div className="settings-label">
                                    <label htmlFor="rest-roles">Allowed Roles</label>
                                    <p className="settings-help">Comma-separated roles allowed when access is restricted.</p>
                                </div>
                                <div className="settings-control">
                                    <input
                                        id="rest-roles"
                                        type="text"
                                        placeholder="administrator, editor"
                                        value={restRolesInput}
                                        onChange={(event) => setRestRolesInput(event.target.value)}
                                        disabled={isLoading || isSaving || settings.rest.access !== 'restricted'}
                                    />
                                </div>
                            </div>

                            <div className="settings-row">
                                <div className="settings-label">
                                    <label htmlFor="rest-allowlist">Allowlisted Routes</label>
                                    <p className="settings-help">Comma-separated REST route prefixes that stay public.</p>
                                </div>
                                <div className="settings-control">
                                    <input
                                        id="rest-allowlist"
                                        type="text"
                                        placeholder="/wp/v2/, /oembed/1.0/"
                                        value={restAllowlistInput}
                                        onChange={(event) => setRestAllowlistInput(event.target.value)}
                                        disabled={isLoading || isSaving}
                                    />
                                </div>
                            </div>

                            <div className="form-footer">
                                <button
                                    type="button"
                                    className="button primary"
                                    onClick={() => saveSettings()}
                                    disabled={isLoading || isSaving}
                                >
                                    {isSaving ? 'Saving...' : 'Save REST API Rules'}
                                </button>
                                <span className="muted">Last saved {formatDate(settings.updated_at)}.</span>
                                {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
                            </div>
                        </form>
                    ) : null}
                    {activeTab === 'passwords' ? (
                        <form className="settings-form">
                            <div className="settings-row">
                                <div className="settings-label">
                                    <label htmlFor="min-length">Minimum Password Length</label>
                                    <p className="settings-help">Enforce a stronger baseline for all accounts.</p>
                                </div>
                                <div className="settings-control">
                                    <input
                                        id="min-length"
                                        type="number"
                                        min="6"
                                        value={settings.passwords.min_length}
                                        onChange={(event) => updatePasswords('min_length', Number(event.target.value))}
                                        disabled={isLoading || isSaving}
                                    />
                                </div>
                            </div>

                            <div className="settings-row">
                                <div className="settings-label">
                                    <label>Complexity Requirements</label>
                                    <p className="settings-help">Require specific character types in passwords.</p>
                                </div>
                                <div className="settings-control">
                                    <div className="checkbox-group">
                                        <label className="checkbox">
                                            <input
                                                type="checkbox"
                                                checked={settings.passwords.require_upper}
                                                onChange={(event) => updatePasswords('require_upper', event.target.checked)}
                                                disabled={isLoading || isSaving}
                                            />
                                            Uppercase letters
                                        </label>
                                        <label className="checkbox">
                                            <input
                                                type="checkbox"
                                                checked={settings.passwords.require_lower}
                                                onChange={(event) => updatePasswords('require_lower', event.target.checked)}
                                                disabled={isLoading || isSaving}
                                            />
                                            Lowercase letters
                                        </label>
                                        <label className="checkbox">
                                            <input
                                                type="checkbox"
                                                checked={settings.passwords.require_number}
                                                onChange={(event) => updatePasswords('require_number', event.target.checked)}
                                                disabled={isLoading || isSaving}
                                            />
                                            Numbers
                                        </label>
                                        <label className="checkbox">
                                            <input
                                                type="checkbox"
                                                checked={settings.passwords.require_special}
                                                onChange={(event) => updatePasswords('require_special', event.target.checked)}
                                                disabled={isLoading || isSaving}
                                            />
                                            Special characters
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="settings-row">
                                <div className="settings-label">
                                    <label htmlFor="block-common">Common Passwords</label>
                                    <p className="settings-help">Reject commonly used passwords and obvious patterns.</p>
                                </div>
                                <div className="settings-control">
                                    <label className="toggle">
                                        <input
                                            id="block-common"
                                            type="checkbox"
                                            checked={settings.passwords.block_common}
                                            onChange={(event) => updatePasswords('block_common', event.target.checked)}
                                            disabled={isLoading || isSaving}
                                        />
                                        <span className="toggle-track" />
                                        <span className="toggle-text">Blocked</span>
                                    </label>
                                </div>
                            </div>

                            <div className="form-footer">
                                <button
                                    type="button"
                                    className="button primary"
                                    onClick={() => saveSettings()}
                                    disabled={isLoading || isSaving}
                                >
                                    {isSaving ? 'Saving...' : 'Save Password Policy'}
                                </button>
                                <span className="muted">Last saved {formatDate(settings.updated_at)}.</span>
                                {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
                            </div>
                        </form>
                    ) : null}
                    {activeTab === 'export' ? (
                        <div className="settings-form">
                            <div className="settings-row">
                                <div className="settings-label">
                                    <label>Export Configuration</label>
                                    <p className="settings-help">Download your hardening settings for backup or migration.</p>
                                </div>
                                <div className="settings-control">
                                    <button
                                        type="button"
                                        className="button primary"
                                        onClick={exportConfig}
                                        disabled={isExporting}
                                    >
                                        {isExporting ? 'Exporting...' : 'Export Config'}
                                    </button>
                                </div>
                            </div>
                            <div className="settings-row">
                                <div className="settings-label">
                                    <label>Configuration Preview</label>
                                    <p className="settings-help">Review what will be exported.</p>
                                </div>
                                <div className="settings-control">
                                    <pre className="config-preview">{JSON.stringify(settings, null, 2)}</pre>
                                </div>
                            </div>
                            {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <h3>{hardeningTabs.find((tab) => tab.id === activeTab).label}</h3>
                            <p>Configure advanced policies for this area. Connect data via the REST API when ready.</p>
                            <button type="button" className="button ghost">Add Configuration</button>
                        </div>
                    )}
                </section>
                <aside className="side-panel">
                    <div className="side-card">
                        <h3>Hardening Status</h3>
                        <p className="muted">{enabledCount} of {statusItems.length} protections enabled.</p>
                        <ul className="status-list">
                            {statusItems.map((item) => (
                                <li key={item.label}>
                                    <span className={`status-dot ${item.enabled ? 'success' : 'warning'}`} />
                                    {item.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="side-card highlight">
                        <h3>Quick Wins</h3>
                        <p className="muted">Enable two more rules to reach 90% hardening.</p>
                        <button
                            type="button"
                            className="button primary"
                            onClick={applyDefaults}
                            disabled={isSaving || isLoading}
                        >
                            Apply Defaults
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Hardening;
