<?php
/**
 * Plugin Installer
 *
 * Handles installation, activation, and updates of managed plugins.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Saman_Security_Plugin_Installer {

    /**
     * Install a plugin from GitHub
     */
    public static function install( string $download_url, string $plugin_file ): array {
        require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
        require_once ABSPATH . 'wp-admin/includes/plugin-install.php';

        // Create upgrader with skin that captures output
        $skin = new WP_Ajax_Upgrader_Skin();
        $upgrader = new Plugin_Upgrader( $skin );

        // Install the plugin
        $result = $upgrader->install( $download_url );

        if ( is_wp_error( $result ) ) {
            return [
                'success' => false,
                'message' => $result->get_error_message(),
            ];
        }

        if ( ! $result ) {
            return [
                'success' => false,
                'message' => 'Installation failed. Check file permissions.',
            ];
        }

        return [
            'success' => true,
            'message' => 'Plugin installed successfully.',
        ];
    }

    /**
     * Update a plugin
     */
    public static function update( string $plugin_file ): array {
        require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';

        $skin = new WP_Ajax_Upgrader_Skin();
        $upgrader = new Plugin_Upgrader( $skin );

        $result = $upgrader->upgrade( $plugin_file );

        if ( is_wp_error( $result ) ) {
            return [
                'success' => false,
                'message' => $result->get_error_message(),
            ];
        }

        if ( ! $result ) {
            return [
                'success' => false,
                'message' => 'Update failed.',
            ];
        }

        return [
            'success' => true,
            'message' => 'Plugin updated successfully.',
        ];
    }

    /**
     * Activate a plugin
     */
    public static function activate( string $plugin_file ): array {
        $result = activate_plugin( $plugin_file );

        if ( is_wp_error( $result ) ) {
            return [
                'success' => false,
                'message' => $result->get_error_message(),
            ];
        }

        return [
            'success' => true,
            'message' => 'Plugin activated successfully.',
        ];
    }

    /**
     * Deactivate a plugin
     */
    public static function deactivate( string $plugin_file ): array {
        deactivate_plugins( $plugin_file );

        return [
            'success' => true,
            'message' => 'Plugin deactivated.',
        ];
    }

    /**
     * Delete a plugin
     */
    public static function delete( string $plugin_file ): array {
        require_once ABSPATH . 'wp-admin/includes/plugin.php';
        require_once ABSPATH . 'wp-admin/includes/file.php';

        // Deactivate first
        deactivate_plugins( $plugin_file );

        // Delete
        $result = delete_plugins( [ $plugin_file ] );

        if ( is_wp_error( $result ) ) {
            return [
                'success' => false,
                'message' => $result->get_error_message(),
            ];
        }

        return [
            'success' => true,
            'message' => 'Plugin deleted.',
        ];
    }
}
