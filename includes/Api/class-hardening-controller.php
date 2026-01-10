<?php

class WP_Security_Pilot_Hardening_Controller extends WP_REST_Controller {

    public function __construct() {
        $this->namespace = 'wp-security-pilot/v1';
        $this->rest_base = 'hardening';
    }

    public function register_routes() {
        register_rest_route(
            $this->namespace,
            '/' . $this->rest_base,
            array(
                array(
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => array( $this, 'get_item' ),
                    'permission_callback' => array( $this, 'get_items_permissions_check' ),
                ),
                array(
                    'methods'             => WP_REST_Server::CREATABLE,
                    'callback'            => array( $this, 'update_item' ),
                    'permission_callback' => array( $this, 'update_item_permissions_check' ),
                ),
            )
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->rest_base . '/export',
            array(
                array(
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => array( $this, 'export_item' ),
                    'permission_callback' => array( $this, 'get_items_permissions_check' ),
                ),
            )
        );
    }

    public function get_item( $request ) {
        return rest_ensure_response( WP_Security_Pilot_Hardening::get_settings() );
    }

    public function update_item( $request ) {
        $params = $request->get_json_params();
        $sanitized = WP_Security_Pilot_Hardening::sanitize_settings( $params );
        $sanitized['updated_at'] = current_time( 'mysql' );

        update_option( WP_Security_Pilot_Hardening::OPTION_KEY, $sanitized );

        if ( class_exists( 'WP_Security_Pilot_Activity_Logger' ) ) {
            WP_Security_Pilot_Activity_Logger::log_event( 'allowed', 'Hardening rules updated', get_current_user_id() );
        }

        return rest_ensure_response( $sanitized );
    }

    public function export_item( $request ) {
        $settings = WP_Security_Pilot_Hardening::get_settings();
        $json = wp_json_encode( $settings, JSON_PRETTY_PRINT );

        $response = new WP_REST_Response( $json );
        $response->header( 'Content-Type', 'application/json; charset=utf-8' );
        $response->header( 'Content-Disposition', 'attachment; filename=wp-security-pilot-hardening.json' );

        return $response;
    }

    public function get_items_permissions_check( $request ) {
        return current_user_can( 'manage_options' );
    }

    public function update_item_permissions_check( $request ) {
        return current_user_can( 'manage_options' );
    }
}
