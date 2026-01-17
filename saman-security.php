<?php
/**
 * Plugin Name: Saman Security
 * Plugin URI:  https://github.com/SamanLabs/Saman-Security
 * Description: A smart security plugin for WordPress.
 * Version: 0.0.1
 * Author:      Juan Denis
 * Author URI:  https://github.com/SamanLabs
 * License: GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: saman-security
 * Domain Path: /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
    die;
}

define( 'SAMAN_SECURITY_VERSION', '0.0.1' );
define( 'SAMAN_SECURITY_SCHEMA_VERSION', '3.1.0' );
define( 'SAMAN_SECURITY_MATOMO_URL', 'https://matomo.builditdesign.com/' );
define( 'SAMAN_SECURITY_MATOMO_SITE_ID', '1' );

require_once plugin_dir_path( __FILE__ ) . 'includes/class-admin-loader.php';
require_once plugin_dir_path( __FILE__ ) . 'includes/Core/class-firewall.php';
require_once plugin_dir_path( __FILE__ ) . 'includes/Core/class-activity-logger.php';
require_once plugin_dir_path( __FILE__ ) . 'includes/Core/class-hardening.php';
require_once plugin_dir_path( __FILE__ ) . 'includes/Core/class-scanner.php';
require_once plugin_dir_path( __FILE__ ) . 'includes/Core/class-settings.php';
require_once plugin_dir_path( __FILE__ ) . 'includes/Core/class-notifications.php';

// Include updater classes
require_once plugin_dir_path( __FILE__ ) . 'includes/Updater/class-github-updater.php';
require_once plugin_dir_path( __FILE__ ) . 'includes/Updater/class-plugin-installer.php';

/**
 * Migrate options and settings from old plugin name to new.
 * This ensures existing installs don't lose their configuration.
 */
function saman_security_migrate_from_old_plugin() {
    // Migrate main settings
    $old_settings = get_option( 'wp_security_pilot_settings' );
    if ( $old_settings !== false && get_option( 'saman_security_settings' ) === false ) {
        update_option( 'saman_security_settings', $old_settings );
        delete_option( 'wp_security_pilot_settings' );
    }

    // Migrate hardening settings
    $old_hardening = get_option( 'wp_security_pilot_hardening' );
    if ( $old_hardening !== false && get_option( 'saman_security_hardening' ) === false ) {
        update_option( 'saman_security_hardening', $old_hardening );
        delete_option( 'wp_security_pilot_hardening' );
    }

    // Migrate schema version
    $old_schema = get_option( 'wp_security_pilot_schema_version' );
    if ( $old_schema !== false && get_option( 'saman_security_schema_version' ) === false ) {
        update_option( 'saman_security_schema_version', $old_schema );
        delete_option( 'wp_security_pilot_schema_version' );
    }

    // Migrate blocked countries
    $old_countries = get_option( 'wpsp_blocked_countries' );
    if ( $old_countries !== false && get_option( 'ss_blocked_countries' ) === false ) {
        update_option( 'ss_blocked_countries', $old_countries );
        delete_option( 'wpsp_blocked_countries' );
    }

    // Migrate scan schedule
    $old_schedule = get_option( 'wpsp_scan_schedule' );
    if ( $old_schedule !== false && get_option( 'ss_scan_schedule' ) === false ) {
        update_option( 'ss_scan_schedule', $old_schedule );
        delete_option( 'wpsp_scan_schedule' );
    }

    // Migrate beta plugins option
    $old_beta = get_option( 'wpsp_beta_plugins' );
    if ( $old_beta !== false && get_option( 'ss_beta_plugins' ) === false ) {
        update_option( 'ss_beta_plugins', $old_beta );
        delete_option( 'wpsp_beta_plugins' );
    }

    // Clear old cron hooks and let new ones be scheduled
    wp_clear_scheduled_hook( 'wpsp_cleanup_logs' );
    wp_clear_scheduled_hook( 'wpsp_scan_scheduled' );
    wp_clear_scheduled_hook( 'wpsp_scan_chunk' );
}

