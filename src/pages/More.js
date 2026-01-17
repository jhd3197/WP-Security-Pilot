import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

const PluginIcon = ({ type }) => {
    switch (type) {
        case 'security':
            return (
                <svg viewBox="0 0 24 24" role="img" focusable="false">
                    <path d="M12 2L4 5.4v6.2c0 5.1 3.4 9.7 8 10.4 4.6-.7 8-5.3 8-10.4V5.4L12 2zm0 2.2l6 2.3v5.1c0 4-2.5 7.6-6 8.3-3.5-.7-6-4.3-6-8.3V6.5l6-2.3z" />
                    <path d="M10.5 12.7l-2-2-1.3 1.3 3.3 3.3 5.3-5.3-1.3-1.3-4 4z" />
                </svg>
            );
        case 'ai':
            return (
                <svg viewBox="0 0 24 24" role="img" focusable="false">
                    <path d="M21 10.5h-1.5V9h-2v1.5h-2V9h-2v1.5H12V9h-1.5v3h-2V9H6v3H4.5V9H3v6h1.5v-2.5h2V15H9v-2.5h1.5V15h2v-2.5h2V15h2v-2.5H18V15h1.5v-2.5H21V15h1.5v-6H21v1.5z" />
                    <circle cx="7.5" cy="5.5" r="1.5" />
                    <circle cx="16.5" cy="5.5" r="1.5" />
                    <circle cx="12" cy="3" r="1.5" />
                    <circle cx="7.5" cy="18.5" r="1.5" />
                    <circle cx="16.5" cy="18.5" r="1.5" />
                    <circle cx="12" cy="21" r="1.5" />
                </svg>
            );
        case 'seo':
            return (
                <svg viewBox="0 0 24 24" role="img" focusable="false">
                    <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99l1.5 1.5z" />
                    <path d="M21 3h-3v2h1.59l-4.09 4.09 1.41 1.41L21 6.41V8h2V3h-2z" />
                </svg>
            );
        default:
            return (
                <svg viewBox="0 0 24 24" role="img" focusable="false">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                </svg>
            );
    }
};

