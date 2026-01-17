<?php

class Saman_Security_Hardening {
    const OPTION_KEY = 'saman_security_hardening';

    public function register_hooks() {
        add_filter( 'xmlrpc_enabled', array( $this, 'filter_xmlrpc_enabled' ) );
        add_filter( 'xmlrpc_methods', array( $this, 'filter_xmlrpc_methods' ) );
        add_filter( 'the_generator', array( $this, 'filter_generator' ) );
        add_action( 'init', array( $this, 'maybe_remove_generator_tag' ) );
        add_filter( 'user_has_cap', array( $this, 'filter_file_editor_caps' ), 10, 3 );
        add_filter( 'rest_authentication_errors', array( $this, 'filter_rest_authentication_errors' ), 20 );
        add_filter( 'authenticate', array( $this, 'filter_login_lockouts' ), 30, 3 );
        add_action( 'wp_login_failed', array( $this, 'track_login_failure' ) );
        add_action( 'wp_login', array( $this, 'clear_login_attempts' ), 10, 2 );
        add_filter( 'registration_errors', array( $this, 'validate_registration_password' ), 10, 3 );
        add_action( 'user_profile_update_errors', array( $this, 'validate_profile_password' ), 10, 3 );
    }

    public static function get_defaults() {
        return array(
            'general'   => array(
                'xmlrpc_mode'             => 'disable',
                'disable_file_editor'     => true,
                'limit_login_attempts'    => 3,
                'login_window_minutes'    => 15,
                'login_lockout_minutes'   => 30,
                'hide_wp_version'         => true,
            ),
            'rest'      => array(
                'access'        => 'authenticated',
                'allowed_roles' => array( 'administrator' ),
                'allowlist'     => array(),
            ),
            'passwords' => array(
                'min_length'    => 12,
                'require_upper' => true,
                'require_lower' => true,
                'require_number'=> true,
                'require_special' => false,
                'block_common'  => true,
            ),
            'updated_at' => '',
        );
    }

    public static function get_settings() {
        $defaults = self::get_defaults();
        $saved = get_option( self::OPTION_KEY, array() );
        if ( ! is_array( $saved ) ) {
            $saved = array();
        }

        $settings = self::sanitize_settings( $saved );
        $settings['updated_at'] = isset( $saved['updated_at'] ) ? sanitize_text_field( $saved['updated_at'] ) : $defaults['updated_at'];

        return $settings;
    }

    public static function sanitize_settings( $settings ) {
        $defaults = self::get_defaults();
        $settings = is_array( $settings ) ? $settings : array();

        $general = isset( $settings['general'] ) && is_array( $settings['general'] ) ? $settings['general'] : array();
        $xmlrpc_mode = isset( $general['xmlrpc_mode'] ) ? sanitize_key( $general['xmlrpc_mode'] ) : $defaults['general']['xmlrpc_mode'];
        if ( ! in_array( $xmlrpc_mode, array( 'disable', 'pingbacks', 'allow' ), true ) ) {
            $xmlrpc_mode = $defaults['general']['xmlrpc_mode'];
        }

        $general_sanitized = array(
            'xmlrpc_mode'           => $xmlrpc_mode,
            'disable_file_editor'   => self::normalize_bool( $general, 'disable_file_editor', $defaults['general']['disable_file_editor'] ),
            'limit_login_attempts'  => self::normalize_int( $general, 'limit_login_attempts', $defaults['general']['limit_login_attempts'], 0, 20 ),
            'login_window_minutes'  => self::normalize_int( $general, 'login_window_minutes', $defaults['general']['login_window_minutes'], 1, 120 ),
            'login_lockout_minutes' => self::normalize_int( $general, 'login_lockout_minutes', $defaults['general']['login_lockout_minutes'], 1, 1440 ),
            'hide_wp_version'       => self::normalize_bool( $general, 'hide_wp_version', $defaults['general']['hide_wp_version'] ),
        );

        $rest = isset( $settings['rest'] ) && is_array( $settings['rest'] ) ? $settings['rest'] : array();
        $rest_access = isset( $rest['access'] ) ? sanitize_key( $rest['access'] ) : $defaults['rest']['access'];
        if ( ! in_array( $rest_access, array( 'open', 'authenticated', 'restricted' ), true ) ) {
            $rest_access = $defaults['rest']['access'];
        }

        $rest_sanitized = array(
            'access'        => $rest_access,
            'allowed_roles' => self::normalize_list( $rest, 'allowed_roles', $defaults['rest']['allowed_roles'] ),
            'allowlist'     => self::normalize_list( $rest, 'allowlist', $defaults['rest']['allowlist'] ),
        );

        $passwords = isset( $settings['passwords'] ) && is_array( $settings['passwords'] ) ? $settings['passwords'] : array();
        $passwords_sanitized = array(
            'min_length'      => self::normalize_int( $passwords, 'min_length', $defaults['passwords']['min_length'], 6, 64 ),
            'require_upper'   => self::normalize_bool( $passwords, 'require_upper', $defaults['passwords']['require_upper'] ),
            'require_lower'   => self::normalize_bool( $passwords, 'require_lower', $defaults['passwords']['require_lower'] ),
            'require_number'  => self::normalize_bool( $passwords, 'require_number', $defaults['passwords']['require_number'] ),
            'require_special' => self::normalize_bool( $passwords, 'require_special', $defaults['passwords']['require_special'] ),
            'block_common'    => self::normalize_bool( $passwords, 'block_common', $defaults['passwords']['block_common'] ),
        );

        return array(
            'general'   => $general_sanitized,
            'rest'      => $rest_sanitized,
            'passwords' => $passwords_sanitized,
        );
    }

