<?php

class Saman_Security_Firewall {
    public function run() {
        if ( defined( 'WP_CLI' ) && WP_CLI ) {
            return;
        }

        if ( is_user_logged_in() && current_user_can( 'manage_options' ) ) {
            return;
        }

        $ip_address = $this->get_client_ip();
        if ( empty( $ip_address ) ) {
            return;
        }

        if ( $this->is_ip_listed( $ip_address, 'allow' ) ) {
            return;
        }

        if ( $this->is_ip_listed( $ip_address, 'block' ) ) {
            $this->block_request( 'IP blocked by firewall', $ip_address );
            return;
        }

        if ( $this->is_autoblocked( $ip_address ) ) {
            $this->block_request( 'Rate limit auto-block', $ip_address );
            return;
        }

        if ( $this->is_geo_blocked( $ip_address ) ) {
            $this->block_request( 'Geo-blocked region', $ip_address );
            return;
        }

        $rule_match = $this->check_traffic_rules();
        if ( $rule_match ) {
            $this->record_rate_limit_hit( $ip_address );
            $this->block_request( $rule_match['message'], $ip_address, $rule_match );
        }
    }

    public function run_ip_block_check() {
        $this->run();
    }

    public static function get_default_rules() {
        return array(
            array(
                'description' => 'SQL injection patterns',
                'target_area' => 'GET',
                'pattern'     => '/\\b(union\\s+select|select\\s+.+\\s+from|insert\\s+into|drop\\s+table|or\\s+1=1|--|#)\\b/i',
            ),
            array(
                'description' => 'SQL injection patterns',
                'target_area' => 'POST',
                'pattern'     => '/\\b(union\\s+select|select\\s+.+\\s+from|insert\\s+into|drop\\s+table|or\\s+1=1|--|#)\\b/i',
            ),
            array(
                'description' => 'Cross-site scripting indicators',
                'target_area' => 'GET',
                'pattern'     => '/<\\s*script|javascript:|onerror\\s*=|onload\\s*=/i',
            ),
            array(
                'description' => 'Cross-site scripting indicators',
                'target_area' => 'POST',
                'pattern'     => '/<\\s*script|javascript:|onerror\\s*=|onload\\s*=/i',
            ),
            array(
                'description' => 'Directory traversal attempt',
                'target_area' => 'URL',
                'pattern'     => '/\\.\\.\\//',
            ),
            array(
                'description' => 'Access to sensitive files',
                'target_area' => 'URL',
                'pattern'     => '/(wp-config\\.php|\\.env|\\.git|\\.htaccess)/i',
            ),
            array(
                'description' => 'Known scanner user agents',
                'target_area' => 'USER_AGENT',
                'pattern'     => '/(sqlmap|nikto|acunetix|nmap|masscan|wpscan)/i',
            ),
        );
    }