const More = () => {
    const [plugins, setPlugins] = useState({});
    const [loading, setLoading] = useState(true);
    const [checking, setChecking] = useState(false);
    const [actionLoading, setActionLoading] = useState({});
    const [betaLoading, setBetaLoading] = useState({});
    const [notice, setNotice] = useState(null);

    useEffect(() => {
        loadPlugins();
    }, []);

    const loadPlugins = async () => {
        try {
            const data = await apiFetch({ path: '/saman-security/v1/updater/plugins' });
            setPlugins(data);
        } catch (error) {
            console.error('Failed to load plugins:', error);
            setNotice({ type: 'error', message: 'Failed to load plugins' });
        } finally {
            setLoading(false);
        }
    };

    const checkForUpdates = async () => {
        setChecking(true);
        setNotice(null);
        try {
            await apiFetch({ path: '/saman-security/v1/updater/check', method: 'POST' });
            await loadPlugins();
            setNotice({ type: 'success', message: 'Update check complete' });
        } catch (error) {
            console.error('Failed to check updates:', error);
            setNotice({ type: 'error', message: 'Failed to check for updates' });
        } finally {
            setChecking(false);
        }
    };

    const handleAction = async (slug, action) => {
        setActionLoading(prev => ({ ...prev, [slug]: action }));
        setNotice(null);
        try {
            const response = await apiFetch({
                path: `/saman-security/v1/updater/${action}`,
                method: 'POST',
                data: { slug },
            });
            await loadPlugins();
            if (response.success) {
                setNotice({ type: 'success', message: response.message });
            }
        } catch (error) {
            setNotice({ type: 'error', message: `Failed to ${action} plugin: ${error.message}` });
        } finally {
            setActionLoading(prev => ({ ...prev, [slug]: null }));
        }
    };

    const handleToggleBeta = async (slug, currentEnabled) => {
        setBetaLoading(prev => ({ ...prev, [slug]: true }));
        try {
            await apiFetch({
                path: '/saman-security/v1/updater/beta',
                method: 'POST',
                data: { slug, enabled: !currentEnabled },
            });
            await loadPlugins();
        } catch (error) {
            setNotice({ type: 'error', message: 'Failed to toggle beta versions' });
        } finally {
            setBetaLoading(prev => ({ ...prev, [slug]: false }));
        }
    };

    if (loading) {
        return (
            <div className="page">
                <div className="loading">Loading plugins...</div>
            </div>
        );
    }

    return (
        <div className="page">
            {notice && (
                <div className={`notice notice-${notice.type}`}>
                    <p>{notice.message}</p>
                    <button type="button" className="notice-dismiss" onClick={() => setNotice(null)}>
                        <span className="screen-reader-text">Dismiss</span>
                    </button>
                </div>
            )}

            <div className="page-header">
                <div>
                    <h1>Pilot Plugins</h1>
                    <p>Install and manage plugins from the Pilot ecosystem.</p>
                </div>
                <button
                    type="button"
                    className="button ghost"
                    onClick={checkForUpdates}
                    disabled={checking}
                >
                    {checking ? (
                        <>
                            <span className="spinner is-active" style={{ margin: 0, marginRight: 8 }}></span>
                            Checking...
                        </>
                    ) : (
                        'Check for Updates'
                    )}
                </button>
            </div>

            <div className="pilot-grid">
                {Object.entries(plugins).map(([slug, plugin]) => {
                    const hasBetaUpdate = plugin.beta_enabled && plugin.beta_available;
                    const hasStableUpdate = plugin.update_available && !hasBetaUpdate;

                    return (
                        <div
                            key={slug}
                            className={`pilot-card ${plugin.active ? 'active' : ''} ${hasStableUpdate ? 'has-update' : ''} ${hasBetaUpdate ? 'has-beta-update' : ''}`}
                        >
                            <div className="pilot-card-head">
                                <div className="pilot-card-identity">
                                    <span className={`pilot-card-mark ${plugin.type}`} aria-hidden="true">
                                        <PluginIcon type={plugin.type} />
                                    </span>
                                    <div>
                                        <div className="pilot-card-title">
                                            <h3>{plugin.name}</h3>
                                            {plugin.installed && plugin.active && (
                                                <span className="badge success">Active</span>
                                            )}
                                            {plugin.installed && !plugin.active && (
                                                <span className="badge">Inactive</span>
                                            )}
                                            {!plugin.installed && (
                                                <span className="badge">Available</span>
                                            )}
                                            {hasStableUpdate && (
                                                <span className="badge warning">Update</span>
                                            )}
                                            {hasBetaUpdate && (
                                                <span className="badge beta">Beta Update</span>
                                            )}
                                        </div>
                                        <p className="pilot-card-version">
                                            {plugin.installed ? (
                                                hasStableUpdate ? (
                                                    <>v{plugin.current_version} → v{plugin.remote_version}</>
                                                ) : hasBetaUpdate ? (
                                                    <>v{plugin.current_version} → v{plugin.beta_version}</>
                                                ) : (
                                                    <>v{plugin.current_version}</>
                                                )
                                            ) : (
                                                plugin.remote_version ? <>v{plugin.remote_version} available</> : 'Not available'
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <p className="pilot-card-desc">{plugin.description}</p>

                            {plugin.installed && (
                                <div className="pilot-card-beta">
                                    <label className="beta-toggle">
                                        <input
                                            type="checkbox"
                                            checked={plugin.beta_enabled || false}
                                            onChange={() => handleToggleBeta(slug, plugin.beta_enabled)}
                                            disabled={betaLoading[slug]}
                                        />
                                        <span className="beta-toggle-slider"></span>
                                        <span className="beta-toggle-label">
                                            Beta versions
                                            {plugin.beta_available && !plugin.beta_enabled && (
                                                <span className="beta-available-hint"> (v{plugin.beta_version} available)</span>
                                            )}
                                        </span>
                                    </label>
                                </div>
                            )}

                            <div className="pilot-card-meta">
                                {!plugin.installed ? (
                                    <button
                                        type="button"
                                        className="button primary"
                                        onClick={() => handleAction(slug, 'install')}
                                        disabled={actionLoading[slug] === 'install' || !plugin.download_url}
                                    >
                                        {actionLoading[slug] === 'install' ? 'Installing...' : 'Get Plugin'}
                                    </button>
                                ) : (
                                    <>
                                        {hasStableUpdate && (
                                            <button
                                                type="button"
                                                className="button warning"
                                                onClick={() => handleAction(slug, 'update')}
                                                disabled={actionLoading[slug] === 'update'}
                                            >
                                                {actionLoading[slug] === 'update' ? 'Updating...' : 'Update'}
                                            </button>
                                        )}
                                        {hasBetaUpdate && (
                                            <button
                                                type="button"
                                                className="button beta"
                                                onClick={() => handleAction(slug, 'update')}
                                                disabled={actionLoading[slug] === 'update'}
                                            >
                                                {actionLoading[slug] === 'update' ? 'Installing...' : 'Install Beta'}
                                            </button>
                                        )}
                                        {plugin.active ? (
                                            <button
                                                type="button"
                                                className="button secondary"
                                                onClick={() => handleAction(slug, 'deactivate')}
                                                disabled={actionLoading[slug] === 'deactivate'}
                                            >
                                                Deactivate
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                className="button success"
                                                onClick={() => handleAction(slug, 'activate')}
                                                disabled={actionLoading[slug] === 'activate'}
                                            >
                                                {actionLoading[slug] === 'activate' ? 'Activating...' : 'Activate'}
                                            </button>
                                        )}
                                    </>
                                )}
                                <a
                                    href={plugin.github_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="button ghost"
                                >
                                    GitHub
                                </a>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default More;