    public function filter_xmlrpc_enabled( $enabled ) {
        $settings = self::get_settings();
        if ( 'disable' === $settings['general']['xmlrpc_mode'] ) {
            return false;
        }

        return $enabled;
    }

    public function filter_xmlrpc_methods( $methods ) {
        $settings = self::get_settings();
        if ( 'pingbacks' === $settings['general']['xmlrpc_mode'] ) {
            unset( $methods['pingback.ping'], $methods['pingback.extensions.getPingbacks'] );
        }

        return $methods;
    }

    public function maybe_remove_generator_tag() {
        $settings = self::get_settings();
        if ( $settings['general']['hide_wp_version'] ) {
            remove_action( 'wp_head', 'wp_generator' );
        }
    }

    public function filter_generator( $generator ) {
        $settings = self::get_settings();
        if ( $settings['general']['hide_wp_version'] ) {
            return '';
        }

        return $generator;
    }

    public function filter_file_editor_caps( $allcaps, $caps, $args ) {
        $settings = self::get_settings();
        if ( ! $settings['general']['disable_file_editor'] ) {
            return $allcaps;
        }

        $allcaps['edit_themes'] = false;
        $allcaps['edit_plugins'] = false;

        return $allcaps;
    }

    public function filter_rest_authentication_errors( $result ) {
        if ( ! empty( $result ) ) {
            return $result;
        }

        $settings = self::get_settings();
        $access = $settings['rest']['access'];
        if ( 'open' === $access ) {
            return $result;
        }

        $rest_route = $this->get_rest_route();
        if ( $this->is_route_allowed( $rest_route, $settings['rest']['allowlist'] ) ) {
            return $result;
        }

        if ( ! is_user_logged_in() ) {
            return new WP_Error( 'ss_rest_auth_required', __( 'REST API access requires authentication.', 'saman-security' ), array( 'status' => 401 ) );
        }

        if ( 'restricted' === $access ) {
            $user = wp_get_current_user();
            $allowed_roles = array_map( 'sanitize_key', (array) $settings['rest']['allowed_roles'] );
            if ( empty( array_intersect( $allowed_roles, (array) $user->roles ) ) ) {
                return new WP_Error( 'ss_rest_forbidden', __( 'REST API access is restricted.', 'saman-security' ), array( 'status' => 403 ) );
            }
        }

        return $result;
    }

    public function filter_login_lockouts( $user, $username, $password ) {
        if ( is_wp_error( $user ) ) {
            return $user;
        }

        $settings = self::get_settings();
        $limit = (int) $settings['general']['limit_login_attempts'];
        if ( $limit <= 0 ) {
            return $user;
        }

        $ip_address = $this->get_client_ip();
        if ( empty( $ip_address ) ) {
            return $user;
        }

        $data = $this->get_login_attempts( $ip_address );
        if ( isset( $data['locked_until'] ) && $data['locked_until'] > time() ) {
            return new WP_Error(
                'ss_login_locked',
                __( 'Too many failed login attempts. Please try again later.', 'saman-security' )
            );
        }

        return $user;
    }

    public function track_login_failure( $username ) {
        $settings = self::get_settings();
        $limit = (int) $settings['general']['limit_login_attempts'];
        if ( $limit <= 0 ) {
            return;
        }

        $ip_address = $this->get_client_ip();
        if ( empty( $ip_address ) ) {
            return;
        }

        $window = (int) $settings['general']['login_window_minutes'] * MINUTE_IN_SECONDS;
        $lockout = (int) $settings['general']['login_lockout_minutes'] * MINUTE_IN_SECONDS;

        $data = $this->get_login_attempts( $ip_address );
        $now = time();
        if ( empty( $data['first_attempt'] ) || ( $now - $data['first_attempt'] ) > $window ) {
            $data = array(
                'count'         => 0,
                'first_attempt' => $now,
                'locked_until'  => 0,
            );
        }

        $data['count']++;

        if ( $data['count'] >= $limit ) {
            $data['locked_until'] = $now + $lockout;
            if ( class_exists( 'Saman_Security_Activity_Logger' ) ) {
                Saman_Security_Activity_Logger::log_event( 'blocked', 'Login lockout triggered', 0, $ip_address, $username );
            }
        }

        $expiration = max( $window, $lockout );
        set_transient( $this->get_login_attempts_key( $ip_address ), $data, $expiration );
    }

