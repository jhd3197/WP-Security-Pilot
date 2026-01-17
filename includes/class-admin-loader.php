<?php
class Saman_Security_Admin_Loader {
    private $view_map = array(
        'saman-security' => 'dashboard',
        'saman-security-dashboard' => 'dashboard',
        'saman-security-firewall' => 'firewall',
        'saman-security-scanner' => 'scanner',
        'saman-security-hardening' => 'hardening',
        'saman-security-activity' => 'activity',
        'saman-security-settings' => 'settings',
        'saman-security-more' => 'more',
    );

    public function __construct() {
        require_once plugin_dir_path( __FILE__ ) . 'Api/class-settings-controller.php';
        require_once plugin_dir_path( __FILE__ ) . 'Api/class-firewall-controller.php';
        require_once plugin_dir_path( __FILE__ ) . 'Api/class-activity-controller.php';
        require_once plugin_dir_path( __FILE__ ) . 'Api/class-hardening-controller.php';
        require_once plugin_dir_path( __FILE__ ) . 'Api/class-scanner-controller.php';
        require_once plugin_dir_path( __FILE__ ) . 'Api/class-dashboard-controller.php';
        require_once plugin_dir_path( __FILE__ ) . 'Api/class-updater-controller.php';
    }

    public function run() {
        add_action( 'admin_menu', array( $this, 'add_plugin_admin_menu' ) );
        add_action( 'rest_api_init', array( $this, 'register_api_routes' ) );
        add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
    }

    public function register_api_routes() {
        $settings_controller = new Saman_Security_Settings_Controller();
        $settings_controller->register_routes();

        $firewall_controller = new Saman_Security_Firewall_Controller();
        $firewall_controller->register_routes();

        $activity_controller = new Saman_Security_Activity_Controller();
        $activity_controller->register_routes();

        $hardening_controller = new Saman_Security_Hardening_Controller();
        $hardening_controller->register_routes();

        $scanner_controller = new Saman_Security_Scanner_Controller();
        $scanner_controller->register_routes();

        $dashboard_controller = new Saman_Security_Dashboard_Controller();
        $dashboard_controller->register_routes();

        $updater_controller = new Saman_Security_Updater_Controller();
        $updater_controller->register_routes();
    }


    public function add_plugin_admin_menu() {
        add_menu_page(
            'Saman Security',
            'Saman Security',
            'manage_options',
            'saman-security',
            array( $this, 'display_plugin_admin_page' ),
            'dashicons-shield-alt',
            100
        );

        add_submenu_page(
            'saman-security',
            'Dashboard',
            'Dashboard',
            'manage_options',
            'saman-security-dashboard',
            array( $this, 'display_plugin_admin_page' )
        );

        add_submenu_page(
            'saman-security',
            'Firewall',
            'Firewall',
            'manage_options',
            'saman-security-firewall',
            array( $this, 'display_plugin_admin_page' )
        );

        add_submenu_page(
            'saman-security',
            'Scanner',
            'Scanner',
            'manage_options',
            'saman-security-scanner',
            array( $this, 'display_plugin_admin_page' )
        );

        add_submenu_page(
            'saman-security',
            'Hardening',
            'Hardening',
            'manage_options',
            'saman-security-hardening',
            array( $this, 'display_plugin_admin_page' )
        );

        add_submenu_page(
            'saman-security',
            'Activity Log',
            'Activity Log',
            'manage_options',
            'saman-security-activity',
            array( $this, 'display_plugin_admin_page' )
        );

        add_submenu_page(
            'saman-security',
            'Settings',
            'Settings',
            'manage_options',
            'saman-security-settings',
            array( $this, 'display_plugin_admin_page' )
        );

        add_submenu_page(
            'saman-security',
            'More',
            'More',
            'manage_options',
            'saman-security-more',
            array( $this, 'display_plugin_admin_page' )
        );
    }

    public function display_plugin_admin_page() {
        ?>
        <div id="saman-security-root"></div>
        <?php
    }

    public function enqueue_scripts( $hook ) {
        if ( false === strpos( $hook, 'saman-security' ) ) {
            return;
        }

        wp_enqueue_script(
            'saman-security-admin-app',
            plugin_dir_url( __FILE__ ) . '../assets/js/index.js',
            array( 'wp-api-fetch', 'wp-element' ),
            SAMAN_SECURITY_VERSION,
            true
        );

        wp_enqueue_style(
            'saman-security-admin-style',
            plugin_dir_url( __FILE__ ) . '../assets/js/index.css',
            array(),
            SAMAN_SECURITY_VERSION
        );

        $settings = class_exists( 'Saman_Security_Settings' ) ? Saman_Security_Settings::get_settings() : array();
        $analytics_settings = isset( $settings['analytics'] ) && is_array( $settings['analytics'] ) ? $settings['analytics'] : array();
        $analytics_enabled = isset( $analytics_settings['enabled'] ) ? (bool) $analytics_settings['enabled'] : true;
        $matomo_url = defined( 'SAMAN_SECURITY_MATOMO_URL' ) ? SAMAN_SECURITY_MATOMO_URL : 'https://matomo.builditdesign.com/';
        $matomo_site_id = defined( 'SAMAN_SECURITY_MATOMO_SITE_ID' ) ? SAMAN_SECURITY_MATOMO_SITE_ID : '1';
        $matomo_url = apply_filters( 'saman_security_matomo_url', $matomo_url );
        $matomo_site_id = apply_filters( 'saman_security_matomo_site_id', $matomo_site_id );

        wp_localize_script(
            'saman-security-admin-app',
            'samanSecuritySettings',
            array(
                'initialView' => $this->get_initial_view(),
                'analytics'   => array(
                    'enabled'       => $analytics_enabled,
                    'matomoUrl'     => esc_url_raw( $matomo_url ),
                    'siteId'        => (string) $matomo_site_id,
                    'siteHash'      => wp_hash( home_url() ),
                    'pluginVersion' => SAMAN_SECURITY_VERSION,
                ),
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
