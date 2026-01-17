<?php

class Saman_Security_Activity_Controller extends WP_REST_Controller {

    public function __construct() {
        $this->namespace = 'saman-security/v1';
        $this->rest_base = 'activity';
    }

    public function register_routes() {
        register_rest_route(
            $this->namespace,
            '/' . $this->rest_base . '/logs',
            array(
                array(
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => array( $this, 'get_logs' ),
                    'permission_callback' => array( $this, 'get_items_permissions_check' ),
                    'args'                => array(
                        'search'   => array(
                            'sanitize_callback' => 'sanitize_text_field',
                        ),
                        'per_page' => array(
                            'sanitize_callback' => 'absint',
                            'default'           => 50,
                        ),
                        'page'     => array(
                            'sanitize_callback' => 'absint',
                            'default'           => 1,
                        ),
                    ),
                ),
            )
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->rest_base . '/logs/export',
            array(
                array(
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => array( $this, 'export_logs' ),
                    'permission_callback' => array( $this, 'get_items_permissions_check' ),
                    'args'                => array(
                        'search' => array(
                            'sanitize_callback' => 'sanitize_text_field',
                        ),
                    ),
                ),
            )
        );
    }

    public function get_logs( $request ) {
        global $wpdb;

        $table_name = $this->get_table_name();
        if ( ! $this->table_exists( $table_name ) ) {
            return rest_ensure_response( array() );
        }

        $search = $request->get_param( 'search' );
        $per_page = (int) $request->get_param( 'per_page' );
        $page = (int) $request->get_param( 'page' );

        if ( $per_page < 1 ) {
            $per_page = 50;
        }
        if ( $per_page > 200 ) {
            $per_page = 200;
        }
        if ( $page < 1 ) {
            $page = 1;
        }

        $offset = ( $page - 1 ) * $per_page;

        $where = '1=1';
        $params = array();
        if ( ! empty( $search ) ) {
            $like = '%' . $wpdb->esc_like( $search ) . '%';
            $where .= ' AND (event_message LIKE %s OR user_name LIKE %s OR ip_address LIKE %s)';
            $params[] = $like;
            $params[] = $like;
            $params[] = $like;
        }

        $sql = "SELECT id, event_type, event_message, user_name, ip_address, created_at
            FROM {$table_name}
            WHERE {$where}
            ORDER BY created_at DESC
            LIMIT %d OFFSET %d";

        $params[] = $per_page;
        $params[] = $offset;

        $prepared = $wpdb->prepare( $sql, $params );
        $results = $wpdb->get_results( $prepared, ARRAY_A );

        return rest_ensure_response( $results );
    }

    public function export_logs( $request ) {
        global $wpdb;

        $table_name = $this->get_table_name();
        if ( ! $this->table_exists( $table_name ) ) {
            return new WP_Error( 'ss_missing_table', 'Activity log table is missing.', array( 'status' => 500 ) );
        }

        $search = $request->get_param( 'search' );
        $where = '1=1';
        $params = array();
        if ( ! empty( $search ) ) {
            $like = '%' . $wpdb->esc_like( $search ) . '%';
            $where .= ' AND (event_message LIKE %s OR user_name LIKE %s OR ip_address LIKE %s)';
            $params[] = $like;
            $params[] = $like;
            $params[] = $like;
        }

        $sql = "SELECT event_type, event_message, user_name, ip_address, created_at
            FROM {$table_name}
            WHERE {$where}
            ORDER BY created_at DESC";

        $prepared = $params ? $wpdb->prepare( $sql, $params ) : $sql;
        $results = $wpdb->get_results( $prepared, ARRAY_A );

        $handle = fopen( 'php://temp', 'r+' );
        fputcsv( $handle, array( 'Event Type', 'Event', 'User', 'IP', 'Time' ) );
        foreach ( $results as $row ) {
            fputcsv(
                $handle,
                array(
                    $row['event_type'],
                    $row['event_message'],
                    $row['user_name'],
                    $row['ip_address'],
                    $row['created_at'],
                )
            );
        }
        rewind( $handle );
        $csv = stream_get_contents( $handle );
        fclose( $handle );

        $response = new WP_REST_Response( $csv );
        $response->header( 'Content-Type', 'text/csv; charset=utf-8' );
        $response->header( 'Content-Disposition', 'attachment; filename=saman-security-activity-log.csv' );

        return $response;
    }

    public function get_items_permissions_check( $request ) {
        return current_user_can( 'manage_options' );
    }

    private function get_table_name() {
        global $wpdb;
        return $wpdb->prefix . 'ss_activity_log';
    }

    private function table_exists( $table_name ) {
        global $wpdb;
        $result = $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $table_name ) );
        return $result === $table_name;
    }
}
