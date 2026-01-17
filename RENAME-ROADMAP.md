# Plugin Rename Roadmap: WP Security Pilot → Saman Security

## Overview

This document outlines the complete plan to rename the plugin from **"WP Security Pilot"** to **"Saman Security"**.

---

## New Naming Conventions

| Type | Old Value | New Value |
|------|-----------|-----------|
| Display Name | WP Security Pilot | Saman Security |
| Slug (hyphenated) | wp-security-pilot | saman-security |
| Function Prefix | wp_security_pilot_ | saman_security_ |
| Class Prefix | WP_Security_Pilot_ | Saman_Security_ |
| Abbreviation (DB/hooks) | wpsp_ | ss_ |
| Constants | WP_SECURITY_PILOT_ | SAMAN_SECURITY_ |
| Text Domain | wp-security-pilot | saman-security |
| REST Namespace | wp-security-pilot/v1 | saman-security/v1 |
| WP-CLI Command | wpsecuritypilot | samansecurity |
| Window Object | wpSecurityPilotSettings | samanSecuritySettings |

---

## Critical Decision: Database Table Prefix

**Options:**

1. **Keep `wpsp_` prefix** (Recommended for existing users)
   - Pros: No data migration needed, existing installs continue working
   - Cons: Inconsistent naming (old prefix with new plugin name)

2. **Rename to `ss_` prefix**
   - Pros: Consistent naming throughout
   - Cons: Requires migration script for existing users, risk of data loss

**Recommendation:** Keep `wpsp_` for database tables to ensure smooth upgrades for existing users. Internal code comments can document this as legacy naming.

---

## Phase 1: Core Plugin Files (Critical)

### 1.1 Main Plugin File Rename
- [ ] Rename `wp-security-pilot.php` → `saman-security.php`

### 1.2 Update Plugin Header (`saman-security.php`)
```php
// OLD
Plugin Name: WP Security Pilot
Plugin URI: https://github.com/SamanLabs/Saman-Security
Text Domain: wp-security-pilot

// NEW
Plugin Name: Saman Security
Plugin URI: https://github.com/SamanLabs/Saman-Security
Text Domain: saman-security
```

### 1.3 Update Constants (`saman-security.php`)
| Old Constant | New Constant |
|--------------|--------------|
| WP_SECURITY_PILOT_VERSION | SAMAN_SECURITY_VERSION |
| WP_SECURITY_PILOT_SCHEMA_VERSION | SAMAN_SECURITY_SCHEMA_VERSION |
| WP_SECURITY_PILOT_MATOMO_URL | SAMAN_SECURITY_MATOMO_URL |
| WP_SECURITY_PILOT_MATOMO_SITE_ID | SAMAN_SECURITY_MATOMO_SITE_ID |

### 1.4 Update Functions (`saman-security.php`)
| Old Function | New Function |
|--------------|--------------|
| wp_security_pilot_install_schema() | saman_security_install_schema() |
| wp_security_pilot_migrate_blocked_ips() | saman_security_migrate_blocked_ips() |
| wp_security_pilot_seed_firewall_rules() | saman_security_seed_firewall_rules() |
| wp_security_pilot_activate() | saman_security_activate() |
| wp_security_pilot_maybe_upgrade() | saman_security_maybe_upgrade() |
| wp_security_pilot_schedule_cleanup() | saman_security_schedule_cleanup() |
| wp_security_pilot_cleanup_logs() | saman_security_cleanup_logs() |
| wp_security_pilot_uninstall() | saman_security_uninstall() |
| run_wp_security_pilot() | run_saman_security() |

### 1.5 Update WordPress Options Keys
| Old Option | New Option |
|------------|------------|
| wp_security_pilot_settings | saman_security_settings |
| wp_security_pilot_hardening | saman_security_hardening |
| wp_security_pilot_schema_version | saman_security_schema_version |
| wpsp_blocked_countries | ss_blocked_countries |
| wpsp_scan_schedule | ss_scan_schedule |
| wpsp_beta_plugins | ss_beta_plugins |

**Note:** Requires migration logic to copy old option values to new keys on upgrade.

### 1.6 Update Cron Hooks
| Old Hook | New Hook |
|----------|----------|
| wpsp_cleanup_logs | ss_cleanup_logs |
| wpsp_scan_chunk | ss_scan_chunk |
| wpsp_scan_scheduled | ss_scan_scheduled |

---

## Phase 2: PHP Class Files (16 files)

