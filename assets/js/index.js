/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/App.js"
/*!********************!*\
  !*** ./src/App.js ***!
  \********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_Header__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/Header */ "./src/components/Header.js");
/* harmony import */ var _pages_Dashboard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pages/Dashboard */ "./src/pages/Dashboard.js");
/* harmony import */ var _pages_Firewall__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pages/Firewall */ "./src/pages/Firewall.js");
/* harmony import */ var _pages_Hardening__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pages/Hardening */ "./src/pages/Hardening.js");
/* harmony import */ var _pages_Scanner__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./pages/Scanner */ "./src/pages/Scanner.js");
/* harmony import */ var _pages_ActivityLog__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./pages/ActivityLog */ "./src/pages/ActivityLog.js");
/* harmony import */ var _pages_Settings__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./pages/Settings */ "./src/pages/Settings.js");
/* harmony import */ var _pages_More__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./pages/More */ "./src/pages/More.js");










const viewToPage = {
  dashboard: 'wp-security-pilot-dashboard',
  firewall: 'wp-security-pilot-firewall',
  scanner: 'wp-security-pilot-scanner',
  hardening: 'wp-security-pilot-hardening',
  activity: 'wp-security-pilot-activity',
  settings: 'wp-security-pilot-settings',
  more: 'wp-security-pilot-more'
};
const pageToView = Object.entries(viewToPage).reduce((acc, [view, page]) => {
  acc[page] = view;
  return acc;
}, {});
const App = ({
  initialView = 'dashboard'
}) => {
  const [currentView, setCurrentView] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(initialView);
  const updateAdminMenuHighlight = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(view => {
    if (typeof document === 'undefined') {
      return;
    }
    const menu = document.getElementById('toplevel_page_wp-security-pilot');
    if (!menu) {
      return;
    }
    const submenuLinks = menu.querySelectorAll('.wp-submenu a[href*="page=wp-security-pilot"]');
    submenuLinks.forEach(link => {
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
  const handleNavigate = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(view => {
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
  }, [currentView, updateAdminMenuHighlight]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
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
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    updateAdminMenuHighlight(currentView);
  }, [currentView, updateAdminMenuHighlight]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const handleMenuClick = event => {
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
        return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_pages_Firewall__WEBPACK_IMPORTED_MODULE_3__["default"], null);
      case 'hardening':
        return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_pages_Hardening__WEBPACK_IMPORTED_MODULE_4__["default"], null);
      case 'scanner':
        return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_pages_Scanner__WEBPACK_IMPORTED_MODULE_5__["default"], null);
      case 'activity':
        return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_pages_ActivityLog__WEBPACK_IMPORTED_MODULE_6__["default"], null);
      case 'settings':
        return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_pages_Settings__WEBPACK_IMPORTED_MODULE_7__["default"], null);
      case 'more':
        return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_pages_More__WEBPACK_IMPORTED_MODULE_8__["default"], null);
      default:
        return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_pages_Dashboard__WEBPACK_IMPORTED_MODULE_2__["default"], null);
    }
  };
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wp-security-pilot-admin"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wp-security-pilot-shell"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_Header__WEBPACK_IMPORTED_MODULE_1__["default"], {
    currentView: currentView,
    onNavigate: handleNavigate
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "content-area"
  }, renderView())));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (App);

/***/ },

/***/ "./src/components/Header.js"
/*!**********************************!*\
  !*** ./src/components/Header.js ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const navItems = [{
  id: 'dashboard',
  label: 'Dashboard'
}, {
  id: 'firewall',
  label: 'Firewall'
}, {
  id: 'scanner',
  label: 'Scanner'
}, {
  id: 'hardening',
  label: 'Hardening'
}, {
  id: 'activity',
  label: 'Activity Log'
}, {
  id: 'settings',
  label: 'Settings'
}, {
  id: 'more',
  label: 'More'
}];
const Header = ({
  currentView,
  onNavigate
}) => {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("header", {
    className: "top-bar"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "brand"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "brand-icon",
    "aria-hidden": "true"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    viewBox: "0 0 24 24",
    role: "img",
    focusable: "false",
    preserveAspectRatio: "xMidYMid meet"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M12 2L4 5.4v6.2c0 5.1 3.4 9.7 8 10.4 4.6-.7 8-5.3 8-10.4V5.4L12 2zm0 2.2l6 2.3v5.1c0 4-2.5 7.6-6 8.3-3.5-.7-6-4.3-6-8.3V6.5l6-2.3z"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M10.5 12.7l-2-2-1.3 1.3 3.3 3.3 5.3-5.3-1.3-1.3-4 4z"
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "brand-name"
  }, "WP Security Pilot")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("nav", {
    className: "main-nav",
    "aria-label": "Primary"
  }, navItems.map(item => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    key: item.id,
    type: "button",
    className: `nav-tab ${currentView === item.id ? 'is-active' : ''}`,
    "aria-current": currentView === item.id ? 'page' : undefined,
    onClick: () => onNavigate(item.id)
  }, item.label))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "nav-actions"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    className: "icon-button",
    href: "https://github.com/jhd3197/WP-Security-Pilot",
    target: "_blank",
    rel: "noreferrer",
    "aria-label": "Open GitHub repository"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    viewBox: "0 0 24 24",
    role: "img",
    focusable: "false"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M12 2C6.5 2 2 6.6 2 12.3c0 4.6 2.9 8.5 6.9 9.9.5.1.7-.2.7-.5v-1.9c-2.8.6-3.3-1.2-3.3-1.2-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 .1.7 1.7 2.6 1.2.1-.8.4-1.2.7-1.5-2.2-.2-4.5-1.2-4.5-5.2 0-1.1.4-2 1-2.7-.1-.2-.4-1.3.1-2.7 0 0 .8-.2 2.7 1a9.2 9.2 0 0 1 4.9 0c1.9-1.2 2.7-1 2.7-1 .5 1.4.2 2.5.1 2.7.6.7 1 1.6 1 2.7 0 4-2.3 5-4.5 5.2.4.3.8 1 .8 2.1v3c0 .3.2.6.7.5 4-1.4 6.9-5.3 6.9-9.9C22 6.6 17.5 2 12 2z"
  })))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Header);

/***/ },

/***/ "./src/components/SubTabs.js"
/*!***********************************!*\
  !*** ./src/components/SubTabs.js ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const SubTabs = ({
  tabs,
  activeTab,
  onChange,
  ariaLabel
}) => {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "sub-tabs",
    role: "tablist",
    "aria-label": ariaLabel
  }, tabs.map(tab => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    key: tab.id,
    type: "button",
    role: "tab",
    className: `sub-tab ${activeTab === tab.id ? 'is-active' : ''}`,
    "aria-selected": activeTab === tab.id,
    onClick: () => onChange(tab.id)
  }, tab.label)));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SubTabs);

/***/ },

/***/ "./src/hooks/useUrlTab.js"
/*!********************************!*\
  !*** ./src/hooks/useUrlTab.js ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const getTabFromUrl = (tabs, defaultTab, paramName) => {
  if (typeof window === 'undefined') {
    return defaultTab;
  }
  const url = new URL(window.location.href);
  const tab = url.searchParams.get(paramName);
  if (tab && tabs.some(item => item.id === tab)) {
    return tab;
  }
  return defaultTab;
};
const useUrlTab = ({
  tabs,
  defaultTab,
  paramName = 'tab'
}) => {
  const [activeTab, setActiveTab] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(() => getTabFromUrl(tabs, defaultTab, paramName));
  const updateTab = tabId => {
    if (!tabs.some(item => item.id === tabId)) {
      return;
    }
    setActiveTab(tabId);
    if (typeof window === 'undefined') {
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.set(paramName, tabId);
    window.history.replaceState({}, '', url.toString());
  };
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const handlePopState = () => {
      setActiveTab(getTabFromUrl(tabs, defaultTab, paramName));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [tabs, defaultTab, paramName]);
  return [activeTab, updateTab];
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useUrlTab);

/***/ },