    private function is_ip_listed( $ip_address, $list_type ) {
        global $wpdb;

        $table_name = $wpdb->prefix . 'ss_ip_list';
        $table_exists = $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $table_name ) );
        if ( $table_exists !== $table_name ) {
            return false;
        }

        $list_type = sanitize_key( $list_type );
        if ( ! in_array( $list_type, array( 'allow', 'block' ), true ) ) {
            return false;
        }

        $entry_id = $wpdb->get_var(
            $wpdb->prepare( "SELECT id FROM {$table_name} WHERE ip_address = %s AND list_type = %s LIMIT 1", $ip_address, $list_type )
        );

        return ! empty( $entry_id );
    }

    private function is_geo_blocked( $ip_address ) {
        $blocked_countries = get_option( 'ss_blocked_countries', array() );
        if ( empty( $blocked_countries ) || ! is_array( $blocked_countries ) ) {
            return false;
        }

        $country_code = $this->resolve_country_code( $ip_address );
        if ( empty( $country_code ) ) {
            return false;
        }

        return in_array( strtoupper( $country_code ), array_map( 'strtoupper', $blocked_countries ), true );
    }

    private function resolve_country_code( $ip_address ) {
        $country_code = apply_filters( 'saman_security_firewall_country_code', '', $ip_address );
        if ( ! empty( $country_code ) ) {
            return $country_code;
        }

        if ( class_exists( '\\GeoIp2\\Database\\Reader' ) && defined( 'SAMAN_SECURITY_GEOIP_DB' ) ) {
            try {
                $reader = new \GeoIp2\Database\Reader( SAMAN_SECURITY_GEOIP_DB );
                $record = $reader->country( $ip_address );
                return $record->country->isoCode;
            } catch ( Exception $exception ) {
                return '';
            }
        }

        return '';
    }

    private function check_traffic_rules() {
        global $wpdb;

        $table_name = $wpdb->prefix . 'ss_firewall_rules';
        $table_exists = $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $table_name ) );
        if ( $table_exists !== $table_name ) {
            return null;
        }

        $rules = $wpdb->get_results(
            "SELECT id, description, target_area, pattern FROM {$table_name} WHERE is_active = 1 ORDER BY id ASC",
            ARRAY_A
        );

        foreach ( $rules as $rule ) {
            $target_area = strtoupper( $rule['target_area'] );
            $pattern = $rule['pattern'];
            if ( empty( $pattern ) ) {
                continue;
            }

            $values = $this->get_target_values( $target_area );
            foreach ( $values as $value ) {
                if ( $value === '' ) {
                    continue;
                }

                if ( $this->pattern_matches( $pattern, $value ) ) {
                    return array(
                        'id'          => $rule['id'],
                        'description' => $rule['description'],
                        'target'      => $target_area,
                        'message'     => sprintf( 'Firewall rule matched: %s', $rule['description'] ),
                    );
                }
            }
        }

        return null;
    }

    private function is_autoblocked( $ip_address ) {
        $key = $this->get_autoblock_key( $ip_address );
        return (bool) get_transient( $key );
    }

    private function record_rate_limit_hit( $ip_address ) {
        $threshold = (int) Saman_Security_Settings::get_setting( array( 'firewall', 'ratelimit_threshold' ), 10 );
        $period = (int) Saman_Security_Settings::get_setting( array( 'firewall', 'ratelimit_period_seconds' ), 60 );
        $duration = (int) Saman_Security_Settings::get_setting( array( 'firewall', 'autoblock_duration_minutes' ), 60 );

        if ( $threshold <= 0 || $period <= 0 || $duration <= 0 ) {
            return;
        }

        $key = $this->get_rate_limit_key( $ip_address );
        $data = get_transient( $key );
        $now = time();

        if ( ! is_array( $data ) ) {
            $data = array(
                'count' => 0,
                'start' => $now,
            );
        }

        if ( ( $now - $data['start'] ) > $period ) {
            $data = array(
                'count' => 0,
                'start' => $now,
            );
        }

        $data['count']++;
        set_transient( $key, $data, $period );

        if ( $data['count'] >= $threshold ) {
            set_transient( $this->get_autoblock_key( $ip_address ), 1, $duration * MINUTE_IN_SECONDS );
            if ( class_exists( 'Saman_Security_Activity_Logger' ) ) {
                Saman_Security_Activity_Logger::log_event( 'blocked', 'Firewall auto-block triggered', 0, $ip_address );
            }
            Saman_Security_Notifications::send_alert(
                'firewall_block',
                'Firewall auto-block triggered due to repeated rule matches.',
                array( 'ip' => $ip_address )
            );
        }
    }

    private function get_target_values( $target_area ) {
        switch ( $target_area ) {
            case 'GET':
                return $this->flatten_values( $_GET );
            case 'POST':
                return $this->flatten_values( $_POST );
            case 'COOKIE':
                return $this->flatten_values( $_COOKIE );
            case 'USER_AGENT':
                return array( $this->get_user_agent() );
            case 'URL':
                return array( $this->get_request_url() );
            default:
                return array();
        }
    }

    private function flatten_values( $data ) {
        $values = array();

        if ( is_array( $data ) ) {
            foreach ( $data as $value ) {
                $values = array_merge( $values, $this->flatten_values( $value ) );
            }
            return $values;
        }

        if ( is_scalar( $data ) ) {
            $values[] = (string) $data;
        }

        return $values;
    }

    private function get_request_url() {
        if ( empty( $_SERVER['REQUEST_URI'] ) ) {
            return '';
        }

        return sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) );
    }

    private function get_user_agent() {
        if ( empty( $_SERVER['HTTP_USER_AGENT'] ) ) {
            return '';
        }

        return sanitize_text_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) );
    }

    private function pattern_matches( $pattern, $value ) {
        $pattern = trim( $pattern );
        if ( '' === $pattern ) {
            return false;
        }

        $normalized = $this->normalize_pattern( $pattern );
        if ( ! $this->is_regex_valid( $normalized ) ) {
            return false;
        }

        return (bool) preg_match( $normalized, $value );
    }

    private function normalize_pattern( $pattern ) {
        $delimiter = substr( $pattern, 0, 1 );
        if ( $delimiter && ! ctype_alnum( $delimiter ) && ! ctype_space( $delimiter ) && '\\' !== $delimiter ) {
            $last_delimiter = strrpos( $pattern, $delimiter );
            if ( false !== $last_delimiter && $last_delimiter > 0 ) {
                return $pattern;
            }
        }

        $escaped = str_replace( '/', '\\/', $pattern );
        return '/' . $escaped . '/i';
    }

    private function is_regex_valid( $pattern ) {
        return false !== @preg_match( $pattern, '' );
    }

    private function block_request( $reason, $ip_address, $rule_match = array() ) {
        if ( class_exists( 'Saman_Security_Activity_Logger' ) ) {
            $message = $reason;
            if ( ! empty( $rule_match['description'] ) ) {
                $message = sprintf( 'Firewall rule matched: %s', $rule_match['description'] );
            }
            Saman_Security_Activity_Logger::log_event( 'blocked', $message, 0, $ip_address );
        }

        Saman_Security_Notifications::send_alert(
            'firewall_block',
            $reason,
            array(
                'ip'   => $ip_address,
                'rule' => isset( $rule_match['description'] ) ? $rule_match['description'] : '',
            )
        );

        wp_die(
            esc_html__( 'You are blocked from accessing this site.', 'saman-security' ),
            esc_html__( 'Access denied', 'saman-security' ),
            array( 'response' => 403 )
        );
    }

    private function get_rate_limit_key( $ip_address ) {
        return 'ss_fw_hits_' . md5( $ip_address );
    }

    private function get_autoblock_key( $ip_address ) {
        return 'ss_fw_autoblock_' . md5( $ip_address );
    }

    private function get_client_ip() {
        if ( empty( $_SERVER['REMOTE_ADDR'] ) ) {
            return '';
        }

        $ip_address = sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) );
        if ( ! filter_var( $ip_address, FILTER_VALIDATE_IP ) ) {
            return '';
        }

        return $ip_address;
    }
}
