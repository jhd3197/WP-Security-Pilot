# Saman Security

<p align="center">  
  <img width="640" alt="Saman Security" src="https://github.com/user-attachments/assets/195f9018-3104-4406-ad1c-74c159249574" />
</p>
  
<p align="center">
  <strong>The Open Standard for WordPress Security</strong>
</p>

<p align="center">
  <a href="https://github.com/SamanLabs/Saman-Security/releases">
    <img src="https://img.shields.io/github/v/release/SamanLabs/Saman-Security?style=flat-square&color=blue" alt="Latest Release">
  </a>
  <a href="https://github.com/SamanLabs/Saman-Security/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/SamanLabs/Saman-Security?style=flat-square&color=green" alt="License">
  </a>
  <a href="https://github.com/SamanLabs/Saman-Security/stargazers">
    <img src="https://img.shields.io/github/stars/SamanLabs/Saman-Security?style=flat-square&color=yellow" alt="Stars">
  </a>
  <a href="https://github.com/SamanLabs/Saman-Security/network/members">
    <img src="https://img.shields.io/github/forks/SamanLabs/Saman-Security?style=flat-square&color=orange" alt="Forks">
  </a>
  <a href="https://github.com/SamanLabs/Saman-Security/issues">
    <img src="https://img.shields.io/github/issues/SamanLabs/Saman-Security?style=flat-square&color=red" alt="Issues">
  </a>
</p>

<p align="center">
  <a href="https://wordpress.org/">
    <img src="https://img.shields.io/badge/WordPress-5.8%2B-21759B?style=flat-square&logo=wordpress" alt="WordPress Version">
  </a>
  <a href="https://php.net/">
    <img src="https://img.shields.io/badge/PHP-7.4%2B-777BB4?style=flat-square&logo=php" alt="PHP Version">
  </a>
  <a href="https://github.com/SamanLabs/Saman-Security/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/SamanLabs/Saman-Security?style=flat-square&color=blueviolet" alt="Contributors">
  </a>
</p>

<p align="center">
  <a href="https://github.com/SamanLabs/Saman-Security/discussions">
    <img src="https://img.shields.io/badge/Discussions-Join%20Us-brightgreen?style=flat-square&logo=github" alt="Discussions">
  </a>
</p>

<p align="center">
  A comprehensive, transparent security solution built for developers who believe security tooling should be open source, not a black box.
</p>

---

## Why Open Source Security?

For too long, WordPress security has been dominated by proprietary solutions that operate as black boxes. Each plugin guards its methods as trade secrets, fragmenting the ecosystem and forcing developers to work around opaque systems.

**Saman Security takes a different approach**: We believe the security industry benefits from transparency, shared standards, and collaborative improvement. By open-sourcing our complete security workflow, we're establishing a foundation that the entire WordPress community can build upon, inspect, and enhance.

This is security without secrets—because better security comes from better collaboration, not better secrecy.

---

## Features

### Core Security Management
- **Firewall Rules**: Granular control over incoming traffic and malicious requests.
- **File Scanning**: Detect changes, malware, and vulnerabilities in your WordPress files.
- **Security Hardening**: Implement best practices like disabling XML-RPC, forcing strong passwords, and preventing file editing.
- **REST API Protection**: Secure your WordPress REST API endpoints from abuse.

### Advanced Capabilities
- **Activity Logging**: Comprehensive logging of user actions, failed logins, and security events.
- **Automated Scans**: Schedule and run scans for vulnerabilities, malware, and file changes.
- **IP Blacklisting/Whitelisting**: Manage access control at the IP level.
- **Notifications**: Real-time alerts for critical security events.

### Security Auditing
- **Visual Severity Graphs**: Understand your site's security posture at a glance.
- **Issue Logging**: Detailed logs of detected security issues.
- **Vulnerability Reports**: Generate reports on potential weaknesses.
- **Compatibility Checks**: Automatic detection and graceful coexistence with other security plugins.

---

## Documentation

### Getting Started
- **[Getting Started](docs/GETTING_STARTED.md)** - Installation, configuration, and basic usage

### Developer Resources
- **[Developer Guide](docs/DEVELOPER_GUIDE.md)** - Filters, hooks, and programmatic control
- **[Filter Reference](docs/FILTERS.md)** - Complete filter documentation with examples
- **[WP-CLI Commands](docs/WP_CLI.md)** - Command-line interface documentation

