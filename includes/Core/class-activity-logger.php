<?php

class Saman_Security_Activity_Logger {
    public static function log_event( $type, $message, $user_id = 0, $ip_address = '', $user_name = '' ) {
        if ( defined( 'WP_CLI' ) && WP_CLI ) {
            return;
        }

        global $wpdb;
        $table_name = $wpdb->prefix . 'ss_activity_log';

        $table_exists = $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $table_name ) );
        if ( $table_exists !== $table_name ) {
            return;
        }

        $event_type = sanitize_key( $type );
        $event_message = sanitize_text_field( $message );
        $user_id = absint( $user_id );
        $user_name = is_string( $user_name ) ? sanitize_text_field( $user_name ) : '';

        if ( empty( $user_name ) && $user_id ) {
            $user = get_userdata( $user_id );
            if ( $user ) {
                $user_name = $user->user_login;
            }
        }

        $ip_address = $ip_address ? self::sanitize_ip( $ip_address ) : self::get_client_ip();
        if ( class_exists( 'Saman_Security_Settings' ) ) {
            $ip_address = Saman_Security_Settings::anonymize_ip( $ip_address );
        }

        $wpdb->insert(
            $table_name,
            array(
                'event_type'    => $event_type ? $event_type : 'info',
                'event_message' => $event_message,
                'user_id'       => $user_id,
                'user_name'     => $user_name ? $user_name : 'Unknown',
                'ip_address'    => $ip_address,
                'created_at'    => current_time( 'mysql' ),
            ),
            array( '%s', '%s', '%d', '%s', '%s', '%s' )
        );
    }

    private static function sanitize_ip( $ip_address ) {
        $ip_address = sanitize_text_field( wp_unslash( $ip_address ) );
        if ( ! filter_var( $ip_address, FILTER_VALIDATE_IP ) ) {
            return '';
        }

        return $ip_address;
    }

    private static function get_client_ip() {
        if ( empty( $_SERVER['REMOTE_ADDR'] ) ) {
            return '';
        }

        return self::sanitize_ip( $_SERVER['REMOTE_ADDR'] );
    }
}
