<?php

class Saman_Security_Settings {
    const OPTION_KEY = 'saman_security_settings';

    public static function get_defaults() {
        return array(
            'general'       => array(
                'ip_anonymization'       => true,
                'log_retention_days'     => 30,
                'delete_data_on_uninstall' => false,
            ),
            'firewall'      => array(
                'ratelimit_threshold'       => 10,
                'ratelimit_period_seconds'  => 60,
                'autoblock_duration_minutes'=> 60,
            ),
            'scanner'       => array(
                'scan_intensity'     => 'medium',
                'enable_auto_repair' => false,
                'scan_speed'         => 3,
                'cache_enabled'      => true,
                'cache_recheck_days' => 30,
            ),
            'notifications' => array(
                'recipient_email'       => '',
                'alerts'                => array(
                    'on_firewall_block'    => true,
                    'on_malware_found'     => true,
                    'on_core_file_modified'=> true,
                    'on_admin_login'       => false,
                    'on_user_login'        => false,
                ),
                'weekly_summary_enabled' => true,
                'weekly_summary_day'     => 'monday',
                'weekly_summary_time'    => '09:00',
            ),
            'integrations'  => array(
                'slack' => array(
                    'webhook_url' => '',
                ),
            ),
            'analytics'    => array(
                'enabled' => true,
            ),
            'api_keys'    => array(),
            'updated_at'  => '',
        );
    }

    public static function get_settings() {
        $defaults = self::get_defaults();
        $saved = get_option( self::OPTION_KEY, array() );
        $settings = self::sanitize_settings( $saved );

        $settings['api_keys'] = self::get_api_keys_public( $saved );
        $settings['updated_at'] = isset( $saved['updated_at'] ) ? sanitize_text_field( $saved['updated_at'] ) : $defaults['updated_at'];

        return $settings;
    }

    public static function update_settings( $settings ) {
        $existing = get_option( self::OPTION_KEY, array() );
        $sanitized = self::sanitize_settings( $settings, $existing );
        $sanitized['api_keys'] = self::get_api_keys_raw( $existing );
        $sanitized['updated_at'] = current_time( 'mysql' );
        update_option( self::OPTION_KEY, $sanitized );

        return self::get_settings();
    }

