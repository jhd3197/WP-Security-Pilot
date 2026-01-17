<?php

class Saman_Security_Notifications {
    public static function send_alert( $type, $message, $context = array() ) {
        $settings = Saman_Security_Settings::get_settings();
        $alerts = isset( $settings['notifications']['alerts'] ) ? $settings['notifications']['alerts'] : array();

        $mapping = array(
            'firewall_block'     => 'on_firewall_block',
            'malware_found'      => 'on_malware_found',
            'core_file_modified' => 'on_core_file_modified',
            'admin_login'        => 'on_admin_login',
            'user_login'         => 'on_user_login',
        );

        if ( isset( $mapping[ $type ] ) ) {
            $key = $mapping[ $type ];
            if ( empty( $alerts[ $key ] ) ) {
                return;
            }
        }

        $recipient = $settings['notifications']['recipient_email'];
        if ( empty( $recipient ) ) {
            $recipient = get_option( 'admin_email' );
        }

        $subject = sprintf( '[Saman Security] %s', ucwords( str_replace( '_', ' ', $type ) ) );
        $body = $message;

        if ( ! empty( $context ) ) {
            if ( isset( $context['ip'] ) ) {
                $context['ip'] = Saman_Security_Settings::anonymize_ip( $context['ip'] );
            }
            $body .= "\n\n" . wp_json_encode( $context, JSON_PRETTY_PRINT );
        }

        wp_mail( $recipient, $subject, $body );

        $webhook = $settings['integrations']['slack']['webhook_url'];
        if ( ! empty( $webhook ) ) {
            wp_remote_post(
                $webhook,
                array(
                    'headers' => array( 'Content-Type' => 'application/json' ),
                    'body'    => wp_json_encode(
                        array(
                            'text' => $subject . "\n" . $message,
                        )
                    ),
                    'timeout' => 5,
                )
            );
        }
    }

    public static function send_weekly_summary() {
        $enabled = Saman_Security_Settings::get_setting( array( 'notifications', 'weekly_summary_enabled' ), true );
        if ( ! $enabled ) {
            return;
        }

        global $wpdb;

        $seven_days_ago = gmdate( 'Y-m-d H:i:s', strtotime( '-7 days' ) );

        // Gather firewall blocks count.
        $firewall_blocks = (int) $wpdb->get_var(
            $wpdb->prepare(
                "SELECT COUNT(*) FROM {$wpdb->prefix}wpsp_activity_log WHERE event_type = 'blocked' AND created_at >= %s",
                $seven_days_ago
            )
        );

        // Gather login attempts.
        $successful_logins = (int) $wpdb->get_var(
            $wpdb->prepare(
                "SELECT COUNT(*) FROM {$wpdb->prefix}wpsp_activity_log WHERE event_type = 'allowed' AND event_message LIKE %s AND created_at >= %s",
                '%login%',
                $seven_days_ago
            )
        );

        $failed_logins = (int) $wpdb->get_var(
            $wpdb->prepare(
                "SELECT COUNT(*) FROM {$wpdb->prefix}wpsp_activity_log WHERE event_type = 'blocked' AND event_message LIKE %s AND created_at >= %s",
                '%Brute force%',
                $seven_days_ago
            )
        );

        // Gather scan results.
        $scan_issues = (int) $wpdb->get_var(
            $wpdb->prepare(
                "SELECT COUNT(*) FROM {$wpdb->prefix}wpsp_scan_results WHERE status != 'clean' AND created_at >= %s",
                $seven_days_ago
            )
        );

        // Get last scan info.
        $last_scan = $wpdb->get_row(
            "SELECT started_at, status FROM {$wpdb->prefix}wpsp_scan_jobs ORDER BY id DESC LIMIT 1"
        );
        $last_scan_date   = $last_scan ? $last_scan->started_at : 'Never';
        $last_scan_status = $last_scan ? ucfirst( $last_scan->status ) : 'N/A';

        // Get plugin version from GitHub Updater if available.
        $plugin_version = SAMAN_SECURITY_VERSION;
        $update_status  = 'Up to date';

        if ( class_exists( 'Saman_Security_GitHub_Updater' ) ) {
            $updater     = Saman_Security_GitHub_Updater::get_instance();
            $latest_info = $updater->get_latest_release_info();
            if ( $latest_info && ! empty( $latest_info['version'] ) ) {
                if ( version_compare( $latest_info['version'], $plugin_version, '>' ) ) {
                    $update_status = 'Update available: ' . $latest_info['version'];
                }
            }
        }

        // WordPress and PHP versions.
        global $wp_version;
        $php_version = phpversion();

        // Build email.
        $settings  = Saman_Security_Settings::get_settings();
        $recipient = $settings['notifications']['recipient_email'];
        if ( empty( $recipient ) ) {
            $recipient = get_option( 'admin_email' );
        }

        $site_name = get_bloginfo( 'name' );
        $site_url  = home_url();

        $subject = sprintf( '[Saman Security] Weekly Security Summary - %s', $site_name );

        $body = self::build_weekly_summary_html(
            array(
                'site_name'         => $site_name,
                'site_url'          => $site_url,
                'firewall_blocks'   => $firewall_blocks,
                'successful_logins' => $successful_logins,
                'failed_logins'     => $failed_logins,
                'scan_issues'       => $scan_issues,
                'last_scan_date'    => $last_scan_date,
                'last_scan_status'  => $last_scan_status,
                'plugin_version'    => $plugin_version,
                'update_status'     => $update_status,
                'wp_version'        => $wp_version,
                'php_version'       => $php_version,
            )
        );

        $headers = array( 'Content-Type: text/html; charset=UTF-8' );

        wp_mail( $recipient, $subject, $body, $headers );

        // Send to Slack if configured.
        $webhook = $settings['integrations']['slack']['webhook_url'];
        if ( ! empty( $webhook ) ) {
            $slack_text = sprintf(
                "*Weekly Security Summary - %s*\n\n" .
                "Firewall Blocks: %d\n" .
                "Successful Logins: %d\n" .
                "Failed Login Attempts: %d\n" .
                "Scan Issues Found: %d\n" .
                "Last Scan: %s (%s)\n" .
                "Plugin Version: %s (%s)\n" .
                "WordPress: %s | PHP: %s",
                $site_name,
                $firewall_blocks,
                $successful_logins,
                $failed_logins,
                $scan_issues,
                $last_scan_date,
                $last_scan_status,
                $plugin_version,
                $update_status,
                $wp_version,
                $php_version
            );

            wp_remote_post(
                $webhook,
                array(
                    'headers' => array( 'Content-Type' => 'application/json' ),
                    'body'    => wp_json_encode( array( 'text' => $slack_text ) ),
                    'timeout' => 5,
                )
            );
        }
    }