/***/ "./src/index.css"
/*!***********************!*\
  !*** ./src/index.css ***!
  \***********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./src/pages/ActivityLog.js"
/*!**********************************!*\
  !*** ./src/pages/ActivityLog.js ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);



const ActivityLog = () => {
  const [logs, setLogs] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)([]);
  const [isLoading, setIsLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(true);
  const [filterValue, setFilterValue] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)('');
  const [activeFilter, setActiveFilter] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)('');
  const [errorMessage, setErrorMessage] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)('');
  const [isExporting, setIsExporting] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
  const fetchLogs = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useCallback)(async search => {
    setIsLoading(true);
    setErrorMessage('');
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    try {
      const data = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
        path: `/wp-security-pilot/v1/activity/logs${query}`
      });
      setLogs(Array.isArray(data) ? data : []);
    } catch (error) {
      setErrorMessage(error?.message || 'Unable to load activity logs.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    fetchLogs(activeFilter);
  }, [activeFilter, fetchLogs]);
  const formatDate = dateString => {
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
  const formatEventType = eventType => {
    switch (eventType) {
      case 'blocked':
        return {
          label: 'Blocked',
          className: 'danger'
        };
      case 'alert':
        return {
          label: 'Alert',
          className: 'warning'
        };
      case 'allowed':
        return {
          label: 'Allowed',
          className: 'success'
        };
      default:
        return {
          label: 'Info',
          className: ''
        };
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
      const response = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
        path: `/wp-security-pilot/v1/activity/logs/export${query}`,
        parse: false
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'wp-security-pilot-activity-log.csv';
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
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "page"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "page-header"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h1", null, "Activity Log"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Review recent security events and administrative actions.")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "button ghost",
    onClick: exportLogs,
    disabled: isExporting
  }, isExporting ? 'Exporting...' : 'Export Logs')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("section", {
    className: "panel"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "table-toolbar"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, "Recent Events"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "muted"
  }, "Latest 24 hours")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "inline-form"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "text",
    placeholder: "Filter by user or IP",
    value: filterValue,
    onChange: event => setFilterValue(event.target.value),
    onKeyDown: event => {
      if (event.key === 'Enter') {
        applyFilter();
      }
    }
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "button",
    onClick: applyFilter
  }, "Apply Filter"), errorMessage ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "form-error"
  }, errorMessage) : null)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("table", {
    className: "data-table"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("thead", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", null, "Event"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", null, "User"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", null, "IP"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", null, "Time"))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tbody", null, isLoading ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", {
    colSpan: "4"
  }, "Loading activity logs...")) : logs.length ? logs.map(entry => {
    const eventType = formatEventType(entry.event_type);
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", {
      key: entry.id
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: `pill ${eventType.className}`
    }, eventType.label), ' ', entry.event_message), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, entry.user_name || 'Unknown'), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, entry.ip_address || '—'), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, formatDate(entry.created_at)));
  }) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", {
    colSpan: "4"
  }, "No activity recorded yet."))))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ActivityLog);

/***/ },

/***/ "./src/pages/Dashboard.js"
/*!********************************!*\
  !*** ./src/pages/Dashboard.js ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const Dashboard = () => {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "page"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "page-header"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h1", null, "Dashboard"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Security posture, recent activity, and scanner status at a glance.")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "button primary"
  }, "Run Quick Scan")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "card-grid"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "card"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "card-header"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, "Security Posture"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pill success"
  }, "85% Secure")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "gauge",
    style: {
      '--value': '85'
    }
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "gauge-center"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "gauge-value"
  }, "85%"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "gauge-label"
  }, "Good"))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "card-note"
  }, "2 hardening rules pending.")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "card"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "card-header"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, "Recent Activity"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pill warning"
  }, "7 days")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "spark-bars",
    "aria-hidden": "true"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    style: {
      height: '35%'
    }
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    style: {
      height: '48%'
    }
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    style: {
      height: '62%'
    }
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    style: {
      height: '28%'
    }
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    style: {
      height: '80%'
    }
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    style: {
      height: '54%'
    }
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    style: {
      height: '42%'
    }
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "card-note"
  }, "34 blocked attacks, trending down.")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "card"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "card-header"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, "Scanner Status"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pill success"
  }, "Healthy")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "status-row"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "status-dot success",
    "aria-hidden": "true"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "status-title"
  }, "All clear"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "status-subtitle"
  }, "Last scan: 2 hours ago"))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "card-note"
  }, "0 issues found."))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Dashboard);

/***/ },

/***/ "./src/pages/Firewall.js"
/*!*******************************!*\
  !*** ./src/pages/Firewall.js ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_SubTabs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/SubTabs */ "./src/components/SubTabs.js");
/* harmony import */ var _hooks_useUrlTab__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../hooks/useUrlTab */ "./src/hooks/useUrlTab.js");