    public static function sanitize_settings( $settings, $existing = array() ) {
        $defaults = self::get_defaults();
        $settings = is_array( $settings ) ? $settings : array();
        $existing = is_array( $existing ) ? $existing : array();

        $general = self::merge_section( $defaults['general'], $existing, $settings, 'general' );
        $firewall = self::merge_section( $defaults['firewall'], $existing, $settings, 'firewall' );
        $scanner = self::merge_section( $defaults['scanner'], $existing, $settings, 'scanner' );
        $notifications = self::merge_section( $defaults['notifications'], $existing, $settings, 'notifications' );
        $integrations = self::merge_section( $defaults['integrations'], $existing, $settings, 'integrations' );
        $analytics = self::merge_section( $defaults['analytics'], $existing, $settings, 'analytics' );

        $general_sanitized = array(
            'ip_anonymization'        => self::normalize_bool( $general, 'ip_anonymization', $defaults['general']['ip_anonymization'] ),
            'log_retention_days'      => self::normalize_int( $general, 'log_retention_days', $defaults['general']['log_retention_days'], 0, 365 ),
            'delete_data_on_uninstall'=> self::normalize_bool( $general, 'delete_data_on_uninstall', $defaults['general']['delete_data_on_uninstall'] ),
        );

        $firewall_sanitized = array(
            'ratelimit_threshold'        => self::normalize_int( $firewall, 'ratelimit_threshold', $defaults['firewall']['ratelimit_threshold'], 1, 1000 ),
            'ratelimit_period_seconds'   => self::normalize_int( $firewall, 'ratelimit_period_seconds', $defaults['firewall']['ratelimit_period_seconds'], 10, 3600 ),
            'autoblock_duration_minutes' => self::normalize_int( $firewall, 'autoblock_duration_minutes', $defaults['firewall']['autoblock_duration_minutes'], 1, 1440 ),
        );

        $scan_intensity = isset( $scanner['scan_intensity'] ) ? sanitize_key( $scanner['scan_intensity'] ) : $defaults['scanner']['scan_intensity'];
        if ( ! in_array( $scan_intensity, array( 'low', 'medium', 'high' ), true ) ) {
            $scan_intensity = $defaults['scanner']['scan_intensity'];
        }

        $scanner_sanitized = array(
            'scan_intensity'     => $scan_intensity,
            'enable_auto_repair' => self::normalize_bool( $scanner, 'enable_auto_repair', $defaults['scanner']['enable_auto_repair'] ),
            'scan_speed'         => self::normalize_int( $scanner, 'scan_speed', $defaults['scanner']['scan_speed'], 1, 5 ),
            'cache_enabled'      => self::normalize_bool( $scanner, 'cache_enabled', $defaults['scanner']['cache_enabled'] ),
            'cache_recheck_days' => self::normalize_int( $scanner, 'cache_recheck_days', $defaults['scanner']['cache_recheck_days'], 1, 365 ),
        );

        $recipient_email = isset( $notifications['recipient_email'] ) ? sanitize_email( $notifications['recipient_email'] ) : '';
        $alerts = isset( $notifications['alerts'] ) && is_array( $notifications['alerts'] ) ? $notifications['alerts'] : array();

        $weekly_day = isset( $notifications['weekly_summary_day'] ) ? sanitize_key( $notifications['weekly_summary_day'] ) : $defaults['notifications']['weekly_summary_day'];
        $valid_days = array( 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday' );
        if ( ! in_array( $weekly_day, $valid_days, true ) ) {
            $weekly_day = $defaults['notifications']['weekly_summary_day'];
        }

        $weekly_time = isset( $notifications['weekly_summary_time'] ) ? sanitize_text_field( $notifications['weekly_summary_time'] ) : $defaults['notifications']['weekly_summary_time'];
        if ( ! preg_match( '/^\d{2}:\d{2}$/', $weekly_time ) ) {
            $weekly_time = $defaults['notifications']['weekly_summary_time'];
        }

        $notifications_sanitized = array(
            'recipient_email'        => $recipient_email,
            'alerts'                 => array(
                'on_firewall_block'     => self::normalize_bool( $alerts, 'on_firewall_block', $defaults['notifications']['alerts']['on_firewall_block'] ),
                'on_malware_found'      => self::normalize_bool( $alerts, 'on_malware_found', $defaults['notifications']['alerts']['on_malware_found'] ),
                'on_core_file_modified' => self::normalize_bool( $alerts, 'on_core_file_modified', $defaults['notifications']['alerts']['on_core_file_modified'] ),
                'on_admin_login'        => self::normalize_bool( $alerts, 'on_admin_login', $defaults['notifications']['alerts']['on_admin_login'] ),
                'on_user_login'         => self::normalize_bool( $alerts, 'on_user_login', $defaults['notifications']['alerts']['on_user_login'] ),
            ),
            'weekly_summary_enabled' => self::normalize_bool( $notifications, 'weekly_summary_enabled', $defaults['notifications']['weekly_summary_enabled'] ),
            'weekly_summary_day'     => $weekly_day,
            'weekly_summary_time'    => $weekly_time,
        );

        $slack = isset( $integrations['slack'] ) && is_array( $integrations['slack'] ) ? $integrations['slack'] : array();
        $integrations_sanitized = array(
            'slack' => array(
                'webhook_url' => isset( $slack['webhook_url'] ) ? esc_url_raw( $slack['webhook_url'] ) : '',
            ),
        );

        $analytics_sanitized = array(
            'enabled' => self::normalize_bool( $analytics, 'enabled', $defaults['analytics']['enabled'] ),
        );

        return array(
            'general'       => $general_sanitized,
            'firewall'      => $firewall_sanitized,
            'scanner'       => $scanner_sanitized,
            'notifications' => $notifications_sanitized,
            'integrations'  => $integrations_sanitized,
            'analytics'     => $analytics_sanitized,
            'updated_at'    => isset( $settings['updated_at'] ) ? sanitize_text_field( $settings['updated_at'] ) : '',
        );
    }

    public static function get_setting( $path, $default = null ) {
        $settings = self::get_settings();
        $value = $settings;
        foreach ( (array) $path as $segment ) {
            if ( ! is_array( $value ) || ! array_key_exists( $segment, $value ) ) {
                return $default;
            }
            $value = $value[ $segment ];
        }

        return $value;
    }

    public static function anonymize_ip( $ip_address ) {
        $enabled = self::get_setting( array( 'general', 'ip_anonymization' ), false );
        if ( ! $enabled ) {
            return $ip_address;
        }

        if ( filter_var( $ip_address, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 ) ) {
            $parts = explode( '.', $ip_address );
            $parts[3] = '0';
            return implode( '.', $parts );
        }

        if ( filter_var( $ip_address, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6 ) ) {
            $segments = explode( ':', $ip_address );
            $segments = array_pad( $segments, 8, '0000' );
            $segments[7] = '0000';
            return implode( ':', $segments );
        }

        return $ip_address;
    }

    public static function generate_api_key( $label = '' ) {
        $label = sanitize_text_field( $label );
        if ( '' === $label ) {
            $label = 'API Key';
        }

        $prefix = 'ss_live_' . substr( wp_generate_password( 6, false, false ), 0, 6 );
        $secret = wp_generate_password( 32, false, false );
        $full_key = $prefix . '_' . $secret;
        $hash = hash_hmac( 'sha256', $full_key, wp_salt( 'auth' ) );

        $entry = array(
            'key_hash'  => $hash,
            'key_prefix'=> $prefix,
            'label'     => $label,
            'user_id'   => get_current_user_id(),
            'created_at'=> current_time( 'mysql' ),
            'last_used' => null,
        );

        $settings = get_option( self::OPTION_KEY, array() );
        $settings = is_array( $settings ) ? $settings : array();
        $keys = isset( $settings['api_keys'] ) && is_array( $settings['api_keys'] ) ? $settings['api_keys'] : array();
        $keys[] = $entry;
        $settings['api_keys'] = $keys;
        $settings['updated_at'] = current_time( 'mysql' );

        update_option( self::OPTION_KEY, $settings );

        return array(
            'key'   => $full_key,
            'entry' => self::format_api_key_public( $entry ),
        );
    }

    public static function revoke_api_key( $prefix ) {
        $prefix = sanitize_text_field( $prefix );
        $settings = get_option( self::OPTION_KEY, array() );
        $settings = is_array( $settings ) ? $settings : array();
        $keys = isset( $settings['api_keys'] ) && is_array( $settings['api_keys'] ) ? $settings['api_keys'] : array();

        $filtered = array();
        foreach ( $keys as $entry ) {
            if ( isset( $entry['key_prefix'] ) && $entry['key_prefix'] === $prefix ) {
                continue;
            }
            $filtered[] = $entry;
        }

        $settings['api_keys'] = $filtered;
        $settings['updated_at'] = current_time( 'mysql' );
        update_option( self::OPTION_KEY, $settings );

        return self::get_api_keys_public( $settings );
    }

    private static function get_api_keys_raw( $settings ) {
        $settings = is_array( $settings ) ? $settings : array();
        return isset( $settings['api_keys'] ) && is_array( $settings['api_keys'] ) ? $settings['api_keys'] : array();
    }

    private static function get_api_keys_public( $settings ) {
        $keys = self::get_api_keys_raw( $settings );
        $public = array();
        foreach ( $keys as $entry ) {
            $public[] = self::format_api_key_public( $entry );
        }

        return $public;
    }

    private static function format_api_key_public( $entry ) {
        return array(
            'key_prefix' => isset( $entry['key_prefix'] ) ? $entry['key_prefix'] : '',
            'label'      => isset( $entry['label'] ) ? $entry['label'] : '',
            'user_id'    => isset( $entry['user_id'] ) ? (int) $entry['user_id'] : 0,
            'created_at' => isset( $entry['created_at'] ) ? $entry['created_at'] : '',
            'last_used'  => isset( $entry['last_used'] ) ? $entry['last_used'] : null,
        );
    }

    private static function merge_section( $defaults, $existing, $settings, $key ) {
        $existing_section = isset( $existing[ $key ] ) && is_array( $existing[ $key ] ) ? $existing[ $key ] : array();
        $new_section = isset( $settings[ $key ] ) && is_array( $settings[ $key ] ) ? $settings[ $key ] : array();

        return array_merge( $defaults, $existing_section, $new_section );
    }

    private static function normalize_bool( $settings, $key, $default ) {
        if ( ! array_key_exists( $key, $settings ) ) {
            return (bool) $default;
        }

        return filter_var( $settings[ $key ], FILTER_VALIDATE_BOOLEAN );
    }

    private static function normalize_int( $settings, $key, $default, $min, $max ) {
        if ( ! array_key_exists( $key, $settings ) ) {
            return (int) $default;
        }

        $value = absint( $settings[ $key ] );
        if ( $value < $min ) {
            return (int) $min;
        }
        if ( $value > $max ) {
            return (int) $max;
        }

        return $value;
    }
}