    private static function build_weekly_summary_html( $data ) {
        $html = '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Oxygen, Ubuntu, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="background-color: #1e3a5f; padding: 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Weekly Security Summary</h1>
                            <p style="color: #a0c4e8; margin: 10px 0 0 0; font-size: 14px;">' . esc_html( $data['site_name'] ) . '</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px;">
                            <p style="color: #666; margin: 0 0 20px 0; font-size: 14px;">Here\'s your security overview for the past 7 days:</p>

                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                                <tr>
                                    <td width="50%" style="padding: 15px; background-color: #f8f9fa; border-radius: 8px; text-align: center;">
                                        <div style="font-size: 32px; font-weight: bold; color: #dc3545;">' . esc_html( $data['firewall_blocks'] ) . '</div>
                                        <div style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Firewall Blocks</div>
                                    </td>
                                    <td width="10"></td>
                                    <td width="50%" style="padding: 15px; background-color: #f8f9fa; border-radius: 8px; text-align: center;">
                                        <div style="font-size: 32px; font-weight: bold; color: #fd7e14;">' . esc_html( $data['scan_issues'] ) . '</div>
                                        <div style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Scan Issues</div>
                                    </td>
                                </tr>
                            </table>

                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                                <tr>
                                    <td width="50%" style="padding: 15px; background-color: #f8f9fa; border-radius: 8px; text-align: center;">
                                        <div style="font-size: 32px; font-weight: bold; color: #28a745;">' . esc_html( $data['successful_logins'] ) . '</div>
                                        <div style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Successful Logins</div>
                                    </td>
                                    <td width="10"></td>
                                    <td width="50%" style="padding: 15px; background-color: #f8f9fa; border-radius: 8px; text-align: center;">
                                        <div style="font-size: 32px; font-weight: bold; color: #dc3545;">' . esc_html( $data['failed_logins'] ) . '</div>
                                        <div style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Failed Logins</div>
                                    </td>
                                </tr>
                            </table>

                            <h3 style="color: #333; font-size: 16px; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #e9ecef;">System Status</h3>

                            <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px;">
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #666;">Last Scan</td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; text-align: right; color: #333;">' . esc_html( $data['last_scan_date'] ) . ' <span style="color: #666;">(' . esc_html( $data['last_scan_status'] ) . ')</span></td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #666;">Plugin Version</td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; text-align: right; color: #333;">' . esc_html( $data['plugin_version'] ) . ' <span style="color: ' . ( strpos( $data['update_status'], 'Update' ) !== false ? '#fd7e14' : '#28a745' ) . ';">(' . esc_html( $data['update_status'] ) . ')</span></td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #666;">WordPress</td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; text-align: right; color: #333;">' . esc_html( $data['wp_version'] ) . '</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; color: #666;">PHP</td>
                                    <td style="padding: 10px 0; text-align: right; color: #333;">' . esc_html( $data['php_version'] ) . '</td>
                                </tr>
                            </table>

                            <div style="margin-top: 30px; text-align: center;">
                                <a href="' . esc_url( admin_url( 'admin.php?page=saman-security' ) ) . '" style="display: inline-block; padding: 12px 30px; background-color: #1e3a5f; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 600;">View Dashboard</a>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="color: #999; font-size: 12px; margin: 0;">This email was sent by Saman Security from ' . esc_html( $data['site_url'] ) . '</p>
                            <p style="color: #999; font-size: 12px; margin: 5px 0 0 0;">You can manage your notification settings in the plugin settings.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>';

        return $html;
    }
}