const firewallTabs = [{
  id: 'traffic',
  label: 'Traffic Rules'
}, {
  id: 'ip',
  label: 'IP Management'
}, {
  id: 'geo',
  label: 'Geo-Blocking'
}];
const ruleTargets = [{
  value: 'GET',
  label: 'Query String (GET)'
}, {
  value: 'POST',
  label: 'Form Body (POST)'
}, {
  value: 'COOKIE',
  label: 'Cookies'
}, {
  value: 'USER_AGENT',
  label: 'User Agent'
}, {
  value: 'URL',
  label: 'Request URL'
}];
const COUNTRY_OPTIONS = [{
  code: 'AF',
  name: 'Afghanistan'
}, {
  code: 'AL',
  name: 'Albania'
}, {
  code: 'DZ',
  name: 'Algeria'
}, {
  code: 'AS',
  name: 'American Samoa'
}, {
  code: 'AD',
  name: 'Andorra'
}, {
  code: 'AO',
  name: 'Angola'
}, {
  code: 'AI',
  name: 'Anguilla'
}, {
  code: 'AQ',
  name: 'Antarctica'
}, {
  code: 'AG',
  name: 'Antigua and Barbuda'
}, {
  code: 'AR',
  name: 'Argentina'
}, {
  code: 'AM',
  name: 'Armenia'
}, {
  code: 'AW',
  name: 'Aruba'
}, {
  code: 'AU',
  name: 'Australia'
}, {
  code: 'AT',
  name: 'Austria'
}, {
  code: 'AZ',
  name: 'Azerbaijan'
}, {
  code: 'BS',
  name: 'Bahamas'
}, {
  code: 'BH',
  name: 'Bahrain'
}, {
  code: 'BD',
  name: 'Bangladesh'
}, {
  code: 'BB',
  name: 'Barbados'
}, {
  code: 'BY',
  name: 'Belarus'
}, {
  code: 'BE',
  name: 'Belgium'
}, {
  code: 'BZ',
  name: 'Belize'
}, {
  code: 'BJ',
  name: 'Benin'
}, {
  code: 'BM',
  name: 'Bermuda'
}, {
  code: 'BT',
  name: 'Bhutan'
}, {
  code: 'BO',
  name: 'Bolivia'
}, {
  code: 'BQ',
  name: 'Bonaire, Sint Eustatius and Saba'
}, {
  code: 'BA',
  name: 'Bosnia and Herzegovina'
}, {
  code: 'BW',
  name: 'Botswana'
}, {
  code: 'BV',
  name: 'Bouvet Island'
}, {
  code: 'BR',
  name: 'Brazil'
}, {
  code: 'IO',
  name: 'British Indian Ocean Territory'
}, {
  code: 'BN',
  name: 'Brunei'
}, {
  code: 'BG',
  name: 'Bulgaria'
}, {
  code: 'BF',
  name: 'Burkina Faso'
}, {
  code: 'BI',
  name: 'Burundi'
}, {
  code: 'CV',
  name: 'Cabo Verde'
}, {
  code: 'KH',
  name: 'Cambodia'
}, {
  code: 'CM',
  name: 'Cameroon'
}, {
  code: 'CA',
  name: 'Canada'
}, {
  code: 'KY',
  name: 'Cayman Islands'
}, {
  code: 'CF',
  name: 'Central African Republic'
}, {
  code: 'TD',
  name: 'Chad'
}, {
  code: 'CL',
  name: 'Chile'
}, {
  code: 'CN',
  name: 'China'
}, {
  code: 'CX',
  name: 'Christmas Island'
}, {
  code: 'CC',
  name: 'Cocos (Keeling) Islands'
}, {
  code: 'CO',
  name: 'Colombia'
}, {
  code: 'KM',
  name: 'Comoros'
}, {
  code: 'CG',
  name: 'Congo'
}, {
  code: 'CD',
  name: 'Congo, Democratic Republic of the'
}, {
  code: 'CK',
  name: 'Cook Islands'
}, {
  code: 'CR',
  name: 'Costa Rica'
}, {
  code: 'CI',
  name: "Cote d'Ivoire"
}, {
  code: 'HR',
  name: 'Croatia'
}, {
  code: 'CU',
  name: 'Cuba'
}, {
  code: 'CW',
  name: 'Curacao'
}, {
  code: 'CY',
  name: 'Cyprus'
}, {
  code: 'CZ',
  name: 'Czechia'
}, {
  code: 'DK',
  name: 'Denmark'
}, {
  code: 'DJ',
  name: 'Djibouti'
}, {
  code: 'DM',
  name: 'Dominica'
}, {
  code: 'DO',
  name: 'Dominican Republic'
}, {
  code: 'EC',
  name: 'Ecuador'
}, {
  code: 'EG',
  name: 'Egypt'
}, {
  code: 'SV',
  name: 'El Salvador'
}, {
  code: 'GQ',
  name: 'Equatorial Guinea'
}, {
  code: 'ER',
  name: 'Eritrea'
}, {
  code: 'EE',
  name: 'Estonia'
}, {
  code: 'SZ',
  name: 'Eswatini'
}, {
  code: 'ET',
  name: 'Ethiopia'
}, {
  code: 'FK',
  name: 'Falkland Islands (Malvinas)'
}, {
  code: 'FO',
  name: 'Faroe Islands'
}, {
  code: 'FJ',
  name: 'Fiji'
}, {
  code: 'FI',
  name: 'Finland'
}, {
  code: 'FR',
  name: 'France'
}, {
  code: 'GF',
  name: 'French Guiana'
}, {
  code: 'PF',
  name: 'French Polynesia'
}, {
  code: 'TF',
  name: 'French Southern Territories'
}, {
  code: 'GA',
  name: 'Gabon'
}, {
  code: 'GM',
  name: 'Gambia'
}, {
  code: 'GE',
  name: 'Georgia'
}, {
  code: 'DE',
  name: 'Germany'
}, {
  code: 'GH',
  name: 'Ghana'
}, {
  code: 'GI',
  name: 'Gibraltar'
}, {
  code: 'GR',
  name: 'Greece'
}, {
  code: 'GL',
  name: 'Greenland'
}, {
  code: 'GD',
  name: 'Grenada'
}, {
  code: 'GP',
  name: 'Guadeloupe'
}, {
  code: 'GU',
  name: 'Guam'
}, {
  code: 'GT',
  name: 'Guatemala'
}, {
  code: 'GG',
  name: 'Guernsey'
}, {
  code: 'GN',
  name: 'Guinea'
}, {
  code: 'GW',
  name: 'Guinea-Bissau'
}, {
  code: 'GY',
  name: 'Guyana'
}, {
  code: 'HT',
  name: 'Haiti'
}, {
  code: 'HM',
  name: 'Heard Island and McDonald Islands'
}, {
  code: 'VA',
  name: 'Holy See'
}, {
  code: 'HN',
  name: 'Honduras'
}, {
  code: 'HK',
  name: 'Hong Kong'
}, {
  code: 'HU',
  name: 'Hungary'
}, {
  code: 'IS',
  name: 'Iceland'
}, {
  code: 'IN',
  name: 'India'
}, {
  code: 'ID',
  name: 'Indonesia'
}, {
  code: 'IR',
  name: 'Iran'
}, {
  code: 'IQ',
  name: 'Iraq'
}, {
  code: 'IE',
  name: 'Ireland'
}, {
  code: 'IM',
  name: 'Isle of Man'
}, {
  code: 'IL',
  name: 'Israel'
}, {
  code: 'IT',
  name: 'Italy'
}, {
  code: 'JM',
  name: 'Jamaica'
}, {
  code: 'JP',
  name: 'Japan'
}, {
  code: 'JE',
  name: 'Jersey'
}, {
  code: 'JO',
  name: 'Jordan'
}, {
  code: 'KZ',
  name: 'Kazakhstan'
}, {
  code: 'KE',
  name: 'Kenya'
}, {
  code: 'KI',
  name: 'Kiribati'
}, {
  code: 'KP',
  name: 'Korea, North'
}, {
  code: 'KR',
  name: 'Korea, South'
}, {
  code: 'KW',
  name: 'Kuwait'
}, {
  code: 'KG',
  name: 'Kyrgyzstan'
}, {
  code: 'LA',
  name: 'Laos'
}, {
  code: 'LV',
  name: 'Latvia'
}, {
  code: 'LB',
  name: 'Lebanon'
}, {
  code: 'LS',
  name: 'Lesotho'
}, {
  code: 'LR',
  name: 'Liberia'
}, {
  code: 'LY',
  name: 'Libya'
}, {
  code: 'LI',
  name: 'Liechtenstein'
}, {
  code: 'LT',
  name: 'Lithuania'
}, {
  code: 'LU',
  name: 'Luxembourg'
}, {
  code: 'MO',
  name: 'Macao'
}, {
  code: 'MG',
  name: 'Madagascar'
}, {
  code: 'MW',
  name: 'Malawi'
}, {
  code: 'MY',
  name: 'Malaysia'
}, {
  code: 'MV',
  name: 'Maldives'
}, {
  code: 'ML',
  name: 'Mali'
}, {
  code: 'MT',
  name: 'Malta'
}, {
  code: 'MH',
  name: 'Marshall Islands'
}, {
  code: 'MQ',
  name: 'Martinique'
}, {
  code: 'MR',
  name: 'Mauritania'
}, {
  code: 'MU',
  name: 'Mauritius'
}, {
  code: 'YT',
  name: 'Mayotte'
}, {
  code: 'MX',
  name: 'Mexico'
}, {
  code: 'FM',
  name: 'Micronesia'
}, {
  code: 'MD',
  name: 'Moldova'
}, {
  code: 'MC',
  name: 'Monaco'
}, {
  code: 'MN',
  name: 'Mongolia'
}, {
  code: 'ME',
  name: 'Montenegro'
}, {
  code: 'MS',
  name: 'Montserrat'
}, {
  code: 'MA',
  name: 'Morocco'
}, {
  code: 'MZ',
  name: 'Mozambique'
}, {
  code: 'MM',
  name: 'Myanmar'
}, {
  code: 'NA',
  name: 'Namibia'
}, {
  code: 'NR',
  name: 'Nauru'
}, {
  code: 'NP',
  name: 'Nepal'
}, {
  code: 'NL',
  name: 'Netherlands'
}, {
  code: 'NC',
  name: 'New Caledonia'
}, {
  code: 'NZ',
  name: 'New Zealand'
}, {
  code: 'NI',
  name: 'Nicaragua'
}, {
  code: 'NE',
  name: 'Niger'
}, {
  code: 'NG',
  name: 'Nigeria'
}, {
  code: 'NU',
  name: 'Niue'
}, {
  code: 'NF',
  name: 'Norfolk Island'
}, {
  code: 'MK',
  name: 'North Macedonia'
}, {
  code: 'MP',
  name: 'Northern Mariana Islands'
}, {
  code: 'NO',
  name: 'Norway'
}, {
  code: 'OM',
  name: 'Oman'
}, {
  code: 'PK',
  name: 'Pakistan'
}, {
  code: 'PW',
  name: 'Palau'
}, {
  code: 'PS',
  name: 'Palestine'
}, {
  code: 'PA',
  name: 'Panama'
}, {
  code: 'PG',
  name: 'Papua New Guinea'
}, {
  code: 'PY',
  name: 'Paraguay'
}, {
  code: 'PE',
  name: 'Peru'
}, {
  code: 'PH',
  name: 'Philippines'
}, {
  code: 'PN',
  name: 'Pitcairn'
}, {
  code: 'PL',
  name: 'Poland'
}, {
  code: 'PT',
  name: 'Portugal'
}, {
  code: 'PR',
  name: 'Puerto Rico'
}, {
  code: 'QA',
  name: 'Qatar'
}, {
  code: 'RE',
  name: 'Reunion'
}, {
  code: 'RO',
  name: 'Romania'
}, {
  code: 'RU',
  name: 'Russia'
}, {
  code: 'RW',
  name: 'Rwanda'
}, {
  code: 'BL',
  name: 'Saint Barthelemy'
}, {
  code: 'SH',
  name: 'Saint Helena, Ascension and Tristan da Cunha'
}, {
  code: 'KN',
  name: 'Saint Kitts and Nevis'
}, {
  code: 'LC',
  name: 'Saint Lucia'
}, {
  code: 'MF',
  name: 'Saint Martin (French part)'
}, {
  code: 'PM',
  name: 'Saint Pierre and Miquelon'
}, {
  code: 'VC',
  name: 'Saint Vincent and the Grenadines'
}, {
  code: 'WS',
  name: 'Samoa'
}, {
  code: 'SM',
  name: 'San Marino'
}, {
  code: 'ST',
  name: 'Sao Tome and Principe'
}, {
  code: 'SA',
  name: 'Saudi Arabia'
}, {
  code: 'SN',
  name: 'Senegal'
}, {
  code: 'RS',
  name: 'Serbia'
}, {
  code: 'SC',
  name: 'Seychelles'
}, {
  code: 'SL',
  name: 'Sierra Leone'
}, {
  code: 'SG',
  name: 'Singapore'
}, {
  code: 'SX',
  name: 'Sint Maarten (Dutch part)'
}, {
  code: 'SK',
  name: 'Slovakia'
}, {
  code: 'SI',
  name: 'Slovenia'
}, {
  code: 'SB',
  name: 'Solomon Islands'
}, {
  code: 'SO',
  name: 'Somalia'
}, {
  code: 'ZA',
  name: 'South Africa'
}, {
  code: 'GS',
  name: 'South Georgia and the South Sandwich Islands'
}, {
  code: 'SS',
  name: 'South Sudan'
}, {
  code: 'ES',
  name: 'Spain'
}, {
  code: 'LK',
  name: 'Sri Lanka'
}, {
  code: 'SD',
  name: 'Sudan'
}, {
  code: 'SR',
  name: 'Suriname'
}, {
  code: 'SJ',
  name: 'Svalbard and Jan Mayen'
}, {
  code: 'SE',
  name: 'Sweden'
}, {
  code: 'CH',
  name: 'Switzerland'
}, {
  code: 'SY',
  name: 'Syria'
}, {
  code: 'TW',
  name: 'Taiwan'
}, {
  code: 'TJ',
  name: 'Tajikistan'
}, {
  code: 'TZ',
  name: 'Tanzania'
}, {
  code: 'TH',
  name: 'Thailand'
}, {
  code: 'TL',
  name: 'Timor-Leste'
}, {
  code: 'TG',
  name: 'Togo'
}, {
  code: 'TK',
  name: 'Tokelau'
}, {
  code: 'TO',
  name: 'Tonga'
}, {
  code: 'TT',
  name: 'Trinidad and Tobago'
}, {
  code: 'TN',
  name: 'Tunisia'
}, {
  code: 'TR',
  name: 'Turkey'
}, {
  code: 'TM',
  name: 'Turkmenistan'
}, {
  code: 'TC',
  name: 'Turks and Caicos Islands'
}, {
  code: 'TV',
  name: 'Tuvalu'
}, {
  code: 'UG',
  name: 'Uganda'
}, {
  code: 'UA',
  name: 'Ukraine'
}, {
  code: 'AE',
  name: 'United Arab Emirates'
}, {
  code: 'GB',
  name: 'United Kingdom'
}, {
  code: 'US',
  name: 'United States'
}, {
  code: 'UM',
  name: 'United States Minor Outlying Islands'
}, {
  code: 'UY',
  name: 'Uruguay'
}, {
  code: 'UZ',
  name: 'Uzbekistan'
}, {
  code: 'VU',
  name: 'Vanuatu'
}, {
  code: 'VE',
  name: 'Venezuela'
}, {
  code: 'VN',
  name: 'Vietnam'
}, {
  code: 'VG',
  name: 'Virgin Islands (British)'
}, {
  code: 'VI',
  name: 'Virgin Islands (US)'
}, {
  code: 'WF',
  name: 'Wallis and Futuna'
}, {
  code: 'EH',
  name: 'Western Sahara'
}, {
  code: 'YE',
  name: 'Yemen'
}, {
  code: 'ZM',
  name: 'Zambia'
}, {
  code: 'ZW',
  name: 'Zimbabwe'
}];
const Firewall = () => {
  const [activeTab, setActiveTab] = (0,_hooks_useUrlTab__WEBPACK_IMPORTED_MODULE_4__["default"])({
    tabs: firewallTabs,
    defaultTab: 'ip'
  });
  const [blockedIps, setBlockedIps] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)([]);
  const [allowedIps, setAllowedIps] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)([]);
  const [ipListType, setIpListType] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)('block');
  const [isIpLoading, setIsIpLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(true);
  const [ipAddress, setIpAddress] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)('');
  const [reason, setReason] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)('');
  const [ipErrorMessage, setIpErrorMessage] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)('');
  const [isIpSaving, setIsIpSaving] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
  const [removingId, setRemovingId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(null);
  const [rules, setRules] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)([]);
  const [isRulesLoading, setIsRulesLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(true);
  const [rulesErrorMessage, setRulesErrorMessage] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)('');
  const [isRuleSaving, setIsRuleSaving] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
  const [togglingRuleId, setTogglingRuleId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(null);
  const [ruleForm, setRuleForm] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)({
    description: '',
    target_area: 'GET',
    pattern: ''
  });
  const [blockedCountries, setBlockedCountries] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)([]);
  const [isGeoLoading, setIsGeoLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(true);
  const [isGeoSaving, setIsGeoSaving] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
  const [geoErrorMessage, setGeoErrorMessage] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)('');
  const countryOptions = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
    return [...COUNTRY_OPTIONS].sort((a, b) => a.name.localeCompare(b.name));
  }, []);
  const fetchIpLists = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useCallback)(async () => {
    setIsIpLoading(true);
    setIpErrorMessage('');
    try {
      const [blockData, allowData] = await Promise.all([_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
        path: '/wp-security-pilot/v1/firewall/ips?list=block'
      }), _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
        path: '/wp-security-pilot/v1/firewall/ips?list=allow'
      })]);
      setBlockedIps(Array.isArray(blockData) ? blockData : []);
      setAllowedIps(Array.isArray(allowData) ? allowData : []);
    } catch (error) {
      setIpErrorMessage(error?.message || 'Unable to load IP lists.');
    } finally {
      setIsIpLoading(false);
    }
  }, []);
  const fetchRules = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useCallback)(async () => {
    setIsRulesLoading(true);
    setRulesErrorMessage('');
    try {
      const data = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
        path: '/wp-security-pilot/v1/firewall/rules'
      });
      setRules(Array.isArray(data) ? data : []);
    } catch (error) {
      setRulesErrorMessage(error?.message || 'Unable to load firewall rules.');
    } finally {
      setIsRulesLoading(false);
    }
  }, []);
  const fetchCountries = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useCallback)(async () => {
    setIsGeoLoading(true);
    setGeoErrorMessage('');
    try {
      const data = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
        path: '/wp-security-pilot/v1/firewall/countries'
      });
      setBlockedCountries(Array.isArray(data) ? data : []);
    } catch (error) {
      setGeoErrorMessage(error?.message || 'Unable to load blocked countries.');
    } finally {
      setIsGeoLoading(false);
    }
  }, []);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    fetchIpLists();
    fetchRules();
    fetchCountries();
  }, [fetchIpLists, fetchRules, fetchCountries]);
  const formatDate = dateString => {
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
  const addIp = async () => {
    if (!ipAddress.trim()) {
      setIpErrorMessage('Enter an IP address.');
      return;
    }
    setIsIpSaving(true);
    setIpErrorMessage('');
    try {
      await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
        path: '/wp-security-pilot/v1/firewall/ips',
        method: 'POST',
        data: {
          ip: ipAddress.trim(),
          reason: reason.trim(),
          list_type: ipListType
        }
      });
      setIpAddress('');
      setReason('');
      await fetchIpLists();
    } catch (error) {
      setIpErrorMessage(error?.message || 'Unable to save this IP address.');
    } finally {
      setIsIpSaving(false);
    }
  };
  const removeIp = async id => {
    setRemovingId(id);
    setIpErrorMessage('');
    try {
      await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
        path: `/wp-security-pilot/v1/firewall/ips/${id}`,
        method: 'DELETE'
      });
      await fetchIpLists();
    } catch (error) {
      setIpErrorMessage(error?.message || 'Unable to remove this IP address.');
    } finally {
      setRemovingId(null);
    }
  };
  const addRule = async () => {
    if (!ruleForm.description.trim() || !ruleForm.pattern.trim()) {
      setRulesErrorMessage('Provide a description and regex pattern for the rule.');
      return;
    }
    setIsRuleSaving(true);
    setRulesErrorMessage('');
    try {
      await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
        path: '/wp-security-pilot/v1/firewall/rules',
        method: 'POST',
        data: {
          description: ruleForm.description.trim(),
          target_area: ruleForm.target_area,
          pattern: ruleForm.pattern.trim()
        }
      });
      setRuleForm({
        description: '',
        target_area: 'GET',
        pattern: ''
      });
      await fetchRules();
    } catch (error) {
      setRulesErrorMessage(error?.message || 'Unable to create firewall rule.');
    } finally {
      setIsRuleSaving(false);
    }
  };
  const toggleRule = async rule => {
    setTogglingRuleId(rule.id);
    setRulesErrorMessage('');
    try {
      await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
        path: `/wp-security-pilot/v1/firewall/rules/${rule.id}`,
        method: 'PUT',
        data: {
          is_active: !rule.is_active
        }
      });
      await fetchRules();
    } catch (error) {
      setRulesErrorMessage(error?.message || 'Unable to update rule status.');
    } finally {
      setTogglingRuleId(null);
    }
  };
  const handleCountryChange = event => {
    const selected = Array.from(event.target.selectedOptions).map(option => option.value);
    setBlockedCountries(selected);
  };
  const saveCountries = async () => {
    setIsGeoSaving(true);
    setGeoErrorMessage('');
    try {
      await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
        path: '/wp-security-pilot/v1/firewall/countries',
        method: 'POST',
        data: {
          countries: blockedCountries
        }
      });
    } catch (error) {
      setGeoErrorMessage(error?.message || 'Unable to save blocked countries.');
    } finally {
      setIsGeoSaving(false);
    }
  };
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "page"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "page-header"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h1", null, "Firewall"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Inspect incoming traffic, manage IP access, and apply geo rules.")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "button ghost"
  }, "Review Rule Sets")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_SubTabs__WEBPACK_IMPORTED_MODULE_3__["default"], {
    tabs: firewallTabs,
    activeTab: activeTab,
    onChange: setActiveTab,
    ariaLabel: "Firewall sections"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("section", {
    className: "panel"
  }, activeTab === 'ip' ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "table-toolbar"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, "IP Management"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "muted"
  }, "Track blocked and trusted addresses.")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "inline-form"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "text",
    placeholder: "IP Address",
    value: ipAddress,
    onChange: event => setIpAddress(event.target.value),
    disabled: isIpSaving
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "text",
    placeholder: "Reason",
    value: reason,
    onChange: event => setReason(event.target.value),
    disabled: isIpSaving
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("select", {
    value: ipListType,
    onChange: event => setIpListType(event.target.value),
    disabled: isIpSaving
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("option", {
    value: "block"
  }, "Blocklist"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("option", {
    value: "allow"
  }, "Allowlist")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "button primary",
    onClick: addIp,
    disabled: isIpSaving
  }, isIpSaving ? 'Saving...' : `Add to ${ipListType === 'allow' ? 'Allowlist' : 'Blocklist'}`), ipErrorMessage ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "form-error"
  }, ipErrorMessage) : null)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h4", null, "Blocked IPs"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("table", {
    className: "data-table"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("thead", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", null, "IP Address"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", null, "Reason"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", null, "Date Added"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", null, "Action"))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tbody", null, isIpLoading ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", {
    colSpan: "4"
  }, "Loading blocked IPs...")) : blockedIps.length ? blockedIps.map(entry => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", {
    key: entry.id
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, entry.ip_address), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, entry.reason || '—'), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, formatDate(entry.created_at)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "link-button",
    onClick: () => removeIp(entry.id),
    disabled: removingId === entry.id
  }, removingId === entry.id ? 'Removing...' : 'Remove')))) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", {
    colSpan: "4"
  }, "No blocked IPs yet."))))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h4", null, "Allowed IPs"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("table", {
    className: "data-table"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("thead", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", null, "IP Address"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", null, "Reason"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", null, "Date Added"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", null, "Action"))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tbody", null, isIpLoading ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", {
    colSpan: "4"
  }, "Loading allowed IPs...")) : allowedIps.length ? allowedIps.map(entry => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", {
    key: entry.id
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, entry.ip_address), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, entry.reason || '—'), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, formatDate(entry.created_at)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "link-button",
    onClick: () => removeIp(entry.id),
    disabled: removingId === entry.id
  }, removingId === entry.id ? 'Removing...' : 'Remove')))) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", {
    colSpan: "4"
  }, "No allowed IPs yet.")))))) : null, activeTab === 'traffic' ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "table-toolbar"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, "Traffic Rules"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "muted"
  }, "Inspect incoming requests for malicious patterns.")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "inline-form"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "text",
    placeholder: "Rule description",
    value: ruleForm.description,
    onChange: event => setRuleForm(prev => ({
      ...prev,
      description: event.target.value
    })),
    disabled: isRuleSaving
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("select", {
    value: ruleForm.target_area,
    onChange: event => setRuleForm(prev => ({
      ...prev,
      target_area: event.target.value
    })),
    disabled: isRuleSaving
  }, ruleTargets.map(target => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("option", {
    key: target.value,
    value: target.value
  }, target.label))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "text",
    placeholder: "Regex pattern",
    value: ruleForm.pattern,
    onChange: event => setRuleForm(prev => ({
      ...prev,
      pattern: event.target.value
    })),
    disabled: isRuleSaving
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "button primary",
    onClick: addRule,
    disabled: isRuleSaving
  }, isRuleSaving ? 'Adding...' : 'Add Rule'), rulesErrorMessage ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "form-error"
  }, rulesErrorMessage) : null)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("table", {
    className: "data-table"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("thead", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", null, "Rule"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", null, "Target"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", null, "Pattern"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", null, "Status"))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tbody", null, isRulesLoading ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", {
    colSpan: "4"
  }, "Loading firewall rules...")) : rules.length ? rules.map(rule => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", {
    key: rule.id
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, rule.description), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, rule.target_area), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "code"
  }, rule.pattern)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    className: "toggle"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "checkbox",
    checked: !!rule.is_active,
    onChange: () => toggleRule(rule),
    disabled: togglingRuleId === rule.id
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "toggle-track"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "toggle-text"
  }, rule.is_active ? 'Active' : 'Paused'))))) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", {
    colSpan: "4"
  }, "No rules available yet."))))) : null, activeTab === 'geo' ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, "Geo-Blocking"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "muted"
  }, "Block traffic based on country of origin.")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-form"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-row"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-label"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    htmlFor: "blocked-countries"
  }, "Blocked Countries"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "settings-help"
  }, "Select the countries to block from accessing your site.")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("select", {
    id: "blocked-countries",
    multiple: true,
    value: blockedCountries,
    onChange: handleCountryChange,
    disabled: isGeoLoading || isGeoSaving
  }, countryOptions.map(country => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("option", {
    key: country.code,
    value: country.code
  }, country.name, " (", country.code, ")"))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "muted"
  }, blockedCountries.length, " countries blocked."))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "form-footer"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "button primary",
    onClick: saveCountries,
    disabled: isGeoSaving
  }, isGeoSaving ? 'Saving...' : 'Save Geo Rules'), geoErrorMessage ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "form-error"
  }, geoErrorMessage) : null))) : null));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Firewall);