### 2.1 Admin Loader (`includes/class-admin-loader.php`)
- [ ] Rename class: `WP_Security_Pilot_Admin_Loader` → `Saman_Security_Admin_Loader`
- [ ] Update menu slugs (8 pages):
  - `wp-security-pilot` → `saman-security`
  - `wp-security-pilot-dashboard` → `saman-security-dashboard`
  - `wp-security-pilot-firewall` → `saman-security-firewall`
  - `wp-security-pilot-scanner` → `saman-security-scanner`
  - `wp-security-pilot-hardening` → `saman-security-hardening`
  - `wp-security-pilot-activity` → `saman-security-activity`
  - `wp-security-pilot-settings` → `saman-security-settings`
  - `wp-security-pilot-more` → `saman-security-more`
- [ ] Update menu title: "Security Pilot" → "Saman Security"
- [ ] Update script handles:
  - `wp-security-pilot-admin-app` → `saman-security-admin-app`
  - `wp-security-pilot-admin-style` → `saman-security-admin-style`
- [ ] Update DOM element ID: `wp-security-pilot-app` → `saman-security-app`

### 2.2 Core Classes (`includes/Core/`)
| File | Old Class Name | New Class Name |
|------|----------------|----------------|
| class-settings.php | WP_Security_Pilot_Settings | Saman_Security_Settings |
| class-hardening.php | WP_Security_Pilot_Hardening | Saman_Security_Hardening |
| class-firewall.php | WP_Security_Pilot_Firewall | Saman_Security_Firewall |
| class-scanner.php | WP_Security_Pilot_Scanner | Saman_Security_Scanner |
| class-activity-logger.php | WP_Security_Pilot_Activity_Logger | Saman_Security_Activity_Logger |
| class-notifications.php | WP_Security_Pilot_Notifications | Saman_Security_Notifications |

- [ ] Update OPTION_KEY constants in each class
- [ ] Update text domain references: `'wp-security-pilot'` → `'saman-security'`
- [ ] Update error codes: `wpsp_rest_*` → `ss_rest_*`

### 2.3 API Controllers (`includes/Api/`)
| File | Old Class Name | New Class Name |
|------|----------------|----------------|
| class-settings-controller.php | WP_Security_Pilot_Settings_Controller | Saman_Security_Settings_Controller |
| class-firewall-controller.php | WP_Security_Pilot_Firewall_Controller | Saman_Security_Firewall_Controller |
| class-activity-controller.php | WP_Security_Pilot_Activity_Controller | Saman_Security_Activity_Controller |
| class-hardening-controller.php | WP_Security_Pilot_Hardening_Controller | Saman_Security_Hardening_Controller |
| class-scanner-controller.php | WP_Security_Pilot_Scanner_Controller | Saman_Security_Scanner_Controller |
| class-dashboard-controller.php | WP_Security_Pilot_Dashboard_Controller | Saman_Security_Dashboard_Controller |
| class-updater-controller.php | WP_Security_Pilot_Updater_Controller | Saman_Security_Updater_Controller |

- [ ] Update REST namespace: `'wp-security-pilot/v1'` → `'saman-security/v1'`

### 2.4 Updater Classes (`includes/Updater/`)
| File | Old Class Name | New Class Name |
|------|----------------|----------------|
| class-github-updater.php | WP_Security_Pilot_GitHub_Updater | Saman_Security_GitHub_Updater |
| class-plugin-installer.php | WP_Security_Pilot_Plugin_Installer | Saman_Security_Plugin_Installer |

- [ ] Update GitHub repository references

---

## Phase 3: JavaScript/React Files

### 3.1 Entry Point (`src/index.js`)
- [ ] Update root element ID: `wp-security-pilot-app` → `saman-security-app`
- [ ] Update window object: `wpSecurityPilotSettings` → `samanSecuritySettings`

### 3.2 Main App (`src/App.js`)
- [ ] Update page identifiers (7 instances)
- [ ] Update DOM class queries
- [ ] Update menu item selectors

### 3.3 Page Components (`src/pages/`)
Update REST API paths in all pages:
- [ ] Dashboard.js: `/wp-security-pilot/v1/` → `/saman-security/v1/`
- [ ] Scanner.js: 6 API path references
- [ ] Firewall.js: 6 API path references
- [ ] Hardening.js: 1 API path reference
- [ ] ActivityLog.js: 1 API path reference
- [ ] Settings.js: 3 API path references + window object references

### 3.4 Utilities (`src/utils/`)
- [ ] analytics.js: Update script ID and window object reference

---

## Phase 4: Stylesheets

### 4.1 Source Styles
- [ ] `src/index.css`: Update class names `.wp-security-pilot-*` → `.saman-security-*`
- [ ] `src/less/base/_reset.less`: Update class references

