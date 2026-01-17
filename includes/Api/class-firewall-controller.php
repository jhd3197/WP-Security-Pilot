<?php

class Saman_Security_Firewall_Controller extends WP_REST_Controller {

    public function __construct() {
        $this->namespace = 'saman-security/v1';
        $this->rest_base = 'firewall';
    }

    public function register_routes() {
        register_rest_route(
            $this->namespace,
            '/' . $this->rest_base . '/ips',
            array(
                array(
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => array( $this, 'get_ips' ),
                    'permission_callback' => array( $this, 'get_items_permissions_check' ),
                ),
                array(
                    'methods'             => WP_REST_Server::CREATABLE,
                    'callback'            => array( $this, 'add_ip' ),
                    'permission_callback' => array( $this, 'create_item_permissions_check' ),
                ),
            )
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->rest_base . '/ips/(?P<id>[\d]+)',
            array(
                array(
                    'methods'             => WP_REST_Server::DELETABLE,
                    'callback'            => array( $this, 'delete_ip' ),
                    'permission_callback' => array( $this, 'delete_item_permissions_check' ),
                ),
            )
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->rest_base . '/countries',
            array(
                array(
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => array( $this, 'get_countries' ),
                    'permission_callback' => array( $this, 'get_items_permissions_check' ),
                ),
                array(
                    'methods'             => WP_REST_Server::CREATABLE,
                    'callback'            => array( $this, 'update_countries' ),
                    'permission_callback' => array( $this, 'create_item_permissions_check' ),
                ),
            )
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->rest_base . '/rules',
            array(
                array(
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => array( $this, 'get_rules' ),
                    'permission_callback' => array( $this, 'get_items_permissions_check' ),
                ),
                array(
                    'methods'             => WP_REST_Server::CREATABLE,
                    'callback'            => array( $this, 'create_rule' ),
                    'permission_callback' => array( $this, 'create_item_permissions_check' ),
                ),
            )
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->rest_base . '/rules/(?P<id>[\d]+)',
            array(
                array(
                    'methods'             => WP_REST_Server::EDITABLE,
                    'callback'            => array( $this, 'update_rule' ),
                    'permission_callback' => array( $this, 'create_item_permissions_check' ),
                ),
            )
        );
    }