/***/ },

/***/ "./src/pages/Hardening.js"
/*!********************************!*\
  !*** ./src/pages/Hardening.js ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_SubTabs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/SubTabs */ "./src/components/SubTabs.js");
/* harmony import */ var _hooks_useUrlTab__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../hooks/useUrlTab */ "./src/hooks/useUrlTab.js");





const hardeningTabs = [{
  id: 'general',
  label: 'General Hardening'
}, {
  id: 'rest',
  label: 'REST API'
}, {
  id: 'passwords',
  label: 'Password Policy'
}, {
  id: 'export',
  label: 'Export Config'
}];
const defaultSettings = {
  general: {
    xmlrpc_mode: 'disable',
    disable_file_editor: true,
    limit_login_attempts: 3,
    hide_wp_version: true
  },
  rest: {
    access: 'authenticated',
    allowed_roles: ['administrator'],
    allowlist: []
  },
  passwords: {
    min_length: 12,
    require_upper: true,
    require_lower: true,
    require_number: true,
    require_special: false,
    block_common: true
  },
  updated_at: ''
};
const Hardening = () => {
  const [activeTab, setActiveTab] = (0,_hooks_useUrlTab__WEBPACK_IMPORTED_MODULE_4__["default"])({
    tabs: hardeningTabs,
    defaultTab: 'general'
  });
  const [settings, setSettings] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(defaultSettings);
  const [restRolesInput, setRestRolesInput] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)('');
  const [restAllowlistInput, setRestAllowlistInput] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)('');
  const [isLoading, setIsLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(true);
  const [isSaving, setIsSaving] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
  const [isExporting, setIsExporting] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
  const [errorMessage, setErrorMessage] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)('');
  const fetchSettings = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useCallback)(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const data = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
        path: '/wp-security-pilot/v1/hardening'
      });
      const merged = {
        ...defaultSettings,
        ...data,
        general: {
          ...defaultSettings.general,
          ...(data?.general || {})
        },
        rest: {
          ...defaultSettings.rest,
          ...(data?.rest || {})
        },
        passwords: {
          ...defaultSettings.passwords,
          ...(data?.passwords || {})
        }
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
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    fetchSettings();
  }, [fetchSettings]);
  const updateGeneral = (key, value) => {
    setSettings(prev => ({
      ...prev,
      general: {
        ...prev.general,
        [key]: value
      }
    }));
  };
  const updateRest = (key, value) => {
    setSettings(prev => ({
      ...prev,
      rest: {
        ...prev.rest,
        [key]: value
      }
    }));
  };
  const updatePasswords = (key, value) => {
    setSettings(prev => ({
      ...prev,
      passwords: {
        ...prev.passwords,
        [key]: value
      }
    }));
  };
  const saveSettings = async overrideSettings => {
    setIsSaving(true);
    setErrorMessage('');
    const payload = overrideSettings || {
      ...settings,
      rest: {
        ...settings.rest,
        allowed_roles: restRolesInput.split(',').map(role => role.trim()).filter(Boolean),
        allowlist: restAllowlistInput.split(',').map(route => route.trim()).filter(Boolean)
      }
    };
    try {
      const data = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
        path: '/wp-security-pilot/v1/hardening',
        method: 'POST',
        data: payload
      });
      const merged = {
        ...defaultSettings,
        ...data,
        general: {
          ...defaultSettings.general,
          ...(data?.general || {})
        },
        rest: {
          ...defaultSettings.rest,
          ...(data?.rest || {})
        },
        passwords: {
          ...defaultSettings.passwords,
          ...(data?.passwords || {})
        }
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
      updated_at: settings.updated_at
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
      const response = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
        path: '/wp-security-pilot/v1/hardening/export',
        parse: false
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'wp-security-pilot-hardening.json';
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
  const formatDate = dateString => {
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
  const statusItems = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => [{
    label: 'File editor disabled',
    enabled: settings.general.disable_file_editor
  }, {
    label: 'XML-RPC blocked',
    enabled: settings.general.xmlrpc_mode === 'disable' || settings.general.xmlrpc_mode === 'pingbacks'
  }, {
    label: 'Login attempts limited',
    enabled: settings.general.limit_login_attempts > 0
  }, {
    label: 'WP version hidden',
    enabled: settings.general.hide_wp_version
  }, {
    label: 'REST API limited',
    enabled: settings.rest.access !== 'open'
  }, {
    label: 'Password policy enforced',
    enabled: settings.passwords.min_length >= 8 || settings.passwords.block_common
  }], [settings]);
  const enabledCount = statusItems.filter(item => item.enabled).length;
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "page"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "page-header"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h1", null, "Hardening"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Lock down core WordPress settings and enforce best practices.")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "button ghost"
  }, "View Recommendations")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_SubTabs__WEBPACK_IMPORTED_MODULE_3__["default"], {
    tabs: hardeningTabs,
    activeTab: activeTab,
    onChange: setActiveTab,
    ariaLabel: "Hardening sections"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "page-body two-column"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("section", {
    className: "panel"
  }, activeTab === 'general' ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("form", {
    className: "settings-form"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-row"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-label"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    htmlFor: "xmlrpc"
  }, "XML-RPC Access"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "settings-help"
  }, "Control legacy XML-RPC endpoints and pingbacks.")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "radio-group"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "radio",
    name: "xmlrpc",
    value: "disable",
    checked: settings.general.xmlrpc_mode === 'disable',
    onChange: () => updateGeneral('xmlrpc_mode', 'disable'),
    disabled: isLoading || isSaving
  }), "Disable completely"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "radio",
    name: "xmlrpc",
    value: "pingbacks",
    checked: settings.general.xmlrpc_mode === 'pingbacks',
    onChange: () => updateGeneral('xmlrpc_mode', 'pingbacks'),
    disabled: isLoading || isSaving
  }), "Disable pingbacks only"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "radio",
    name: "xmlrpc",
    value: "allow",
    checked: settings.general.xmlrpc_mode === 'allow',
    onChange: () => updateGeneral('xmlrpc_mode', 'allow'),
    disabled: isLoading || isSaving
  }), "Allow all")))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-row"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-label"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    htmlFor: "file-editor"
  }, "File Editor in Admin"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "settings-help"
  }, "Disables the Theme/Plugin file editor to prevent code injection.")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    className: "toggle"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    id: "file-editor",
    type: "checkbox",
    checked: settings.general.disable_file_editor,
    onChange: event => updateGeneral('disable_file_editor', event.target.checked),
    disabled: isLoading || isSaving
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "toggle-track"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "toggle-text"
  }, "Protected")))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-row"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-label"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    htmlFor: "login-attempts"
  }, "Limit Login Attempts"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "settings-help"
  }, "Block IPs after repeated failed logins.")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    id: "login-attempts",
    type: "number",
    min: "0",
    value: settings.general.limit_login_attempts,
    onChange: event => updateGeneral('limit_login_attempts', Number(event.target.value)),
    disabled: isLoading || isSaving
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-row"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-label"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    htmlFor: "hide-version"
  }, "Obscurity"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "settings-help"
  }, "Remove the WordPress version from source code and feeds.")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    className: "checkbox"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    id: "hide-version",
    type: "checkbox",
    checked: settings.general.hide_wp_version,
    onChange: event => updateGeneral('hide_wp_version', event.target.checked),
    disabled: isLoading || isSaving
  }), "Hide WP version"))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "form-footer"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "button primary",
    onClick: () => saveSettings(),
    disabled: isLoading || isSaving
  }, isSaving ? 'Saving...' : 'Save Hardening Rules'), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "muted"
  }, "Last saved ", formatDate(settings.updated_at), "."), errorMessage ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "form-error"
  }, errorMessage) : null)) : null, activeTab === 'rest' ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("form", {
    className: "settings-form"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-row"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-label"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    htmlFor: "rest-access"
  }, "REST API Access"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "settings-help"
  }, "Define who can access REST API endpoints.")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "radio-group"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "radio",
    name: "rest-access",
    value: "open",
    checked: settings.rest.access === 'open',
    onChange: () => updateRest('access', 'open'),
    disabled: isLoading || isSaving
  }), "Allow public access"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "radio",
    name: "rest-access",
    value: "authenticated",
    checked: settings.rest.access === 'authenticated',
    onChange: () => updateRest('access', 'authenticated'),
    disabled: isLoading || isSaving
  }), "Authenticated users only"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "radio",
    name: "rest-access",
    value: "restricted",
    checked: settings.rest.access === 'restricted',
    onChange: () => updateRest('access', 'restricted'),
    disabled: isLoading || isSaving
  }), "Restricted by role")))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-row"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-label"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    htmlFor: "rest-roles"
  }, "Allowed Roles"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "settings-help"
  }, "Comma-separated roles allowed when access is restricted.")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    id: "rest-roles",
    type: "text",
    placeholder: "administrator, editor",
    value: restRolesInput,
    onChange: event => setRestRolesInput(event.target.value),
    disabled: isLoading || isSaving || settings.rest.access !== 'restricted'
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-row"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-label"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    htmlFor: "rest-allowlist"
  }, "Allowlisted Routes"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "settings-help"
  }, "Comma-separated REST route prefixes that stay public.")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    id: "rest-allowlist",
    type: "text",
    placeholder: "/wp/v2/, /oembed/1.0/",
    value: restAllowlistInput,
    onChange: event => setRestAllowlistInput(event.target.value),
    disabled: isLoading || isSaving
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "form-footer"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "button primary",
    onClick: () => saveSettings(),
    disabled: isLoading || isSaving
  }, isSaving ? 'Saving...' : 'Save REST API Rules'), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "muted"
  }, "Last saved ", formatDate(settings.updated_at), "."), errorMessage ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "form-error"
  }, errorMessage) : null)) : null, activeTab === 'passwords' ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("form", {
    className: "settings-form"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-row"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-label"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    htmlFor: "min-length"
  }, "Minimum Password Length"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "settings-help"
  }, "Enforce a stronger baseline for all accounts.")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    id: "min-length",
    type: "number",
    min: "6",
    value: settings.passwords.min_length,
    onChange: event => updatePasswords('min_length', Number(event.target.value)),
    disabled: isLoading || isSaving
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-row"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-label"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", null, "Complexity Requirements"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "settings-help"
  }, "Require specific character types in passwords.")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "checkbox-group"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    className: "checkbox"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "checkbox",
    checked: settings.passwords.require_upper,
    onChange: event => updatePasswords('require_upper', event.target.checked),
    disabled: isLoading || isSaving
  }), "Uppercase letters"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    className: "checkbox"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "checkbox",
    checked: settings.passwords.require_lower,
    onChange: event => updatePasswords('require_lower', event.target.checked),
    disabled: isLoading || isSaving
  }), "Lowercase letters"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    className: "checkbox"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "checkbox",
    checked: settings.passwords.require_number,
    onChange: event => updatePasswords('require_number', event.target.checked),
    disabled: isLoading || isSaving
  }), "Numbers"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    className: "checkbox"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "checkbox",
    checked: settings.passwords.require_special,
    onChange: event => updatePasswords('require_special', event.target.checked),
    disabled: isLoading || isSaving
  }), "Special characters")))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-row"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-label"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    htmlFor: "block-common"
  }, "Common Passwords"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "settings-help"
  }, "Reject commonly used passwords and obvious patterns.")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    className: "toggle"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    id: "block-common",
    type: "checkbox",
    checked: settings.passwords.block_common,
    onChange: event => updatePasswords('block_common', event.target.checked),
    disabled: isLoading || isSaving
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "toggle-track"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "toggle-text"
  }, "Blocked")))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "form-footer"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "button primary",
    onClick: () => saveSettings(),
    disabled: isLoading || isSaving
  }, isSaving ? 'Saving...' : 'Save Password Policy'), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "muted"
  }, "Last saved ", formatDate(settings.updated_at), "."), errorMessage ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "form-error"
  }, errorMessage) : null)) : null, activeTab === 'export' ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-form"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-row"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-label"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", null, "Export Configuration"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "settings-help"
  }, "Download your hardening settings for backup or migration.")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "button primary",
    onClick: exportConfig,
    disabled: isExporting
  }, isExporting ? 'Exporting...' : 'Export Config'))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-row"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-label"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", null, "Configuration Preview"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "settings-help"
  }, "Review what will be exported.")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("pre", {
    className: "config-preview"
  }, JSON.stringify(settings, null, 2)))), errorMessage ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "form-error"
  }, errorMessage) : null) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "empty-state"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, hardeningTabs.find(tab => tab.id === activeTab).label), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Configure advanced policies for this area. Connect data via the REST API when ready."), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "button ghost"
  }, "Add Configuration"))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("aside", {
    className: "side-panel"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "side-card"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, "Hardening Status"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "muted"
  }, enabledCount, " of ", statusItems.length, " protections enabled."), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", {
    className: "status-list"
  }, statusItems.map(item => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    key: item.label
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: `status-dot ${item.enabled ? 'success' : 'warning'}`
  }), item.label)))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "side-card highlight"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, "Quick Wins"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "muted"
  }, "Enable two more rules to reach 90% hardening."), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "button primary",
    onClick: applyDefaults,
    disabled: isSaving || isLoading
  }, "Apply Defaults")))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Hardening);