### 4.2 Built Assets (auto-generated on build)
- [ ] `assets/js/index.css`
- [ ] `assets/js/index-rtl.css`

---

## Phase 5: Configuration Files

### 5.1 Package Configuration
- [ ] `package.json`: Update name field `"wp-security-pilot"` → `"saman-security"`

### 5.2 GitHub Workflows
- [ ] `.github/workflows/release.yml`:
  - Update version constant references
  - Update zip file naming
  - Update release titles
- [ ] `.github/workflows/beta-release.yml`:
  - Same updates as release.yml

---

## Phase 6: Documentation

### 6.1 Main Documentation
- [ ] `README.md`: Full content update
- [ ] `CONTRIBUTING.md`: Update plugin references
- [ ] `LICENSE`: Update if needed

### 6.2 Docs Folder (`docs/`)
- [ ] DEVELOPER_GUIDE.md
- [ ] FILTERS.md
- [ ] FIREWALL.md
- [ ] GETTING_STARTED.md
- [ ] HARDENING.md
- [ ] LOGGING.md
- [ ] SCANS.md
- [ ] WP_CLI.md (update command prefix to `samansecurity`)

### 6.3 Planning Documents
- [ ] `.planning/ROADMAP.md`
- [ ] Remove/update old planning docs

---

## Phase 7: Directory & Repository

### 7.1 Directory Rename
- [ ] Rename plugin directory: `WP-Security-Pilot/` → `Saman-Security/` (or `saman-security/`)

### 7.2 GitHub Repository
- [ ] Rename repository: `SamanLabs/Saman-Security` → `SamanLabs/Saman-Security`
- [ ] Update all repository URL references in code

---

## Phase 8: Migration Script (for existing users)

### 8.1 Option Migration
Create upgrade routine to migrate existing options:
```php
function saman_security_migrate_options() {
    $old_settings = get_option('wp_security_pilot_settings');
    if ($old_settings && !get_option('saman_security_settings')) {
        update_option('saman_security_settings', $old_settings);
        delete_option('wp_security_pilot_settings');
    }
    // Repeat for all options...
}
```

### 8.2 Cron Migration
Clear old cron hooks and schedule new ones:
```php
wp_clear_scheduled_hook('wpsp_cleanup_logs');
wp_clear_scheduled_hook('wpsp_scan_scheduled');
// Schedule with new hook names...
```

---

## Execution Order

1. **Create feature branch** for the rename
2. **Phase 1**: Core plugin file (most critical)
3. **Phase 8**: Add migration script (ensures existing installs work)
4. **Phase 2**: PHP class files
5. **Phase 3**: JavaScript files
6. **Phase 4**: Stylesheets
7. **Phase 5**: Config files
8. **Phase 6**: Documentation
9. **Build**: Run `npm run build` to regenerate assets
10. **Test**: Full testing on clean install + upgrade from old version
11. **Phase 7**: Directory and repository rename (do last)

---

## Testing Checklist

### Fresh Install
- [ ] Plugin activates without errors
- [ ] All admin pages load correctly
- [ ] All features work (scanner, firewall, hardening, activity log)
- [ ] REST API endpoints respond correctly
- [ ] Settings save and persist

### Upgrade from Old Version
- [ ] Existing settings preserved after upgrade
- [ ] Existing database data (activity logs, scan results) accessible
- [ ] Old cron jobs cleared, new ones scheduled
- [ ] No PHP errors or warnings

### Build Verification
- [ ] `npm run build` completes successfully
- [ ] Built assets contain new class names
- [ ] No references to old naming in built files

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Existing installs break | High | Migration script + thorough testing |
| Data loss | Critical | Keep DB table prefix, backup recommendations |
| Broken API calls | High | Update all JS files simultaneously |
| SEO/backlinks | Low | GitHub redirect handles this |
| User confusion | Medium | Clear changelog and announcement |

---

## Estimated File Changes

| Category | Files | Changes |
|----------|-------|---------|
| PHP Files | 18 | ~200 replacements |
| JavaScript | 9 | ~50 replacements |
| Stylesheets | 4 | ~20 replacements |
| Config | 3 | ~10 replacements |
| Documentation | 11 | ~100 replacements |
| **Total** | **45** | **~380 replacements** |

---

## Notes

- The database table prefix (`wpsp_`) is intentionally kept to avoid data migration
- This is a major version bump (recommend 1.0.0 or 2.0.0)
- Consider creating a pre-release/beta for user testing before stable release
