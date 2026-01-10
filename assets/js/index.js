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

const ActivityLog = () => {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "page"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "page-header"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h1", null, "Activity Log"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Review recent security events and administrative actions.")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "button ghost"
  }, "Export Logs")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("section", {
    className: "panel"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "table-toolbar"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, "Recent Events"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "muted"
  }, "Latest 24 hours")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "inline-form"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "text",
    placeholder: "Filter by user or IP"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "button"
  }, "Apply Filter"))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("table", {
    className: "data-table"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("thead", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", null, "Event"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", null, "User"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", null, "IP"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", null, "Time"))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tbody", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pill danger"
  }, "Blocked"), " Brute force attempt"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, "Unknown"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, "41.204.90.12"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, "Today, 08:52")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pill warning"
  }, "Alert"), " New admin user created"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, "jdenis"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, "173.22.30.11"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, "Today, 07:30")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pill success"
  }, "Allowed"), " Firewall rule updated"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, "jdenis"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, "173.22.30.11"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, "Yesterday, 21:18"))))));
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
/* harmony import */ var _components_SubTabs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/SubTabs */ "./src/components/SubTabs.js");
/* harmony import */ var _hooks_useUrlTab__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../hooks/useUrlTab */ "./src/hooks/useUrlTab.js");



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
const Firewall = () => {
  const [activeTab, setActiveTab] = (0,_hooks_useUrlTab__WEBPACK_IMPORTED_MODULE_2__["default"])({
    tabs: firewallTabs,
    defaultTab: 'ip'
  });
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "page"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "page-header"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h1", null, "Firewall"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Inspect incoming traffic, manage IP access, and apply geo rules.")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "button ghost"
  }, "Review Rule Sets")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_SubTabs__WEBPACK_IMPORTED_MODULE_1__["default"], {
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
    placeholder: "IP Address"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "text",
    placeholder: "Reason"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "button primary"
  }, "Add to Blacklist"))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("table", {
    className: "data-table"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("thead", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", null, "IP Address"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", null, "Reason"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", null, "Date Added"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", null, "Action"))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tbody", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, "192.168.1.33"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, "Failed Login"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, "Today, 09:14"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "link-button"
  }, "Remove"))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, "44.33.199.10"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, "WAF Rule Trigger"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, "Yesterday, 18:42"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "link-button"
  }, "Remove"))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, "81.12.60.199"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, "XML-RPC Abuse"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, "Sep 21, 12:10"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "link-button"
  }, "Remove")))))) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "empty-state"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, firewallTabs.find(tab => tab.id === activeTab).label), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Connect your rules engine to populate this section."), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "button ghost"
  }, "Add Rule"))));
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
/* harmony import */ var _components_SubTabs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/SubTabs */ "./src/components/SubTabs.js");
/* harmony import */ var _hooks_useUrlTab__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../hooks/useUrlTab */ "./src/hooks/useUrlTab.js");



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
const Hardening = () => {
  const [activeTab, setActiveTab] = (0,_hooks_useUrlTab__WEBPACK_IMPORTED_MODULE_2__["default"])({
    tabs: hardeningTabs,
    defaultTab: 'general'
  });
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "page"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "page-header"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h1", null, "Hardening"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Lock down core WordPress settings and enforce best practices.")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "button ghost"
  }, "View Recommendations")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_SubTabs__WEBPACK_IMPORTED_MODULE_1__["default"], {
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
    defaultChecked: true
  }), "Disable completely"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "radio",
    name: "xmlrpc"
  }), "Disable pingbacks only"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "radio",
    name: "xmlrpc"
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
    defaultChecked: true
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
    min: "1",
    defaultValue: "3"
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
    defaultChecked: true
  }), "Hide WP version"))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "form-footer"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "button primary"
  }, "Save Hardening Rules"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "muted"
  }, "Last saved 10 minutes ago."))) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
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
  }, "7 of 9 protections enabled."), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", {
    className: "status-list"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "status-dot success"
  }), "File editor disabled"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "status-dot success"
  }), "XML-RPC blocked"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "status-dot warning"
  }), "REST API limited"))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "side-card highlight"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, "Quick Wins"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "muted"
  }, "Enable two more rules to reach 90% hardening."), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "button primary"
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
/* harmony import */ var _components_SubTabs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/SubTabs */ "./src/components/SubTabs.js");
/* harmony import */ var _hooks_useUrlTab__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../hooks/useUrlTab */ "./src/hooks/useUrlTab.js");




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
const Scanner = () => {
  const [activeTab, setActiveTab] = (0,_hooks_useUrlTab__WEBPACK_IMPORTED_MODULE_2__["default"])({
    tabs: scanTabs,
    defaultTab: 'scan'
  });
  const [isScanning, setIsScanning] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "page"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "page-header"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h1", null, "Scanner"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Monitor file integrity, malware signatures, and core checks.")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "button ghost"
  }, "View Scan History")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_SubTabs__WEBPACK_IMPORTED_MODULE_1__["default"], {
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
  }, "Check plugins, themes, and core files for changes."), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "button primary",
    onClick: () => setIsScanning(prev => !prev)
  }, isScanning ? 'Stop Scan' : 'Start New Scan')), isScanning && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "scan-progress"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "progress-header"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, "Scanning /wp-content/plugins"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "muted"
  }, "58%")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "progress-bar"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    style: {
      width: '58%'
    }
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "scan-results"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, "Latest Results"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", {
    className: "result-list"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pill warning"
  }, "Modified"), "wp-content/themes/securepilot/functions.php"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pill success"
  }, "Clean"), "wp-content/plugins/wp-security-pilot/index.js"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pill danger"
  }, "Flagged"), "wp-content/uploads/tmp/cache.php")))) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "empty-state"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, scanTabs.find(tab => tab.id === activeTab).label), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Schedule automated scans and manage exclusions when your API is ready."), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "button ghost"
  }, "Configure"))));
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