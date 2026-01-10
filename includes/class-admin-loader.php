<?php
class WP_Security_Pilot_Admin_Loader {
    private $view_map = array(
        'wp-security-pilot' => 'dashboard',
        'wp-security-pilot-dashboard' => 'dashboard',
        'wp-security-pilot-firewall' => 'firewall',
        'wp-security-pilot-scanner' => 'scanner',
        'wp-security-pilot-hardening' => 'hardening',
        'wp-security-pilot-activity' => 'activity',
        'wp-security-pilot-settings' => 'settings',
        'wp-security-pilot-more' => 'more',
    );

    public function __construct() {
        require_once plugin_dir_path( __FILE__ ) . 'Api/class-settings-controller.php';
        require_once plugin_dir_path( __FILE__ ) . 'Api/class-firewall-controller.php';
        require_once plugin_dir_path( __FILE__ ) . 'Api/class-activity-controller.php';
        require_once plugin_dir_path( __FILE__ ) . 'Api/class-hardening-controller.php';
        require_once plugin_dir_path( __FILE__ ) . 'Api/class-scanner-controller.php';
    }

    public function run() {
        add_action( 'admin_menu', array( $this, 'add_plugin_admin_menu' ) );
        add_action( 'rest_api_init', array( $this, 'register_api_routes' ) );
        add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
    }

    public function register_api_routes() {
        $settings_controller = new WP_Security_Pilot_Settings_Controller();
        $settings_controller->register_routes();

        $firewall_controller = new WP_Security_Pilot_Firewall_Controller();
        $firewall_controller->register_routes();

        $activity_controller = new WP_Security_Pilot_Activity_Controller();
        $activity_controller->register_routes();

        $hardening_controller = new WP_Security_Pilot_Hardening_Controller();
        $hardening_controller->register_routes();

        $scanner_controller = new WP_Security_Pilot_Scanner_Controller();
        $scanner_controller->register_routes();
    }


    public function add_plugin_admin_menu() {
        add_menu_page(
            'WP Security Pilot',
            'Security Pilot',
            'manage_options',
            'wp-security-pilot',
            array( $this, 'display_plugin_admin_page' ),
            'dashicons-shield-alt',
            100
        );

        add_submenu_page(
            'wp-security-pilot',
            'Dashboard',
            'Dashboard',
            'manage_options',
            'wp-security-pilot-dashboard',
            array( $this, 'display_plugin_admin_page' )
        );

        add_submenu_page(
            'wp-security-pilot',
            'Firewall',
            'Firewall',
            'manage_options',
            'wp-security-pilot-firewall',
            array( $this, 'display_plugin_admin_page' )
        );

        add_submenu_page(
            'wp-security-pilot',
            'Scanner',
            'Scanner',
            'manage_options',
            'wp-security-pilot-scanner',
            array( $this, 'display_plugin_admin_page' )
        );

        add_submenu_page(
            'wp-security-pilot',
            'Hardening',
            'Hardening',
            'manage_options',
            'wp-security-pilot-hardening',
            array( $this, 'display_plugin_admin_page' )
        );

        add_submenu_page(
            'wp-security-pilot',
            'Activity Log',
            'Activity Log',
            'manage_options',
            'wp-security-pilot-activity',
            array( $this, 'display_plugin_admin_page' )
        );

        add_submenu_page(
            'wp-security-pilot',
            'Settings',
            'Settings',
            'manage_options',
            'wp-security-pilot-settings',
            array( $this, 'display_plugin_admin_page' )
        );

        add_submenu_page(
            'wp-security-pilot',
            'More',
            'More',
            'manage_options',
            'wp-security-pilot-more',
            array( $this, 'display_plugin_admin_page' )
        );
    }

    public function display_plugin_admin_page() {
        ?>
        <div id="wp-security-pilot-root"></div>
        <?php
    }

    public function enqueue_scripts( $hook ) {
        if ( false === strpos( $hook, 'wp-security-pilot' ) ) {
            return;
        }

        wp_enqueue_script(
            'wp-security-pilot-admin-app',
            plugin_dir_url( __FILE__ ) . '../assets/js/index.js',
            array( 'wp-api-fetch', 'wp-element' ),
            WP_SECURITY_PILOT_VERSION,
            true
        );

        wp_enqueue_style(
            'wp-security-pilot-admin-style',
            plugin_dir_url( __FILE__ ) . '../assets/js/index.css',
            array(),
            WP_SECURITY_PILOT_VERSION
        );

        wp_localize_script(
            'wp-security-pilot-admin-app',
            'wpSecurityPilotSettings',
            array(
                'initialView' => $this->get_initial_view(),
            )
        );
    }

    private function get_initial_view() {
        $page = isset( $_GET['page'] ) ? sanitize_key( $_GET['page'] ) : '';

        if ( isset( $this->view_map[ $page ] ) ) {
            return $this->view_map[ $page ];
        }

        return 'dashboard';
    }
}