/***/ },

/***/ "./src/pages/More.js"
/*!***************************!*\
  !*** ./src/pages/More.js ***!
  \***************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const More = () => {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "page"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "page-header"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h1", null, "More from Pilot"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Expand your security and SEO toolkit with trusted companion plugins.")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "button ghost"
  }, "View All Plugins")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pilot-grid"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pilot-card active"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pilot-card-head"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pilot-card-identity"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pilot-card-mark security",
    "aria-hidden": "true"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    viewBox: "0 0 24 24",
    role: "img",
    focusable: "false"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M12 2L4 5.4v6.2c0 5.1 3.4 9.7 8 10.4 4.6-.7 8-5.3 8-10.4V5.4L12 2zm0 2.2l6 2.3v5.1c0 4-2.5 7.6-6 8.3-3.5-.7-6-4.3-6-8.3V6.5l6-2.3z"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M10.5 12.7l-2-2-1.3 1.3 3.3 3.3 5.3-5.3-1.3-1.3-4 4z"
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pilot-card-title"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, "WP Security Pilot"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "badge success"
  }, "Installed")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "pilot-card-tagline"
  }, "Open standard security for WordPress."))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    className: "toggle"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "checkbox",
    defaultChecked: true
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "toggle-track"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "toggle-text"
  }, "Enabled"))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "pilot-card-desc"
  }, "Core security suite with firewall, scans, and hardening controls."), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pilot-card-meta"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pill success"
  }, "Active"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pill"
  }, "Version 0.0.1"))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pilot-card"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pilot-card-head"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pilot-card-identity"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pilot-card-mark seo",
    "aria-hidden": "true"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    viewBox: "0 0 24 24",
    role: "img",
    focusable: "false"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M2 3l20 9-20 9v-7l14-2-14-2V3z"
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pilot-card-title"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, "WP SEO Pilot"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "badge"
  }, "Available")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "pilot-card-tagline"
  }, "Performance-led SEO insights."))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    className: "toggle"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "checkbox"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "toggle-track"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "toggle-text"
  }, "Disabled"))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "pilot-card-desc"
  }, "Actionable SEO guidance, audits, and ranking insights."), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pilot-card-meta"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pill warning"
  }, "Not Installed"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "button primary"
  }, "Get Plugin")))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (More);

/***/ },