function saman_security_install_schema() {
    global $wpdb;

    // Note: Database tables keep wpsp_ prefix for backward compatibility
    // This avoids requiring data migration for existing installs
    $table_name = $wpdb->prefix . 'wpsp_blocked_ips';
    $activity_table = $wpdb->prefix . 'wpsp_activity_log';
    $ip_list_table = $wpdb->prefix . 'wpsp_ip_list';
    $rules_table = $wpdb->prefix . 'wpsp_firewall_rules';
    $scan_jobs_table = $wpdb->prefix . 'wpsp_scan_jobs';
    $scan_results_table = $wpdb->prefix . 'wpsp_scan_results';
    $scan_ignore_table = $wpdb->prefix . 'wpsp_scan_ignore';
    $scan_files_table = $wpdb->prefix . 'wpsp_scan_files';
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

    $scan_files_sql = "CREATE TABLE {$scan_files_table} (
        id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        file_path text NOT NULL,
        file_hash varchar(64) NOT NULL DEFAULT '',
        file_mtime bigint(20) unsigned NOT NULL DEFAULT 0,
        last_scanned datetime NOT NULL,
        last_status varchar(20) NOT NULL DEFAULT 'clean',
        PRIMARY KEY  (id),
        UNIQUE KEY file_path (file_path(191)),
        KEY last_scanned (last_scanned),
        KEY last_status (last_status)
    ) {$charset_collate};";

    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    dbDelta( $sql );
    dbDelta( $activity_sql );
    dbDelta( $ip_list_sql );
    dbDelta( $rules_sql );
    dbDelta( $scan_jobs_sql );
    dbDelta( $scan_results_sql );
    dbDelta( $scan_ignore_sql );
    dbDelta( $scan_files_sql );

    saman_security_migrate_blocked_ips( $table_name, $ip_list_table );
    saman_security_seed_firewall_rules( $rules_table );

    update_option( 'saman_security_schema_version', SAMAN_SECURITY_SCHEMA_VERSION );
}

function saman_security_migrate_blocked_ips( $legacy_table, $ip_list_table ) {
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

function saman_security_seed_firewall_rules( $rules_table ) {
    global $wpdb;

    $rules_exists = $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $rules_table ) );
    if ( $rules_exists !== $rules_table ) {
        return;
    }

    $existing = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$rules_table}" );
    if ( $existing > 0 ) {
        return;
    }

    $defaults = Saman_Security_Firewall::get_default_rules();
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

function saman_security_activate() {
    saman_security_migrate_from_old_plugin();
    saman_security_install_schema();
    saman_security_schedule_cleanup();
}

register_activation_hook( __FILE__, 'saman_security_activate' );

function saman_security_maybe_upgrade() {
    $current_version = get_option( 'saman_security_schema_version', '0' );
    if ( version_compare( $current_version, SAMAN_SECURITY_SCHEMA_VERSION, '<' ) ) {
        saman_security_migrate_from_old_plugin();
        saman_security_install_schema();
    }
}

function saman_security_schedule_cleanup() {
    if ( ! wp_next_scheduled( 'ss_cleanup_logs' ) ) {
        wp_schedule_event( time() + DAY_IN_SECONDS, 'daily', 'ss_cleanup_logs' );
    }
}

function saman_security_schedule_weekly_summary() {
    $enabled = Saman_Security_Settings::get_setting( array( 'notifications', 'weekly_summary_enabled' ), true );

    if ( ! $enabled ) {
        wp_clear_scheduled_hook( 'ss_weekly_summary' );
        return;
    }

    if ( wp_next_scheduled( 'ss_weekly_summary' ) ) {
        return;
    }

    $day  = Saman_Security_Settings::get_setting( array( 'notifications', 'weekly_summary_day' ), 'monday' );
    $time = Saman_Security_Settings::get_setting( array( 'notifications', 'weekly_summary_time' ), '09:00' );

    $days_map = array(
        'sunday'    => 0,
        'monday'    => 1,
        'tuesday'   => 2,
        'wednesday' => 3,
        'thursday'  => 4,
        'friday'    => 5,
        'saturday'  => 6,
    );

    $target_day = isset( $days_map[ $day ] ) ? $days_map[ $day ] : 1;
    $time_parts = explode( ':', $time );
    $hour       = isset( $time_parts[0] ) ? absint( $time_parts[0] ) : 9;
    $minute     = isset( $time_parts[1] ) ? absint( $time_parts[1] ) : 0;

    $current_day = (int) gmdate( 'w' );
    $days_until  = ( $target_day - $current_day + 7 ) % 7;
    if ( 0 === $days_until ) {
        $days_until = 7;
    }

    $next_run = strtotime( gmdate( 'Y-m-d' ) . " +{$days_until} days" );
    $next_run = strtotime( gmdate( 'Y-m-d', $next_run ) . " {$hour}:{$minute}:00" );

    wp_schedule_event( $next_run, 'weekly', 'ss_weekly_summary' );
}

function saman_security_send_weekly_summary() {
    Saman_Security_Notifications::send_weekly_summary();
}

function saman_security_cleanup_logs() {
    $days = (int) Saman_Security_Settings::get_setting( array( 'general', 'log_retention_days' ), 30 );
    if ( $days <= 0 ) {
        return;
    }

    $cutoff = gmdate( 'Y-m-d H:i:s', time() - ( $days * DAY_IN_SECONDS ) );
    global $wpdb;

    $wpdb->query(
        $wpdb->prepare(
            "DELETE FROM {$wpdb->prefix}wpsp_activity_log WHERE created_at < %s",
            $cutoff
        )
    );

    $wpdb->query(
        $wpdb->prepare(
            "DELETE FROM {$wpdb->prefix}wpsp_scan_results WHERE created_at < %s",
            $cutoff
        )
    );

    $wpdb->query(
        $wpdb->prepare(
            "DELETE FROM {$wpdb->prefix}wpsp_scan_jobs WHERE completed_at IS NOT NULL AND completed_at < %s",
            $cutoff
        )
    );
}

