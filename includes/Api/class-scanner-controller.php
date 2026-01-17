<?php

class Saman_Security_Scanner_Controller extends WP_REST_Controller {

    public function __construct() {
        $this->namespace = 'saman-security/v1';
        $this->rest_base = 'scanner';
    }

    public function register_routes() {
        register_rest_route(
            $this->namespace,
            '/' . $this->rest_base . '/start',
            array(
                array(
                    'methods'             => WP_REST_Server::CREATABLE,
                    'callback'            => array( $this, 'start_scan' ),
                    'permission_callback' => array( $this, 'manage_scanner_permissions_check' ),
                ),
            )
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->rest_base . '/status',
            array(
                array(
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => array( $this, 'get_latest_status' ),
                    'permission_callback' => array( $this, 'manage_scanner_permissions_check' ),
                ),
            )
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->rest_base . '/status/(?P<job_id>[\\d]+)',
            array(
                array(
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => array( $this, 'get_status' ),
                    'permission_callback' => array( $this, 'manage_scanner_permissions_check' ),
                ),
            )
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->rest_base . '/stop/(?P<job_id>[\\d]+)',
            array(
                array(
                    'methods'             => WP_REST_Server::CREATABLE,
                    'callback'            => array( $this, 'stop_scan' ),
                    'permission_callback' => array( $this, 'manage_scanner_permissions_check' ),
                ),
            )
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->rest_base . '/ignore',
            array(
                array(
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => array( $this, 'get_ignore' ),
                    'permission_callback' => array( $this, 'manage_scanner_permissions_check' ),
                ),
                array(
                    'methods'             => WP_REST_Server::CREATABLE,
                    'callback'            => array( $this, 'update_ignore' ),
                    'permission_callback' => array( $this, 'manage_scanner_permissions_check' ),
                ),
            )
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->rest_base . '/schedule',
            array(
                array(
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => array( $this, 'get_schedule' ),
                    'permission_callback' => array( $this, 'manage_scanner_permissions_check' ),
                ),
                array(
                    'methods'             => WP_REST_Server::CREATABLE,
                    'callback'            => array( $this, 'update_schedule' ),
                    'permission_callback' => array( $this, 'manage_scanner_permissions_check' ),
                ),
            )
        );
    }

    public function start_scan( $request ) {
        $scanner = new Saman_Security_Scanner();
        $job_id = $scanner->start_scan();

        if ( ! $job_id ) {
            return new WP_Error( 'ss_scan_failed', 'Unable to start scan.', array( 'status' => 500 ) );
        }

        return rest_ensure_response( array( 'job_id' => $job_id ) );
    }

    public function get_status( $request ) {
        $scanner = new Saman_Security_Scanner();
        $status = $scanner->get_status( $request['job_id'] );

        if ( ! $status ) {
            return new WP_Error( 'ss_scan_not_found', 'Scan job not found.', array( 'status' => 404 ) );
        }

        return rest_ensure_response( $status );
    }

    public function get_latest_status( $request ) {
        $scanner = new Saman_Security_Scanner();
        $status = $scanner->get_latest_status();

        if ( ! $status ) {
            return rest_ensure_response( array( 'status' => 'idle', 'progress' => 0, 'results' => array() ) );
        }

        return rest_ensure_response( $status );
    }

    public function stop_scan( $request ) {
        $scanner = new Saman_Security_Scanner();
        $stopped = $scanner->stop_scan( $request['job_id'] );

        if ( ! $stopped ) {
            return new WP_Error( 'ss_scan_stop_failed', 'Unable to stop scan.', array( 'status' => 500 ) );
        }

        return rest_ensure_response( array( 'success' => true ) );
    }

    public function get_ignore( $request ) {
        $scanner = new Saman_Security_Scanner();
        return rest_ensure_response( $scanner->get_ignore_patterns() );
    }

    public function update_ignore( $request ) {
        $params = $request->get_json_params();
        $patterns = isset( $params['patterns'] ) ? $params['patterns'] : $params;

        if ( ! is_array( $patterns ) ) {
            return new WP_Error( 'ss_invalid_ignore', 'Please provide ignore patterns.', array( 'status' => 400 ) );
        }

        $scanner = new Saman_Security_Scanner();
        $saved = $scanner->set_ignore_patterns( $patterns );

        return rest_ensure_response( $saved );
    }

    public function get_schedule( $request ) {
        $scanner = new Saman_Security_Scanner();
        return rest_ensure_response( $scanner->get_schedule() );
    }

    public function update_schedule( $request ) {
        $params = $request->get_json_params();
        if ( ! is_array( $params ) ) {
            return new WP_Error( 'ss_invalid_schedule', 'Please provide schedule settings.', array( 'status' => 400 ) );
        }

        $scanner = new Saman_Security_Scanner();
        $schedule = $scanner->update_schedule( $params );

        return rest_ensure_response( $schedule );
    }

    public function manage_scanner_permissions_check( $request ) {
        return current_user_can( 'manage_options' );
    }
}