/***/ "./src/pages/Scanner.js"
/*!******************************!*\
  !*** ./src/pages/Scanner.js ***!
  \******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_SubTabs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/SubTabs */ "./src/components/SubTabs.js");
/* harmony import */ var _hooks_useUrlTab__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../hooks/useUrlTab */ "./src/hooks/useUrlTab.js");





const scanTabs = [{
  id: 'scan',
  label: 'Scan Now'
}, {
  id: 'schedule',
  label: 'Schedule'
}, {
  id: 'ignore',
  label: 'Ignore List'
}];
const initialJobState = {
  status: 'idle',
  progress: 0,
  message: '',
  results: [],
  started_at: '',
  completed_at: ''
};
const initialSchedule = {
  enabled: false,
  frequency: 'daily',
  time: '02:00'
};
const Scanner = () => {
  const [activeTab, setActiveTab] = (0,_hooks_useUrlTab__WEBPACK_IMPORTED_MODULE_4__["default"])({
    tabs: scanTabs,
    defaultTab: 'scan'
  });
  const [job, setJob] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(initialJobState);
  const [jobId, setJobId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(null);
  const [isStarting, setIsStarting] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
  const [isStopping, setIsStopping] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
  const [scanError, setScanError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)('');
  const [schedule, setSchedule] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(initialSchedule);
  const [isScheduleSaving, setIsScheduleSaving] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
  const [scheduleError, setScheduleError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)('');
  const [ignoreText, setIgnoreText] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)('');
  const [isIgnoreSaving, setIsIgnoreSaving] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
  const [ignoreError, setIgnoreError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)('');
  const fetchLatestStatus = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useCallback)(async () => {
    try {
      const data = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
        path: '/wp-security-pilot/v1/scanner/status'
      });
      if (data?.id) {
        setJobId(data.id);
      }
      setJob({
        ...initialJobState,
        ...data,
        results: Array.isArray(data?.results) ? data.results : []
      });
    } catch (error) {
      setScanError(error?.message || 'Unable to load scan status.');
    }
  }, []);
  const fetchStatus = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useCallback)(async id => {
    try {
      const data = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
        path: `/wp-security-pilot/v1/scanner/status/${id}`
      });
      setJob({
        ...initialJobState,
        ...data,
        results: Array.isArray(data?.results) ? data.results : []
      });
      return data;
    } catch (error) {
      setScanError(error?.message || 'Unable to refresh scan status.');
      return null;
    }
  }, []);
  const fetchSchedule = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useCallback)(async () => {
    try {
      const data = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
        path: '/wp-security-pilot/v1/scanner/schedule'
      });
      setSchedule({
        ...initialSchedule,
        ...data
      });
    } catch (error) {
      setScheduleError(error?.message || 'Unable to load schedule settings.');
    }
  }, []);
  const fetchIgnoreList = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useCallback)(async () => {
    try {
      const data = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
        path: '/wp-security-pilot/v1/scanner/ignore'
      });
      const list = Array.isArray(data) ? data : [];
      setIgnoreText(list.join('\n'));
    } catch (error) {
      setIgnoreError(error?.message || 'Unable to load ignore list.');
    }
  }, []);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    fetchLatestStatus();
    fetchSchedule();
    fetchIgnoreList();
  }, [fetchLatestStatus, fetchSchedule, fetchIgnoreList]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    if (!jobId || job.status !== 'running') {
      return undefined;
    }
    const interval = setInterval(() => {
      fetchStatus(jobId).then(data => {
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
      const data = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
        path: '/wp-security-pilot/v1/scanner/start',
        method: 'POST'
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
      await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
        path: `/wp-security-pilot/v1/scanner/stop/${jobId}`,
        method: 'POST'
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
      const data = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
        path: '/wp-security-pilot/v1/scanner/schedule',
        method: 'POST',
        data: schedule
      });
      setSchedule({
        ...initialSchedule,
        ...data
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
    const patterns = ignoreText.split('\n').map(line => line.trim()).filter(Boolean);
    try {
      const data = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
        path: '/wp-security-pilot/v1/scanner/ignore',
        method: 'POST',
        data: {
          patterns
        }
      });
      setIgnoreText((Array.isArray(data) ? data : patterns).join('\n'));
    } catch (error) {
      setIgnoreError(error?.message || 'Unable to save ignore list.');
    } finally {
      setIsIgnoreSaving(false);
    }
  };
  const renderStatusPill = status => {
    if (status === 'flagged') {
      return 'danger';
    }
    if (status === 'modified') {
      return 'warning';
    }
    return 'success';
  };
  const isRunning = job.status === 'running';
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "page"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "page-header"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h1", null, "Scanner"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Monitor file integrity, malware signatures, and core checks.")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "button ghost"
  }, "View Scan History")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_SubTabs__WEBPACK_IMPORTED_MODULE_3__["default"], {
    tabs: scanTabs,
    activeTab: activeTab,
    onChange: setActiveTab,
    ariaLabel: "Scanner sections"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("section", {
    className: "panel"
  }, activeTab === 'scan' ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "scan-layout"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "scan-action"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, "Run a manual scan"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "muted"
  }, "Check plugins, themes, and core files for changes."), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "inline-form"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "button primary",
    onClick: startScan,
    disabled: isRunning || isStarting
  }, isStarting ? 'Starting...' : 'Start New Scan'), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "button",
    onClick: stopScan,
    disabled: !isRunning || isStopping
  }, isStopping ? 'Stopping...' : 'Stop Scan'), scanError ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "form-error"
  }, scanError) : null)), isRunning && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "scan-progress"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "progress-header"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, job.message || 'Scanning files...'), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "muted"
  }, job.progress, "%")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "progress-bar"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    style: {
      width: `${job.progress}%`
    }
  }))), !isRunning && job.status !== 'idle' && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "scan-progress"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "progress-header"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, job.message || 'Scan status updated.'), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "muted"
  }, job.progress, "%")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "progress-bar"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    style: {
      width: `${job.progress}%`
    }
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "scan-results"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, "Latest Results"), job.results.length ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", {
    className: "result-list"
  }, job.results.map(result => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    key: `${result.file_path}-${result.created_at}`
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: `pill ${renderStatusPill(result.status)}`
  }, result.status), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "result-details"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, result.file_path), result.details ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "result-meta"
  }, result.details) : null)))) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "muted"
  }, "No issues detected yet."))) : null, activeTab === 'schedule' ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("form", {
    className: "settings-form"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-row"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-label"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    htmlFor: "scan-schedule"
  }, "Enable Scheduled Scans"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "settings-help"
  }, "Automatically run scans on a recurring schedule.")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    className: "toggle"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    id: "scan-schedule",
    type: "checkbox",
    checked: schedule.enabled,
    onChange: event => setSchedule(prev => ({
      ...prev,
      enabled: event.target.checked
    }))
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "toggle-track"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "toggle-text"
  }, schedule.enabled ? 'Enabled' : 'Disabled')))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-row"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-label"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    htmlFor: "scan-frequency"
  }, "Frequency"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "settings-help"
  }, "Choose how often the scan should run.")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("select", {
    id: "scan-frequency",
    value: schedule.frequency,
    onChange: event => setSchedule(prev => ({
      ...prev,
      frequency: event.target.value
    })),
    disabled: !schedule.enabled
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("option", {
    value: "daily"
  }, "Daily"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("option", {
    value: "weekly"
  }, "Weekly")))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-row"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-label"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    htmlFor: "scan-time"
  }, "Run Time"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "settings-help"
  }, "Select the local time for scheduled scans.")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    id: "scan-time",
    type: "time",
    value: schedule.time,
    onChange: event => setSchedule(prev => ({
      ...prev,
      time: event.target.value
    })),
    disabled: !schedule.enabled
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "form-footer"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "button primary",
    onClick: saveSchedule,
    disabled: isScheduleSaving
  }, isScheduleSaving ? 'Saving...' : 'Save Schedule'), scheduleError ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "form-error"
  }, scheduleError) : null)) : null, activeTab === 'ignore' ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("form", {
    className: "settings-form"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-row"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-label"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    htmlFor: "ignore-patterns"
  }, "Ignore Paths"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "settings-help"
  }, "Add one path or wildcard pattern per line.")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("textarea", {
    id: "ignore-patterns",
    value: ignoreText,
    onChange: event => setIgnoreText(event.target.value),
    placeholder: "wp-content/uploads/*.php"
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "form-footer"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "button primary",
    onClick: saveIgnoreList,
    disabled: isIgnoreSaving
  }, isIgnoreSaving ? 'Saving...' : 'Save Ignore List'), ignoreError ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "form-error"
  }, ignoreError) : null)) : null));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Scanner);