function saman_security_uninstall() {
    $settings = get_option( Saman_Security_Settings::OPTION_KEY, array() );
    $settings = is_array( $settings ) ? $settings : array();
    $delete_data = isset( $settings['general']['delete_data_on_uninstall'] ) ? (bool) $settings['general']['delete_data_on_uninstall'] : false;

    if ( ! $delete_data ) {
        return;
    }

    global $wpdb;

    $tables = array(
        'wpsp_blocked_ips',
        'wpsp_activity_log',
        'wpsp_ip_list',
        'wpsp_firewall_rules',
        'wpsp_scan_jobs',
        'wpsp_scan_results',
        'wpsp_scan_ignore',
        'wpsp_scan_files',
    );

    foreach ( $tables as $table ) {
        $wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}{$table}" );
    }

    // Clear new cron hooks
    wp_clear_scheduled_hook( 'ss_cleanup_logs' );
    wp_clear_scheduled_hook( 'ss_scan_scheduled' );
    wp_clear_scheduled_hook( 'ss_weekly_summary' );

    // Also clear old hooks in case they still exist
    wp_clear_scheduled_hook( 'wpsp_cleanup_logs' );
    wp_clear_scheduled_hook( 'wpsp_scan_scheduled' );

    // Delete new options
    delete_option( Saman_Security_Settings::OPTION_KEY );
    delete_option( 'saman_security_hardening' );
    delete_option( 'ss_blocked_countries' );
    delete_option( 'ss_scan_schedule' );
    delete_option( 'saman_security_schema_version' );
    delete_option( 'ss_beta_plugins' );

    // Also delete old options in case they still exist
    delete_option( 'wp_security_pilot_settings' );
    delete_option( 'wp_security_pilot_hardening' );
    delete_option( 'wpsp_blocked_countries' );
    delete_option( 'wpsp_scan_schedule' );
    delete_option( 'wp_security_pilot_schema_version' );
    delete_option( 'wpsp_beta_plugins' );
}

register_uninstall_hook( __FILE__, 'saman_security_uninstall' );

function run_saman_security() {
    $plugin = new Saman_Security_Admin_Loader();
    $plugin->run();

    // Initialize GitHub updater
    $updater = Saman_Security_GitHub_Updater::get_instance();

    $firewall = new Saman_Security_Firewall();
    add_action( 'init', array( $firewall, 'run' ) );

    $hardening = new Saman_Security_Hardening();
    $hardening->register_hooks();

    $scanner = new Saman_Security_Scanner();
    add_action( 'ss_scan_chunk', array( $scanner, 'run_scan_chunk' ) );
    add_action( 'ss_scan_scheduled', array( $scanner, 'run_scheduled_scan' ) );

    add_action( 'admin_init', 'saman_security_maybe_upgrade' );
    add_action( 'admin_init', 'saman_security_schedule_cleanup' );
    add_action( 'admin_init', 'saman_security_schedule_weekly_summary' );
    add_action( 'ss_cleanup_logs', 'saman_security_cleanup_logs' );
    add_action( 'ss_weekly_summary', 'saman_security_send_weekly_summary' );

    add_action(
        'wp_login_failed',
        function( $username ) {
            Saman_Security_Activity_Logger::log_event( 'blocked', 'Brute force attempt', 0, '', $username );
        }
    );

    add_action(
        'wp_login',
        function( $user_login, $user ) {
            // Send alert for any user login if enabled.
            Saman_Security_Notifications::send_alert(
                'user_login',
                'User login detected.',
                array(
                    'user' => $user_login,
                    'role' => implode( ', ', $user->roles ),
                )
            );

            // Also send admin-specific alert if user is admin.
            if ( user_can( $user, 'manage_options' ) ) {
                Saman_Security_Activity_Logger::log_event( 'allowed', 'Admin login', $user->ID );
                Saman_Security_Notifications::send_alert( 'admin_login', 'Admin login detected.', array( 'user' => $user_login ) );
            }
        },
        10,
        2
    );

    add_action(
        'user_register',
        function( $user_id ) {
            $user = get_userdata( $user_id );
            if ( $user && in_array( 'administrator', (array) $user->roles, true ) ) {
                Saman_Security_Activity_Logger::log_event( 'alert', 'New admin user created', $user_id );
            }
        }
    );
}
run_saman_security();
