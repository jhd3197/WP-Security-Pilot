const MATOMO_SCRIPT_ID = 'saman-security-matomo';

const normalizeBaseUrl = (url = '') => {
    if (!url) {
        return '';
    }

    return url.endsWith('/') ? url : `${url}/`;
};

const getAnalyticsConfig = (override = {}) => {
    if (typeof window === 'undefined') {
        return override;
    }

    const base = window.samanSecuritySettings?.analytics || {};
    return { ...base, ...override };
};

export const initMatomo = (override = {}) => {
    if (typeof window === 'undefined') {
        return;
    }

    const config = getAnalyticsConfig(override);
    if (!config.enabled || !config.matomoUrl || !config.siteId) {
        return;
    }

    if (window._ssMatomoInitialized) {
        return;
    }

    window._ssMatomoInitialized = true;

    const baseUrl = normalizeBaseUrl(config.matomoUrl);
    const queue = window._paq || [];
    window._paq = queue;

    queue.push(['disableCookies']);
    queue.push(['setTrackerUrl', `${baseUrl}matomo.php`]);
    queue.push(['setSiteId', String(config.siteId)]);
    queue.push(['setReferrerUrl', '']);

    if (config.siteHash) {
        queue.push(['setUserId', config.siteHash]);
    }

    if (config.pluginVersion) {
        queue.push(['setCustomVariable', 1, 'PluginVersion', config.pluginVersion, 'visit']);
    }

    if (!document.getElementById(MATOMO_SCRIPT_ID)) {
        const script = document.createElement('script');
        script.id = MATOMO_SCRIPT_ID;
        script.async = true;
        script.src = `${baseUrl}matomo.js`;
        document.head.appendChild(script);
    }
};

export const setAnalyticsEnabled = (enabled, override = {}) => {
    if (typeof window === 'undefined') {
        return;
    }

    window._ssMatomoDisabled = !enabled;

    if (!enabled) {
        return;
    }

    initMatomo({ ...override, enabled });
};

export const trackPageView = (path, title) => {
    if (typeof window === 'undefined' || window._ssMatomoDisabled) {
        return;
    }

    const queue = window._paq;
    if (!queue) {
        return;
    }

    if (path) {
        queue.push(['setCustomUrl', path]);
    }

    if (title) {
        queue.push(['setDocumentTitle', title]);
    }

    queue.push(['trackPageView']);
};