### Feature Guides
- **[Firewall Configuration](docs/FIREWALL.md)** - Advanced firewall rule customization
- **[Activity Logging](docs/LOGGING.md)** - Managing and understanding security logs
- **[Security Scans](docs/SCANS.md)** - Configuring and interpreting scan results
- **[Hardening Options](docs/HARDENING.md)** - Best practices for securing your WordPress site

---

## Quick Start

### Installation

1. Download the latest release or clone this repository
2. Upload to `/wp-content/plugins/saman-security/`
3. Activate through the WordPress admin interface
4. Navigate to **Saman Security → Dashboard** to configure site-wide settings and review security status.

### Basic Usage

**Dashboard Overview:**
Navigate to **Saman Security → Dashboard** to see a summary of your site's security status, recent activity, and any pending issues.

**Security Hardening:**
Go to **Saman Security → Hardening** to enable recommended security measures like disabling XML-RPC or preventing file editing.

---

## Developer Integration

### Action Hooks (Example)

```php
// Perform an action after a security event is logged
add_action( 'saman_security_event_logged', function( $event_data ) {
    // Send an email, trigger a webhook, etc.
    error_log( 'Security event detected: ' . print_r( $event_data, true ) );
}, 10, 1 );
```

### Filter Hooks (Example)

```php
// Modify a firewall rule dynamically
add_filter( 'saman_security_firewall_rule', function( $rule, $request ) {
    // Add an exception for a specific IP
    if ( $request['ip'] === '192.168.1.1' ) {
        $rule['action'] = 'allow';
    }
    return $rule;
}, 10, 2 );

// Customize file scan exclusion paths
add_filter( 'saman_security_scan_exclude_paths', function( $excluded_paths ) {
    $excluded_paths[] = ABSPATH . 'wp-content/uploads/custom-safe-folder/';
    return $excluded_paths;
}, 10, 1 );
```

For comprehensive filter documentation, see **[docs/FILTERS.md](docs/FILTERS.md)**.

---

## WP-CLI Support

```bash
# List all detected security issues
wp samansecurity issues list --format=table

# Run a manual file scan
wp samansecurity scan files

# Enable a specific hardening option
wp samansecurity hardening enable xml-rpc-disable
```

Full WP-CLI documentation: **[docs/WP_CLI.md](docs/WP_CLI.md)**

---

## Contributing

We welcome contributions from the community. Whether you're fixing bugs, adding features, improving documentation, or suggesting enhancements, your input helps establish better standards for WordPress security.

See **[CONTRIBUTING.md](CONTRIBUTING.md)** for guidelines.

---

## Privacy & Security

- **Activity Logging**: Opt-in feature that stores only necessary security event data.
- **Usage Analytics**: Anonymous admin-only usage analytics with an opt-out toggle.
- **No External Requests**: All core processing happens on your server (except for optional cloud-based threat intelligence if explicitly enabled).

---

## Asset Development

The plugin uses `@wordpress/scripts` for React development and build processes.

```bash
# Install dependencies
npm install

# Build the React app for production
npm run build

# Watch for changes during development
npm run start
```

---

## Support

- **Issues**: [GitHub Issues](https://github.com/SamanLabs/Saman-Security/issues)
- **Documentation**: [Full Documentation](docs/)
- **Community**: [Discussions](https://github.com/SamanLabs/Saman-Security/discussions)

---

## See Also

- [Saman SEO](https://github.com/SamanLabs/Saman-SEO) - A comprehensive, transparent SEO solution for WordPress.
- [Saman AI](https://github.com/SamanLabs/Saman-AI) - An advanced AI-powered assistant for WordPress.
- [Saman Backup](https://github.com/SamanLabs/Saman-Backup) - Reliable backup and restore solution for WordPress.
- [Saman Field](https://github.com/SamanLabs/Saman-Field) - A flexible custom fields solution for WordPress.
- [Saman Cache](https://github.com/SamanLabs/Saman-Cache) - A powerful caching solution for WordPress.
- [Saman Forms](https://github.com/SamanLabs/Saman-Forms) - An intuitive form builder for WordPress.


---

**Built with transparency. Built for the community. Built to be better.**
