<?php
/**
 * Updater REST Controller
 */

class Saman_Security_Updater_Controller extends WP_REST_Controller {

    public function __construct() {
        $this->namespace = 'saman-security/v1';
        $this->rest_base = 'updater';
    }

    public function register_routes() {
        // Get all managed plugins status
        register_rest_route( $this->namespace, '/' . $this->rest_base . '/plugins', [
            'methods'             => 'GET',
            'callback'            => [ $this, 'get_plugins' ],
            'permission_callback' => [ $this, 'admin_permission' ],
        ] );

        // Force check for updates
        register_rest_route( $this->namespace, '/' . $this->rest_base . '/check', [
            'methods'             => 'POST',
            'callback'            => [ $this, 'check_updates' ],
            'permission_callback' => [ $this, 'admin_permission' ],
        ] );

        // Install a plugin
        register_rest_route( $this->namespace, '/' . $this->rest_base . '/install', [
            'methods'             => 'POST',
            'callback'            => [ $this, 'install_plugin' ],
            'permission_callback' => [ $this, 'admin_permission' ],
        ] );

        // Update a plugin
        register_rest_route( $this->namespace, '/' . $this->rest_base . '/update', [
            'methods'             => 'POST',
            'callback'            => [ $this, 'update_plugin' ],
            'permission_callback' => [ $this, 'admin_permission' ],
        ] );

        // Activate a plugin
        register_rest_route( $this->namespace, '/' . $this->rest_base . '/activate', [
            'methods'             => 'POST',
            'callback'            => [ $this, 'activate_plugin' ],
            'permission_callback' => [ $this, 'admin_permission' ],
        ] );

        // Deactivate a plugin
        register_rest_route( $this->namespace, '/' . $this->rest_base . '/deactivate', [
            'methods'             => 'POST',
            'callback'            => [ $this, 'deactivate_plugin' ],
            'permission_callback' => [ $this, 'admin_permission' ],
        ] );

        // Toggle beta preference
        register_rest_route( $this->namespace, '/' . $this->rest_base . '/beta', [
            'methods'             => 'POST',
            'callback'            => [ $this, 'toggle_beta' ],
            'permission_callback' => [ $this, 'admin_permission' ],
        ] );
    }

    public function admin_permission() {
        return current_user_can( 'install_plugins' );
    }

    public function get_plugins() {
        $updater = Saman_Security_GitHub_Updater::get_instance();
        return rest_ensure_response( $updater->get_plugins_status() );
    }

    public function check_updates() {
        $updater = Saman_Security_GitHub_Updater::get_instance();
        return rest_ensure_response( $updater->force_check_updates() );
    }

    public function install_plugin( $request ) {
        $slug = $request->get_param( 'slug' );
        $updater = Saman_Security_GitHub_Updater::get_instance();
        $plugins = $updater->get_plugins_status();

        if ( ! isset( $plugins[ $slug ] ) ) {
            return new WP_Error( 'invalid_plugin', 'Plugin not found' );
        }

        $plugin = $plugins[ $slug ];

        if ( $plugin['installed'] ) {
            return new WP_Error( 'already_installed', 'Plugin is already installed' );
        }

        $result = Saman_Security_Plugin_Installer::install(
            $plugin['download_url'],
            $plugin['plugin_file']
        );

        return rest_ensure_response( $result );
    }

    public function update_plugin( $request ) {
        $slug = $request->get_param( 'slug' );
        $updater = Saman_Security_GitHub_Updater::get_instance();
        $plugins = $updater->get_plugins_status();

        if ( ! isset( $plugins[ $slug ] ) ) {
            return new WP_Error( 'invalid_plugin', 'Plugin not found' );
        }

        $plugin = $plugins[ $slug ];

        if ( ! $plugin['update_available'] ) {
            return new WP_Error( 'no_update', 'No update available' );
        }

        $result = Saman_Security_Plugin_Installer::update( $plugin['plugin_file'] );

        return rest_ensure_response( $result );
    }

    public function activate_plugin( $request ) {
        $slug = $request->get_param( 'slug' );
        $updater = Saman_Security_GitHub_Updater::get_instance();
        $plugins = $updater->get_plugins_status();

        if ( ! isset( $plugins[ $slug ] ) ) {
            return new WP_Error( 'invalid_plugin', 'Plugin not found' );
        }

        $result = Saman_Security_Plugin_Installer::activate( $plugins[ $slug ]['plugin_file'] );

        return rest_ensure_response( $result );
    }

    public function deactivate_plugin( $request ) {
        $slug = $request->get_param( 'slug' );
        $updater = Saman_Security_GitHub_Updater::get_instance();
        $plugins = $updater->get_plugins_status();

        if ( ! isset( $plugins[ $slug ] ) ) {
            return new WP_Error( 'invalid_plugin', 'Plugin not found' );
        }

        $result = Saman_Security_Plugin_Installer::deactivate( $plugins[ $slug ]['plugin_file'] );

        return rest_ensure_response( $result );
    }

    public function toggle_beta( $request ) {
        $slug = $request->get_param( 'slug' );
        $enabled = $request->get_param( 'enabled' );

        $updater = Saman_Security_GitHub_Updater::get_instance();
        $plugins = $updater->get_plugins_status();

        if ( ! isset( $plugins[ $slug ] ) ) {
            return new WP_Error( 'invalid_plugin', 'Plugin not found' );
        }

        $result = $updater->set_beta_preference( $slug, (bool) $enabled );

        if ( $result ) {
            // Clear update transient to reflect changes
            delete_site_transient( 'update_plugins' );

            return rest_ensure_response( [
                'success' => true,
                'message' => $enabled ? 'Beta versions enabled' : 'Beta versions disabled',
                'beta_enabled' => (bool) $enabled,
            ] );
        }

        return new WP_Error( 'beta_toggle_failed', 'Failed to update beta preference' );
    }
}
