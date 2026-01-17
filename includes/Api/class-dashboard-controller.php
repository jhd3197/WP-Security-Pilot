<?php

class Saman_Security_Dashboard_Controller extends WP_REST_Controller {

    public function __construct() {
        $this->namespace = 'saman-security/v1';
        $this->rest_base = 'dashboard';
    }

    public function register_routes() {
        register_rest_route(
            $this->namespace,
            '/' . $this->rest_base . '/summary',
            array(
                array(
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => array( $this, 'get_summary' ),
                    'permission_callback' => array( $this, 'get_items_permissions_check' ),
                ),
            )
        );
    }

    public function get_summary( $request ) {
        global $wpdb;

        $summary = array(
            'security_posture' => $this->get_security_posture(),
            'recent_activity'  => $this->get_recent_activity(),
            'scanner'          => $this->get_scanner_status(),
            'firewall'         => $this->get_firewall_summary(),
            'notifications'    => $this->get_notification_summary(),
            'general'          => array(
                'ip_anonymization'   => Saman_Security_Settings::get_setting( array( 'general', 'ip_anonymization' ), true ),
                'log_retention_days' => Saman_Security_Settings::get_setting( array( 'general', 'log_retention_days' ), 30 ),
            ),
        );

        return rest_ensure_response( $summary );
    }

    public function get_items_permissions_check( $request ) {
        return current_user_can( 'manage_options' );
    }

    private function get_security_posture() {
        $settings = Saman_Security_Hardening::get_settings();
        $items = array(
            'file_editor_disabled' => ! empty( $settings['general']['disable_file_editor'] ),
            'xmlrpc_blocked'       => in_array( $settings['general']['xmlrpc_mode'], array( 'disable', 'pingbacks' ), true ),
            'login_limit'          => (int) $settings['general']['limit_login_attempts'] > 0,
            'hide_version'         => ! empty( $settings['general']['hide_wp_version'] ),
            'rest_limited'         => 'open' !== $settings['rest']['access'],
            'password_policy'      => (int) $settings['passwords']['min_length'] >= 8 || ! empty( $settings['passwords']['block_common'] ),
        );

        $total = count( $items );
        $enabled = count( array_filter( $items ) );
        $pending = $total - $enabled;
        $score = $total ? (int) round( ( $enabled / $total ) * 100 ) : 0;

        if ( $score >= 85 ) {
            $label = 'Good';
        } elseif ( $score >= 70 ) {
            $label = 'Fair';
        } else {
            $label = 'Needs attention';
        }

        return array(
            'score'   => $score,
            'label'   => $label,
            'enabled' => $enabled,
            'total'   => $total,
            'pending' => $pending,
        );
    }

    private function get_recent_activity() {
        global $wpdb;

        $table = $wpdb->prefix . 'ss_activity_log';
        $exists = $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $table ) );
        if ( $exists !== $table ) {
            return array(
                'blocked_last_7_days' => 0,
                'total_last_7_days'   => 0,
                'spark'               => array(),
                'trend'               => 'steady',
            );
        }

        $now = current_time( 'timestamp' );
        $since = wp_date( 'Y-m-d H:i:s', $now - ( 7 * DAY_IN_SECONDS ) );

        $blocked_count = (int) $wpdb->get_var(
            $wpdb->prepare(
                "SELECT COUNT(*) FROM {$table} WHERE created_at >= %s AND event_type = %s",
                $since,
                'blocked'
            )
        );

        $total_count = (int) $wpdb->get_var(
            $wpdb->prepare(
                "SELECT COUNT(*) FROM {$table} WHERE created_at >= %s",
                $since
            )
        );

        $rows = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT DATE(created_at) as day, COUNT(*) as total
                 FROM {$table}
                 WHERE created_at >= %s
                 GROUP BY day
                 ORDER BY day ASC",
                $since
            ),
            ARRAY_A
        );

        $map = array();
        foreach ( $rows as $row ) {
            $map[ $row['day'] ] = (int) $row['total'];
        }

        $spark = array();
        for ( $i = 6; $i >= 0; $i-- ) {
            $day = wp_date( 'Y-m-d', $now - ( $i * DAY_IN_SECONDS ) );
            $spark[] = isset( $map[ $day ] ) ? $map[ $day ] : 0;
        }

        $trend = 'steady';
        if ( count( $spark ) >= 2 ) {
            $last = $spark[ count( $spark ) - 1 ];
            $prev = $spark[ count( $spark ) - 2 ];
            if ( $last > $prev ) {
                $trend = 'up';
            } elseif ( $last < $prev ) {
                $trend = 'down';
            }
        }

        return array(
            'blocked_last_7_days' => $blocked_count,
            'total_last_7_days'   => $total_count,
            'spark'               => $spark,
            'trend'               => $trend,
        );
    }

    private function get_scanner_status() {
        $scanner = new Saman_Security_Scanner();
        $status = $scanner->get_latest_status();

        if ( ! $status ) {
            return array(
                'status'       => 'idle',
                'progress'     => 0,
                'last_scan'    => '',
                'issues_count' => 0,
            );
        }

        global $wpdb;
        $issues = 0;
        if ( ! empty( $status['id'] ) ) {
            $issues = (int) $wpdb->get_var(
                $wpdb->prepare(
                    "SELECT COUNT(*) FROM {$wpdb->prefix}ss_scan_results WHERE job_id = %d",
                    $status['id']
                )
            );
        }

        $last_scan = $status['completed_at'];
        if ( empty( $last_scan ) ) {
            $last_scan = $status['started_at'];
        }

        return array(
            'status'       => $status['status'],
            'progress'     => $status['progress'],
            'last_scan'    => $last_scan,
            'issues_count' => $issues,
        );
    }

    private function get_firewall_summary() {
        global $wpdb;

        $ip_table = $wpdb->prefix . 'ss_ip_list';
        $rules_table = $wpdb->prefix . 'ss_firewall_rules';

        $blocklist_count = 0;
        $allowlist_count = 0;
        if ( $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $ip_table ) ) === $ip_table ) {
            $blocklist_count = (int) $wpdb->get_var(
                $wpdb->prepare( "SELECT COUNT(*) FROM {$ip_table} WHERE list_type = %s", 'block' )
            );
            $allowlist_count = (int) $wpdb->get_var(
                $wpdb->prepare( "SELECT COUNT(*) FROM {$ip_table} WHERE list_type = %s", 'allow' )
            );
        }

        $active_rules = 0;
        if ( $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $rules_table ) ) === $rules_table ) {
            $active_rules = (int) $wpdb->get_var(
                "SELECT COUNT(*) FROM {$rules_table} WHERE is_active = 1"
            );
        }

        $blocked_countries = get_option( 'ss_blocked_countries', array() );
        $blocked_countries = is_array( $blocked_countries ) ? $blocked_countries : array();

        return array(
            'blocklist_count'     => $blocklist_count,
            'allowlist_count'     => $allowlist_count,
            'active_rules'        => $active_rules,
            'blocked_countries'   => count( $blocked_countries ),
        );
    }

    private function get_notification_summary() {
        $settings = Saman_Security_Settings::get_settings();
        $alerts = isset( $settings['notifications']['alerts'] ) ? $settings['notifications']['alerts'] : array();
        $enabled = count( array_filter( $alerts ) );

        return array(
            'recipient_email'       => $settings['notifications']['recipient_email'],
            'alerts_enabled'        => $enabled,
            'weekly_summary_enabled'=> (bool) $settings['notifications']['weekly_summary_enabled'],
        );
    }
}
