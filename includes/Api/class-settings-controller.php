<?php

class Saman_Security_Settings_Controller extends WP_REST_Controller {

    public function __construct() {
        $this->namespace = 'saman-security/v1';
        $this->rest_base = 'settings';
    }

    public function register_routes() {
        register_rest_route(
            $this->namespace,
            '/' . $this->rest_base,
            array(
                array(
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => array( $this, 'get_items' ),
                    'permission_callback' => array( $this, 'get_items_permissions_check' ),
                ),
                array(
                    'methods'             => WP_REST_Server::CREATABLE,
                    'callback'            => array( $this, 'create_item' ),
                    'permission_callback' => array( $this, 'create_item_permissions_check' ),
                ),
            )
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->rest_base . '/api-keys',
            array(
                array(
                    'methods'             => WP_REST_Server::CREATABLE,
                    'callback'            => array( $this, 'create_api_key' ),
                    'permission_callback' => array( $this, 'create_item_permissions_check' ),
                ),
            )
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->rest_base . '/api-keys/(?P<prefix>[a-zA-Z0-9_-]+)',
            array(
                array(
                    'methods'             => WP_REST_Server::DELETABLE,
                    'callback'            => array( $this, 'delete_api_key' ),
                    'permission_callback' => array( $this, 'create_item_permissions_check' ),
                ),
            )
        );
    }

    public function get_items( $request ) {
        return rest_ensure_response( Saman_Security_Settings::get_settings() );
    }

    public function create_item( $request ) {
        $params = $request->get_json_params();
        $settings = Saman_Security_Settings::update_settings( $params );
        return rest_ensure_response( $settings );
    }

    public function create_api_key( $request ) {
        $params = $request->get_json_params();
        $label = isset( $params['label'] ) ? $params['label'] : '';

        $data = Saman_Security_Settings::generate_api_key( $label );

        return rest_ensure_response( $data );
    }

    public function delete_api_key( $request ) {
        $prefix = $request['prefix'];
        $keys = Saman_Security_Settings::revoke_api_key( $prefix );

        return rest_ensure_response( $keys );
    }

    public function get_items_permissions_check( $request ) {
        return current_user_can( 'manage_options' );
    }

    public function create_item_permissions_check( $request ) {
        return current_user_can( 'manage_options' );
    }
}
