<?php
/**
 * Plugin Name: WP Security Pilot
 * Plugin URI:  https://github.com/jhd3197/WP-Security-Pilot
 * Description: A smart security plugin for WordPress.
 * Version: 0.0.1
 * Author:      Juan Denis
 * Author URI:  https://github.com/jhd3197
 * License: GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: wp-security-pilot
 * Domain Path: /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
    die;
}

define( 'WP_SECURITY_PILOT_VERSION', '1.0.0' );
define( 'WP_SECURITY_PILOT_SCHEMA_VERSION', '3.0.0' );

require_once plugin_dir_path( __FILE__ ) . 'includes/class-admin-loader.php';
require_once plugin_dir_path( __FILE__ ) . 'includes/Core/class-firewall.php';
require_once plugin_dir_path( __FILE__ ) . 'includes/Core/class-activity-logger.php';
require_once plugin_dir_path( __FILE__ ) . 'includes/Core/class-hardening.php';
require_once plugin_dir_path( __FILE__ ) . 'includes/Core/class-scanner.php';

function wp_security_pilot_install_schema() {
    global $wpdb;

    $table_name = $wpdb->prefix . 'wpsp_blocked_ips';
    $activity_table = $wpdb->prefix . 'wpsp_activity_log';
    $ip_list_table = $wpdb->prefix . 'wpsp_ip_list';
    $rules_table = $wpdb->prefix . 'wpsp_firewall_rules';
    $scan_jobs_table = $wpdb->prefix . 'wpsp_scan_jobs';
    $scan_results_table = $wpdb->prefix . 'wpsp_scan_results';
    $scan_ignore_table = $wpdb->prefix . 'wpsp_scan_ignore';
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE {$table_name} (
        id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        ip_address varchar(45) NOT NULL,
        reason varchar(255) NOT NULL DEFAULT '',
        created_at datetime NOT NULL,
        PRIMARY KEY  (id),
        UNIQUE KEY ip_address (ip_address)
    ) {$charset_collate};";

    $activity_sql = "CREATE TABLE {$activity_table} (
        id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        event_type varchar(20) NOT NULL DEFAULT 'info',
        event_message varchar(255) NOT NULL,
        user_id bigint(20) unsigned NOT NULL DEFAULT 0,
        user_name varchar(60) NOT NULL DEFAULT 'Unknown',
        ip_address varchar(45) NOT NULL DEFAULT '',
        created_at datetime NOT NULL,
        PRIMARY KEY  (id),
        KEY event_type (event_type),
        KEY created_at (created_at),
        KEY user_name (user_name)
    ) {$charset_collate};";

    $ip_list_sql = "CREATE TABLE {$ip_list_table} (
        id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        ip_address varchar(45) NOT NULL,
        list_type varchar(10) NOT NULL,
        reason text NOT NULL,
        created_at datetime NOT NULL,
        PRIMARY KEY  (id),
        UNIQUE KEY ip_list (ip_address, list_type),
        KEY ip_address (ip_address),
        KEY list_type (list_type)
    ) {$charset_collate};";

    $rules_sql = "CREATE TABLE {$rules_table} (
        id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        description text NOT NULL,
        target_area varchar(20) NOT NULL,
        pattern text NOT NULL,
        is_active tinyint(1) NOT NULL DEFAULT 1,
        is_custom tinyint(1) NOT NULL DEFAULT 0,
        created_at datetime NOT NULL,
        PRIMARY KEY  (id),
        KEY target_area (target_area),
        KEY is_active (is_active),
        KEY is_custom (is_custom)
    ) {$charset_collate};";

    $scan_jobs_sql = "CREATE TABLE {$scan_jobs_table} (
        id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        status varchar(20) NOT NULL DEFAULT 'pending',
        total_files bigint(20) unsigned NOT NULL DEFAULT 0,
        processed_files bigint(20) unsigned NOT NULL DEFAULT 0,
        last_message text NOT NULL,
        started_at datetime NOT NULL,
        completed_at datetime DEFAULT NULL,
        PRIMARY KEY  (id),
        KEY status (status),
        KEY started_at (started_at)
    ) {$charset_collate};";

    $scan_results_sql = "CREATE TABLE {$scan_results_table} (
        id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        job_id bigint(20) unsigned NOT NULL,
        file_path text NOT NULL,
        status varchar(20) NOT NULL,
        issue_type varchar(40) NOT NULL,
        details text NOT NULL,
        created_at datetime NOT NULL,
        PRIMARY KEY  (id),
        KEY job_id (job_id),
        KEY status (status)
    ) {$charset_collate};";

    $scan_ignore_sql = "CREATE TABLE {$scan_ignore_table} (
        id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        path_pattern text NOT NULL,
        created_at datetime NOT NULL,
        PRIMARY KEY  (id)
    ) {$charset_collate};";

    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    dbDelta( $sql );
    dbDelta( $activity_sql );
    dbDelta( $ip_list_sql );
    dbDelta( $rules_sql );
    dbDelta( $scan_jobs_sql );
    dbDelta( $scan_results_sql );
    dbDelta( $scan_ignore_sql );

    wp_security_pilot_migrate_blocked_ips( $table_name, $ip_list_table );
    wp_security_pilot_seed_firewall_rules( $rules_table );

    update_option( 'wp_security_pilot_schema_version', WP_SECURITY_PILOT_SCHEMA_VERSION );
}

function wp_security_pilot_migrate_blocked_ips( $legacy_table, $ip_list_table ) {
    global $wpdb;

    $legacy_exists = $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $legacy_table ) );
    $new_exists = $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $ip_list_table ) );

    if ( $legacy_exists !== $legacy_table || $new_exists !== $ip_list_table ) {
        return;
    }

    $wpdb->query(
        "INSERT IGNORE INTO {$ip_list_table} (ip_address, list_type, reason, created_at)
         SELECT ip_address, 'block', reason, created_at FROM {$legacy_table}"
    );
}

function wp_security_pilot_seed_firewall_rules( $rules_table ) {
    global $wpdb;

    $rules_exists = $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $rules_table ) );
    if ( $rules_exists !== $rules_table ) {
        return;
    }

    $existing = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$rules_table}" );
    if ( $existing > 0 ) {
        return;
    }

    $defaults = WP_Security_Pilot_Firewall::get_default_rules();
    foreach ( $defaults as $rule ) {
        $wpdb->insert(
            $rules_table,
            array(
                'description' => $rule['description'],
                'target_area' => $rule['target_area'],
                'pattern'     => $rule['pattern'],
                'is_active'   => 1,
                'is_custom'   => 0,
                'created_at'  => current_time( 'mysql' ),
            ),
            array( '%s', '%s', '%s', '%d', '%d', '%s' )
        );
    }
}

function wp_security_pilot_activate() {
    wp_security_pilot_install_schema();
}

register_activation_hook( __FILE__, 'wp_security_pilot_activate' );

function wp_security_pilot_maybe_upgrade() {
    $current_version = get_option( 'wp_security_pilot_schema_version', '0' );
    if ( version_compare( $current_version, WP_SECURITY_PILOT_SCHEMA_VERSION, '<' ) ) {
        wp_security_pilot_install_schema();
    }
}

function run_wp_security_pilot() {
    $plugin = new WP_Security_Pilot_Admin_Loader();
    $plugin->run();

    $firewall = new WP_Security_Pilot_Firewall();
    add_action( 'init', array( $firewall, 'run' ) );

    $hardening = new WP_Security_Pilot_Hardening();
    $hardening->register_hooks();

    $scanner = new WP_Security_Pilot_Scanner();
    add_action( 'wpsp_scan_chunk', array( $scanner, 'run_scan_chunk' ) );
    add_action( 'wpsp_scan_scheduled', array( $scanner, 'run_scheduled_scan' ) );

    add_action( 'admin_init', 'wp_security_pilot_maybe_upgrade' );

    add_action(
        'wp_login_failed',
        function( $username ) {
            WP_Security_Pilot_Activity_Logger::log_event( 'blocked', 'Brute force attempt', 0, '', $username );
        }
    );

    add_action(
        'user_register',
        function( $user_id ) {
            $user = get_userdata( $user_id );
            if ( $user && in_array( 'administrator', (array) $user->roles, true ) ) {
                WP_Security_Pilot_Activity_Logger::log_event( 'alert', 'New admin user created', $user_id );
            }
        }
    );
}
run_wp_security_pilot();