/***/ },

/***/ "./src/pages/Settings.js"
/*!*******************************!*\
  !*** ./src/pages/Settings.js ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const Settings = () => {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "page"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "page-header"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h1", null, "Settings"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Manage notifications, API keys, and global preferences.")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "button ghost"
  }, "Reset Defaults")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "page-body two-column"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("section", {
    className: "panel"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, "Notifications"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-row compact"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-label"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    htmlFor: "email-alerts"
  }, "Email Alerts"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "settings-help"
  }, "Send critical alerts to the site owner.")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    className: "toggle"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    id: "email-alerts",
    type: "checkbox",
    defaultChecked: true
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "toggle-track"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "toggle-text"
  }, "Enabled")))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-row compact"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-label"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    htmlFor: "summary-reports"
  }, "Weekly Summary"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "settings-help"
  }, "Receive a digest of security events.")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    className: "toggle"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    id: "summary-reports",
    type: "checkbox"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "toggle-track"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "toggle-text"
  }, "Disabled"))))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("aside", {
    className: "side-panel"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "side-card"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, "API Keys"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "muted"
  }, "Generate a key to connect external dashboards."), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "button primary"
  }, "Generate Key"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "key-preview"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "muted"
  }, "Key:"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "code"
  }, "wpsp_live_3fd1...d2"))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "side-card highlight"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, "Integrations"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "muted"
  }, "Connect Slack, webhooks, and custom endpoints."), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "button ghost"
  }, "Add Integration")))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Settings);

/***/ },

/***/ "@wordpress/api-fetch"
/*!**********************************!*\
  !*** external ["wp","apiFetch"] ***!
  \**********************************/
(module) {

module.exports = window["wp"]["apiFetch"];

/***/ },

/***/ "@wordpress/element"
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
(module) {

module.exports = window["wp"]["element"];

/***/ },

/***/ "react"
/*!************************!*\
  !*** external "React" ***!
  \************************/
(module) {

module.exports = window["React"];

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _App__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./App */ "./src/App.js");
/* harmony import */ var _index_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./index.css */ "./src/index.css");




const initialView = window?.wpSecurityPilotSettings?.initialView || 'dashboard';
(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.render)((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_App__WEBPACK_IMPORTED_MODULE_2__["default"], {
  initialView: initialView
}), document.getElementById('wp-security-pilot-root'));
})();

/******/ })()
;
//# sourceMappingURL=index.js.map