    public function clear_login_attempts( $user_login, $user ) {
        $ip_address = $this->get_client_ip();
        if ( empty( $ip_address ) ) {
            return;
        }

        delete_transient( $this->get_login_attempts_key( $ip_address ) );
    }

    public function validate_registration_password( $errors, $sanitized_user_login, $user_email ) {
        $password = isset( $_POST['user_pass'] ) ? wp_unslash( $_POST['user_pass'] ) : '';
        if ( empty( $password ) ) {
            return $errors;
        }

        $messages = $this->validate_password_rules( $password, $sanitized_user_login, $user_email );
        foreach ( $messages as $message ) {
            $errors->add( 'ss_password_policy', $message );
        }

        return $errors;
    }

    public function validate_profile_password( $errors, $update, $user ) {
        $password = isset( $_POST['pass1'] ) ? wp_unslash( $_POST['pass1'] ) : '';
        if ( empty( $password ) ) {
            return;
        }

        $messages = $this->validate_password_rules( $password, $user->user_login, $user->user_email );
        foreach ( $messages as $message ) {
            $errors->add( 'ss_password_policy', $message );
        }
    }

    private function validate_password_rules( $password, $user_login, $user_email ) {
        $settings = self::get_settings();
        $policy = $settings['passwords'];

        $messages = array();
        if ( strlen( $password ) < (int) $policy['min_length'] ) {
            $messages[] = sprintf( __( 'Password must be at least %d characters.', 'saman-security' ), (int) $policy['min_length'] );
        }

        if ( $policy['require_upper'] && ! preg_match( '/[A-Z]/', $password ) ) {
            $messages[] = __( 'Password must include at least one uppercase letter.', 'saman-security' );
        }
        if ( $policy['require_lower'] && ! preg_match( '/[a-z]/', $password ) ) {
            $messages[] = __( 'Password must include at least one lowercase letter.', 'saman-security' );
        }
        if ( $policy['require_number'] && ! preg_match( '/[0-9]/', $password ) ) {
            $messages[] = __( 'Password must include at least one number.', 'saman-security' );
        }
        if ( $policy['require_special'] && ! preg_match( '/[^a-zA-Z0-9]/', $password ) ) {
            $messages[] = __( 'Password must include at least one special character.', 'saman-security' );
        }

        $password_lower = strtolower( $password );
        if ( $policy['block_common'] && in_array( $password_lower, $this->get_common_passwords(), true ) ) {
            $messages[] = __( 'Password is too common. Choose a stronger password.', 'saman-security' );
        }

        if ( $user_login && false !== stripos( $password, $user_login ) ) {
            $messages[] = __( 'Password should not contain your username.', 'saman-security' );
        }
        if ( $user_email && false !== stripos( $password, $user_email ) ) {
            $messages[] = __( 'Password should not contain your email address.', 'saman-security' );
        }

        return $messages;
    }

    private function get_common_passwords() {
        return array(
            'password',
            '123456',
            '123456789',
            'qwerty',
            '111111',
            '12345678',
            'abc123',
            'password1',
            'admin',
            'letmein',
            'welcome',
        );
    }

    private function get_rest_route() {
        $rest_route = '';
        if ( isset( $_GET['rest_route'] ) ) {
            $rest_route = sanitize_text_field( wp_unslash( $_GET['rest_route'] ) );
        }

        if ( empty( $rest_route ) && isset( $GLOBALS['wp']->query_vars['rest_route'] ) ) {
            $rest_route = sanitize_text_field( $GLOBALS['wp']->query_vars['rest_route'] );
        }

        return $rest_route;
    }

    private function is_route_allowed( $route, $allowlist ) {
        if ( empty( $route ) ) {
            return false;
        }

        $allowlist = array_filter( array_map( 'trim', (array) $allowlist ) );
        foreach ( $allowlist as $prefix ) {
            if ( 0 === strpos( $route, $prefix ) ) {
                return true;
            }
        }

        return false;
    }

    private function get_login_attempts_key( $ip_address ) {
        return 'ss_login_fail_' . md5( $ip_address );
    }

    private function get_login_attempts( $ip_address ) {
        $data = get_transient( $this->get_login_attempts_key( $ip_address ) );
        if ( ! is_array( $data ) ) {
            $data = array(
                'count'         => 0,
                'first_attempt' => 0,
                'locked_until'  => 0,
            );
        }

        return $data;
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

    private static function normalize_list( $settings, $key, $default ) {
        if ( ! array_key_exists( $key, $settings ) ) {
            return (array) $default;
        }

        $value = $settings[ $key ];
        if ( is_string( $value ) ) {
            $value = explode( ',', $value );
        }

        if ( ! is_array( $value ) ) {
            return (array) $default;
        }

        $value = array_filter( array_map( 'sanitize_text_field', $value ) );
        return array_values( $value );
    }
}