    public function get_ips( $request ) {
        global $wpdb;

        $table_name = $this->get_ip_table_name();
        if ( ! $this->table_exists( $table_name ) ) {
            return rest_ensure_response( array() );
        }

        $list_type = $this->sanitize_list_type( $request->get_param( 'list' ) );
        if ( empty( $list_type ) ) {
            $list_type = 'block';
        }

        $results = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT id, ip_address, list_type, reason, created_at FROM {$table_name} WHERE list_type = %s ORDER BY created_at DESC",
                $list_type
            ),
            ARRAY_A
        );

        return rest_ensure_response( $results );
    }

    public function add_ip( $request ) {
        global $wpdb;

        $table_name = $this->get_ip_table_name();
        if ( ! $this->table_exists( $table_name ) ) {
            return new WP_Error( 'ss_missing_table', 'Firewall IP table is missing.', array( 'status' => 500 ) );
        }

        $ip = $request->get_param( 'ip' );
        $reason = $request->get_param( 'reason' );
        $list_type = $request->get_param( 'list_type' );
        if ( empty( $list_type ) ) {
            $list_type = $request->get_param( 'list' );
        }

        $ip = is_string( $ip ) ? sanitize_text_field( $ip ) : '';
        $reason = is_string( $reason ) ? sanitize_text_field( $reason ) : '';
        $list_type = $this->sanitize_list_type( $list_type );

        if ( empty( $ip ) || ! filter_var( $ip, FILTER_VALIDATE_IP ) ) {
            return new WP_Error( 'ss_invalid_ip', 'Please provide a valid IP address.', array( 'status' => 400 ) );
        }

        if ( empty( $list_type ) ) {
            return new WP_Error( 'ss_invalid_list', 'Please select a valid list type.', array( 'status' => 400 ) );
        }

        $existing = $wpdb->get_row(
            $wpdb->prepare( "SELECT id, list_type FROM {$table_name} WHERE ip_address = %s LIMIT 1", $ip ),
            ARRAY_A
        );

        if ( $existing ) {
            if ( $existing['list_type'] === $list_type ) {
                return new WP_Error( 'ss_ip_exists', 'This IP address already exists in the selected list.', array( 'status' => 409 ) );
            }

            return new WP_Error( 'ss_ip_conflict', 'This IP address already exists in the opposite list.', array( 'status' => 409 ) );
        }

        $inserted = $wpdb->insert(
            $table_name,
            array(
                'ip_address' => $ip,
                'list_type'  => $list_type,
                'reason'     => $reason,
                'created_at' => current_time( 'mysql' ),
            ),
            array( '%s', '%s', '%s', '%s' )
        );

        if ( false === $inserted ) {
            return new WP_Error( 'ss_insert_failed', 'Unable to save the IP address.', array( 'status' => 500 ) );
        }

        if ( class_exists( 'Saman_Security_Activity_Logger' ) ) {
            $message = ( 'allow' === $list_type ) ? 'Firewall allowlist updated' : 'Firewall blocklist updated';
            Saman_Security_Activity_Logger::log_event( 'allowed', $message, get_current_user_id() );
        }

        return rest_ensure_response(
            array(
                'success' => true,
                'id'      => $wpdb->insert_id,
            )
        );
    }

    public function delete_ip( $request ) {
        global $wpdb;

        $table_name = $this->get_ip_table_name();
        if ( ! $this->table_exists( $table_name ) ) {
            return new WP_Error( 'ss_missing_table', 'Firewall IP table is missing.', array( 'status' => 500 ) );
        }

        $id = absint( $request['id'] );
        if ( ! $id ) {
            return new WP_Error( 'ss_invalid_id', 'Invalid blocked IP ID.', array( 'status' => 400 ) );
        }

        $list_type = $wpdb->get_var(
            $wpdb->prepare( "SELECT list_type FROM {$table_name} WHERE id = %d LIMIT 1", $id )
        );

        $deleted = $wpdb->delete( $table_name, array( 'id' => $id ), array( '%d' ) );
        if ( false === $deleted ) {
            return new WP_Error( 'ss_delete_failed', 'Unable to remove the blocked IP.', array( 'status' => 500 ) );
        }

        if ( 0 === $deleted ) {
            return new WP_Error( 'ss_not_found', 'Blocked IP not found.', array( 'status' => 404 ) );
        }

        if ( class_exists( 'Saman_Security_Activity_Logger' ) ) {
            $message = ( 'allow' === $list_type ) ? 'Firewall allowlist updated' : 'Firewall blocklist updated';
            Saman_Security_Activity_Logger::log_event( 'allowed', $message, get_current_user_id() );
        }

        return rest_ensure_response( array( 'success' => true ) );
    }

    public function get_countries( $request ) {
        $countries = get_option( 'ss_blocked_countries', array() );
        if ( ! is_array( $countries ) ) {
            $countries = array();
        }

        return rest_ensure_response( array_values( $countries ) );
    }

    public function update_countries( $request ) {
        $params = $request->get_json_params();
        $countries = isset( $params['countries'] ) ? $params['countries'] : $params;

        if ( ! is_array( $countries ) ) {
            return new WP_Error( 'ss_invalid_countries', 'Please provide a list of country codes.', array( 'status' => 400 ) );
        }

        $sanitized = array();
        foreach ( $countries as $code ) {
            $code = strtoupper( sanitize_text_field( $code ) );
            if ( preg_match( '/^[A-Z]{2}$/', $code ) ) {
                $sanitized[] = $code;
            }
        }

        $sanitized = array_values( array_unique( $sanitized ) );
        update_option( 'ss_blocked_countries', $sanitized );

        if ( class_exists( 'Saman_Security_Activity_Logger' ) ) {
            Saman_Security_Activity_Logger::log_event( 'allowed', 'Geo-blocking rules updated', get_current_user_id() );
        }

        return rest_ensure_response( $sanitized );
    }

    public function get_rules( $request ) {
        global $wpdb;

        $table_name = $this->get_rules_table_name();
        if ( ! $this->table_exists( $table_name ) ) {
            return rest_ensure_response( array() );
        }

        $results = $wpdb->get_results(
            "SELECT id, description, target_area, pattern, is_active, is_custom, created_at FROM {$table_name} ORDER BY is_custom ASC, id ASC",
            ARRAY_A
        );

        foreach ( $results as &$rule ) {
            $rule['is_active'] = (bool) $rule['is_active'];
            $rule['is_custom'] = (bool) $rule['is_custom'];
        }

        return rest_ensure_response( $results );
    }

    public function update_rule( $request ) {
        global $wpdb;

        $table_name = $this->get_rules_table_name();
        if ( ! $this->table_exists( $table_name ) ) {
            return new WP_Error( 'ss_missing_table', 'Firewall rules table is missing.', array( 'status' => 500 ) );
        }

        $id = absint( $request['id'] );
        if ( ! $id ) {
            return new WP_Error( 'ss_invalid_id', 'Invalid rule ID.', array( 'status' => 400 ) );
        }

        $params = $request->get_json_params();
        if ( ! isset( $params['is_active'] ) ) {
            return new WP_Error( 'ss_invalid_rule', 'Missing rule status.', array( 'status' => 400 ) );
        }

        $is_active = filter_var( $params['is_active'], FILTER_VALIDATE_BOOLEAN );

        $updated = $wpdb->update(
            $table_name,
            array( 'is_active' => $is_active ? 1 : 0 ),
            array( 'id' => $id ),
            array( '%d' ),
            array( '%d' )
        );

        if ( false === $updated ) {
            return new WP_Error( 'ss_update_failed', 'Unable to update firewall rule.', array( 'status' => 500 ) );
        }

        if ( class_exists( 'Saman_Security_Activity_Logger' ) ) {
            Saman_Security_Activity_Logger::log_event( 'allowed', 'Firewall rule toggled', get_current_user_id() );
        }

        return rest_ensure_response( array( 'success' => true ) );
    }

    public function create_rule( $request ) {
        global $wpdb;

        $table_name = $this->get_rules_table_name();
        if ( ! $this->table_exists( $table_name ) ) {
            return new WP_Error( 'ss_missing_table', 'Firewall rules table is missing.', array( 'status' => 500 ) );
        }

        $params = $request->get_json_params();
        $description = isset( $params['description'] ) ? sanitize_text_field( $params['description'] ) : '';
        $target_area = isset( $params['target_area'] ) ? sanitize_key( $params['target_area'] ) : '';
        $pattern = isset( $params['pattern'] ) ? trim( $params['pattern'] ) : '';

        if ( empty( $description ) || empty( $target_area ) || empty( $pattern ) ) {
            return new WP_Error( 'ss_invalid_rule', 'Please provide description, target area, and pattern.', array( 'status' => 400 ) );
        }

        if ( ! in_array( strtoupper( $target_area ), array( 'GET', 'POST', 'COOKIE', 'USER_AGENT', 'URL' ), true ) ) {
            return new WP_Error( 'ss_invalid_target', 'Invalid target area.', array( 'status' => 400 ) );
        }

        $pattern = $this->normalize_pattern( $pattern );
        if ( ! $this->is_regex_valid( $pattern ) ) {
            return new WP_Error( 'ss_invalid_pattern', 'Invalid regex pattern.', array( 'status' => 400 ) );
        }

        $inserted = $wpdb->insert(
            $table_name,
            array(
                'description' => $description,
                'target_area' => strtoupper( $target_area ),
                'pattern'     => $pattern,
                'is_active'   => 1,
                'is_custom'   => 1,
                'created_at'  => current_time( 'mysql' ),
            ),
            array( '%s', '%s', '%s', '%d', '%d', '%s' )
        );

        if ( false === $inserted ) {
            return new WP_Error( 'ss_insert_failed', 'Unable to create firewall rule.', array( 'status' => 500 ) );
        }

        if ( class_exists( 'Saman_Security_Activity_Logger' ) ) {
            Saman_Security_Activity_Logger::log_event( 'allowed', 'Custom firewall rule added', get_current_user_id() );
        }

        return rest_ensure_response( array( 'success' => true, 'id' => $wpdb->insert_id ) );
    }

    public function get_items_permissions_check( $request ) {
        return current_user_can( 'manage_options' );
    }

    public function create_item_permissions_check( $request ) {
        return current_user_can( 'manage_options' );
    }

    public function delete_item_permissions_check( $request ) {
        return current_user_can( 'manage_options' );
    }

    private function get_ip_table_name() {
        global $wpdb;
        return $wpdb->prefix . 'ss_ip_list';
    }

    private function get_rules_table_name() {
        global $wpdb;
        return $wpdb->prefix . 'ss_firewall_rules';
    }

    private function table_exists( $table_name ) {
        global $wpdb;
        $result = $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $table_name ) );
        return $result === $table_name;
    }

    private function sanitize_list_type( $list_type ) {
        $list_type = is_string( $list_type ) ? sanitize_key( $list_type ) : '';
        return in_array( $list_type, array( 'allow', 'block' ), true ) ? $list_type : '';
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
}
