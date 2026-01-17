<?php
/**
 * GitHub Plugin Updater
 *
 * Checks GitHub releases for plugin updates and integrates
 * with WordPress update system. Supports stable and beta releases.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Saman_Security_GitHub_Updater {

    /**
     * Managed plugins configuration
     */
    private $plugins = [];

    /**
     * GitHub API base URL
     */
    private const GITHUB_API = 'https://api.github.com';

    /**
     * Cache duration (12 hours)
     */
    private const CACHE_DURATION = 43200;

    /**
     * Beta cache duration (1 hour)
     */
    private const BETA_CACHE_DURATION = 3600;

    /**
     * Option key for beta preferences
     */
    private const BETA_OPTION_KEY = 'ss_beta_plugins';

    /**
     * Singleton instance
     */
    private static $instance = null;

    /**
     * Get singleton instance
     */
    public static function get_instance() {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor
     */
    private function __construct() {
        $this->register_plugins();
        $this->init_hooks();
    }

    /**
     * Register managed plugins
     */
    private function register_plugins() {
        $this->plugins = [
            'Saman-Security/saman-security.php' => [
                'slug'        => 'saman-security',
                'repo'        => 'SamanLabs/Saman-Security',
                'name'        => 'Saman Security',
                'description' => 'Core security suite with firewall, malware scans, and hardening',
                'icon'        => 'https://raw.githubusercontent.com/SamanLabs/Saman-Security/main/assets/images/icon-128.png',
                'banner'      => 'https://raw.githubusercontent.com/SamanLabs/Saman-Security/main/assets/images/banner-772x250.png',
                'type'        => 'security',
            ],
            'Saman-AI/saman-ai.php' => [
                'slug'        => 'saman-ai',
                'repo'        => 'SamanLabs/Saman-AI',
                'name'        => 'Saman AI',
                'description' => 'Centralized AI management for WordPress',
                'icon'        => 'https://raw.githubusercontent.com/SamanLabs/Saman-AI/main/assets/images/icon-128.png',
                'banner'      => 'https://raw.githubusercontent.com/SamanLabs/Saman-AI/main/assets/images/banner-772x250.png',
                'type'        => 'ai',
            ],
            'Saman-SEO/saman-seo.php' => [
                'slug'        => 'saman-seo',
                'repo'        => 'SamanLabs/Saman-SEO',
                'name'        => 'Saman SEO',
                'description' => 'AI-powered SEO optimization for WordPress',
                'icon'        => 'https://raw.githubusercontent.com/SamanLabs/Saman-SEO/main/assets/images/icon-128.png',
                'banner'      => 'https://raw.githubusercontent.com/SamanLabs/Saman-SEO/main/assets/images/banner-772x250.png',
                'type'        => 'seo',
            ],
        ];

        // Allow filtering
        $this->plugins = apply_filters( 'saman_security_managed_plugins', $this->plugins );
    }

    /**
     * Initialize WordPress hooks
     */
    private function init_hooks() {
        // Hook into WordPress update system
        add_filter( 'pre_set_site_transient_update_plugins', [ $this, 'check_for_updates' ] );

        // Add plugin info for View details link
        add_filter( 'plugins_api', [ $this, 'plugin_info' ], 20, 3 );

        // Rename folder after update (GitHub zips have branch name)
        add_filter( 'upgrader_source_selection', [ $this, 'fix_folder_name' ], 10, 4 );

        // Daily cron check
        add_action( 'saman_security_check_updates', [ $this, 'cron_check_updates' ] );

        // Schedule cron if not scheduled
        if ( ! wp_next_scheduled( 'saman_security_check_updates' ) ) {
            wp_schedule_event( time(), 'daily', 'saman_security_check_updates' );
        }
    }

    /**
     * Get beta preferences
     */
    public function get_beta_preferences(): array {
        return get_option( self::BETA_OPTION_KEY, [] );
    }

    /**
     * Check if beta is enabled for a plugin
     */
    public function is_beta_enabled( string $slug ): bool {
        $prefs = $this->get_beta_preferences();
        return ! empty( $prefs[ $slug ] );
    }

    /**
     * Set beta preference for a plugin
     */
    public function set_beta_preference( string $slug, bool $enabled ): bool {
        $prefs = $this->get_beta_preferences();

        if ( $enabled ) {
            $prefs[ $slug ] = true;
        } else {
            unset( $prefs[ $slug ] );
        }

        // Clear beta cache when preference changes
        foreach ( $this->plugins as $plugin_file => $plugin_data ) {
            if ( $plugin_data['slug'] === $slug ) {
                delete_transient( 'ss_gh_beta_' . md5( $plugin_data['repo'] ) );
                break;
            }
        }

        return update_option( self::BETA_OPTION_KEY, $prefs );
    }

    /**
     * Check GitHub for updates
     */
    public function check_for_updates( $transient ) {
        if ( empty( $transient->checked ) ) {
            return $transient;
        }

        foreach ( $this->plugins as $plugin_file => $plugin_data ) {
            // Skip if plugin not installed
            if ( ! isset( $transient->checked[ $plugin_file ] ) ) {
                continue;
            }

            $current_version = $transient->checked[ $plugin_file ];
            $beta_enabled = $this->is_beta_enabled( $plugin_data['slug'] );

            // Get the appropriate version based on beta preference
            if ( $beta_enabled ) {
                $beta = $this->get_beta_version( $plugin_data['repo'] );
                $remote_version = $beta ?: $this->get_remote_version( $plugin_data['repo'] );
            } else {
                $remote_version = $this->get_remote_version( $plugin_data['repo'] );
            }

            if ( $remote_version && version_compare( $remote_version['version'], $current_version, '>' ) ) {
                $transient->response[ $plugin_file ] = (object) [
                    'slug'        => $plugin_data['slug'],
                    'plugin'      => $plugin_file,
                    'new_version' => $remote_version['version'],
                    'url'         => 'https://github.com/' . $plugin_data['repo'],
                    'package'     => $remote_version['download_url'],
                    'icons'       => [
                        '1x' => $plugin_data['icon'],
                        '2x' => $plugin_data['icon'],
                    ],
                    'banners'     => [
                        'low'  => $plugin_data['banner'],
                        'high' => $plugin_data['banner'],
                    ],
                    'tested'      => get_bloginfo( 'version' ),
                    'requires_php'=> '7.4',
                ];
            }
        }

        return $transient;
    }

    /**
     * Get remote version from GitHub (stable releases only)
     */
    public function get_remote_version( string $repo ): ?array {
        $cache_key = 'ss_gh_' . md5( $repo );
        $cached = get_transient( $cache_key );

        if ( false !== $cached ) {
            return $cached;
        }

        $url = self::GITHUB_API . '/repos/' . $repo . '/releases/latest';

        $response = wp_remote_get( $url, [
            'headers' => [
                'Accept' => 'application/vnd.github.v3+json',
                'User-Agent' => 'Saman-Security-Updater',
            ],
            'timeout' => 10,
        ] );

        if ( is_wp_error( $response ) ) {
            return null;
        }

        $body = json_decode( wp_remote_retrieve_body( $response ), true );

        if ( empty( $body['tag_name'] ) ) {
            return null;
        }

        // Remove 'v' prefix from tag
        $version = ltrim( $body['tag_name'], 'v' );

        // Find the zip asset
        $download_url = null;
        if ( ! empty( $body['assets'] ) ) {
            foreach ( $body['assets'] as $asset ) {
                if ( str_ends_with( $asset['name'], '.zip' ) ) {
                    $download_url = $asset['browser_download_url'];
                    break;
                }
            }
        }

        // Fallback to zipball
        if ( ! $download_url ) {
            $download_url = $body['zipball_url'] ?? null;
        }

        $result = [
            'version'      => $version,
            'download_url' => $download_url,
            'changelog'    => $body['body'] ?? '',
            'published_at' => $body['published_at'] ?? '',
            'html_url'     => $body['html_url'] ?? '',
            'is_beta'      => false,
        ];

        set_transient( $cache_key, $result, self::CACHE_DURATION );

        return $result;
    }

    /**
     * Get latest beta/prerelease version from GitHub
     */
    public function get_beta_version( string $repo ): ?array {
        $cache_key = 'ss_gh_beta_' . md5( $repo );
        $cached = get_transient( $cache_key );

        if ( false !== $cached ) {
            return $cached ?: null;
        }

        // Get all releases and find the latest prerelease
        $url = self::GITHUB_API . '/repos/' . $repo . '/releases';

        $response = wp_remote_get( $url, [
            'headers' => [
                'Accept' => 'application/vnd.github.v3+json',
                'User-Agent' => 'Saman-Security-Updater',
            ],
            'timeout' => 10,
        ] );

        if ( is_wp_error( $response ) ) {
            set_transient( $cache_key, '', self::BETA_CACHE_DURATION );
            return null;
        }

        $releases = json_decode( wp_remote_retrieve_body( $response ), true );

        if ( ! is_array( $releases ) || empty( $releases ) ) {
            set_transient( $cache_key, '', self::BETA_CACHE_DURATION );
            return null;
        }

        // Find the latest prerelease
        $latest_beta = null;
        foreach ( $releases as $release ) {
            if ( ! empty( $release['prerelease'] ) && ! empty( $release['tag_name'] ) ) {
                $latest_beta = $release;
                break; // Releases are sorted by date, first prerelease is latest
            }
        }

        if ( ! $latest_beta ) {
            set_transient( $cache_key, '', self::BETA_CACHE_DURATION );
            return null;
        }

        // Remove 'v' prefix from tag
        $version = ltrim( $latest_beta['tag_name'], 'v' );

        // Find the zip asset
        $download_url = null;
        if ( ! empty( $latest_beta['assets'] ) ) {
            foreach ( $latest_beta['assets'] as $asset ) {
                if ( str_ends_with( $asset['name'], '.zip' ) ) {
                    $download_url = $asset['browser_download_url'];
                    break;
                }
            }
        }

        // Fallback to zipball
        if ( ! $download_url ) {
            $download_url = $latest_beta['zipball_url'] ?? null;
        }

        $result = [
            'version'      => $version,
            'download_url' => $download_url,
            'changelog'    => $latest_beta['body'] ?? '',
            'published_at' => $latest_beta['published_at'] ?? '',
            'html_url'     => $latest_beta['html_url'] ?? '',
            'is_beta'      => true,
        ];

        set_transient( $cache_key, $result, self::BETA_CACHE_DURATION );

        return $result;
    }

    /**
     * Plugin info for View details popup
     */
    public function plugin_info( $result, $action, $args ) {
        if ( 'plugin_information' !== $action ) {
            return $result;
        }

        // Find our plugin
        $plugin_data = null;
        foreach ( $this->plugins as $file => $data ) {
            if ( $data['slug'] === $args->slug ) {
                $plugin_data = $data;
                break;
            }
        }

        if ( ! $plugin_data ) {
            return $result;
        }

        $beta_enabled = $this->is_beta_enabled( $plugin_data['slug'] );

        if ( $beta_enabled ) {
            $beta = $this->get_beta_version( $plugin_data['repo'] );
            $remote = $beta ?: $this->get_remote_version( $plugin_data['repo'] );
        } else {
            $remote = $this->get_remote_version( $plugin_data['repo'] );
        }

        if ( ! $remote ) {
            return $result;
        }

        return (object) [
            'name'          => $plugin_data['name'],
            'slug'          => $plugin_data['slug'],
            'version'       => $remote['version'],
            'author'        => '<a href="https://samanlabs.com/">SamanLabs</a>',
            'author_profile'=> 'https://samanlabs.com/SamanLabs',
            'requires'      => '5.0',
            'tested'        => get_bloginfo( 'version' ),
            'requires_php'  => '7.4',
            'homepage'      => 'https://github.com/SamanLabs/',
            'download_link' => $remote['download_url'],
            'trunk'         => $remote['download_url'],
            'last_updated'  => $remote['published_at'],
            'sections'      => [
                'description' => $plugin_data['description'],
                'changelog'   => $this->parse_changelog( $remote['changelog'] ),
            ],
            'banners'       => [
                'low'  => $plugin_data['banner'],
                'high' => $plugin_data['banner'],
            ],
            'icons'         => [
                '1x' => $plugin_data['icon'],
                '2x' => $plugin_data['icon'],
            ],
        ];
    }

    /**
     * Fix folder name after extraction
     * GitHub zips extract to repo-name-tag, we need just repo-name
     */
    public function fix_folder_name( $source, $remote_source, $upgrader, $hook_extra ) {
        global $wp_filesystem;

        // Only for our plugins
        if ( ! isset( $hook_extra['plugin'] ) ) {
            return $source;
        }

        $plugin_file = $hook_extra['plugin'];
        if ( ! isset( $this->plugins[ $plugin_file ] ) ) {
            return $source;
        }

        $plugin_data = $this->plugins[ $plugin_file ];
        $correct_folder = dirname( $plugin_file );

        // Check if folder name needs fixing
        $source_folder = basename( $source );
        if ( $source_folder === $correct_folder ) {
            return $source;
        }

        // Rename folder
        $new_source = trailingslashit( dirname( $source ) ) . $correct_folder;

        if ( $wp_filesystem->move( $source, $new_source ) ) {
            return $new_source;
        }

        return $source;
    }

    /**
     * Parse changelog markdown to HTML
     */
    private function parse_changelog( string $markdown ): string {
        // Simple markdown to HTML
        $html = esc_html( $markdown );
        $html = preg_replace( '/^## (.+)$/m', '<h4>$1</h4>', $html );
        $html = preg_replace( '/^### (.+)$/m', '<h5>$1</h5>', $html );
        $html = preg_replace( '/^\* (.+)$/m', '<li>$1</li>', $html );
        $html = preg_replace( '/^- (.+)$/m', '<li>$1</li>', $html );
        $html = preg_replace( '/(<li>.*<\/li>\n?)+/', '<ul>$0</ul>', $html );
        $html = nl2br( $html );

        return $html;
    }

    /**
     * Cron job to check updates
     */
    public function cron_check_updates() {
        // Clear transients to force fresh check
        foreach ( $this->plugins as $plugin_file => $plugin_data ) {
            delete_transient( 'ss_gh_' . md5( $plugin_data['repo'] ) );
            delete_transient( 'ss_gh_beta_' . md5( $plugin_data['repo'] ) );
        }

        // Trigger WordPress update check
        delete_site_transient( 'update_plugins' );
        wp_update_plugins();
    }

    /**
     * Manual update check
     */
    public function force_check_updates(): array {
        $results = [];

        foreach ( $this->plugins as $plugin_file => $plugin_data ) {
            // Clear cache
            delete_transient( 'ss_gh_' . md5( $plugin_data['repo'] ) );
            delete_transient( 'ss_gh_beta_' . md5( $plugin_data['repo'] ) );

            // Get fresh versions
            $remote = $this->get_remote_version( $plugin_data['repo'] );
            $beta = $this->get_beta_version( $plugin_data['repo'] );

            // Get current version
            $current_version = null;
            if ( file_exists( WP_PLUGIN_DIR . '/' . $plugin_file ) ) {
                $plugin_info = get_plugin_data( WP_PLUGIN_DIR . '/' . $plugin_file );
                $current_version = $plugin_info['Version'];
            }

            $beta_enabled = $this->is_beta_enabled( $plugin_data['slug'] );

            $results[ $plugin_data['slug'] ] = [
                'name'            => $plugin_data['name'],
                'installed'       => $current_version !== null,
                'current_version' => $current_version,
                'remote_version'  => $remote['version'] ?? null,
                'update_available'=> $remote && $current_version && version_compare( $remote['version'], $current_version, '>' ),
                'download_url'    => $remote['download_url'] ?? null,
                'changelog'       => $remote['changelog'] ?? '',
                'beta_enabled'    => $beta_enabled,
                'beta_version'    => $beta['version'] ?? null,
                'beta_available'  => $beta && $current_version && version_compare( $beta['version'], $current_version, '>' ),
            ];
        }

        // Update transient
        delete_site_transient( 'update_plugins' );

        return $results;
    }

    /**
     * Get all managed plugins with status
     */
    public function get_plugins_status(): array {
        $status = [];

        foreach ( $this->plugins as $plugin_file => $plugin_data ) {
            $installed = file_exists( WP_PLUGIN_DIR . '/' . $plugin_file );
            $active = is_plugin_active( $plugin_file );
            $current_version = null;

            if ( $installed ) {
                $plugin_info = get_plugin_data( WP_PLUGIN_DIR . '/' . $plugin_file );
                $current_version = $plugin_info['Version'];
            }

            $remote = $this->get_remote_version( $plugin_data['repo'] );
            $beta = $this->get_beta_version( $plugin_data['repo'] );
            $beta_enabled = $this->is_beta_enabled( $plugin_data['slug'] );

            $status[ $plugin_data['slug'] ] = [
                'plugin_file'      => $plugin_file,
                'name'             => $plugin_data['name'],
                'description'      => $plugin_data['description'],
                'repo'             => $plugin_data['repo'],
                'type'             => $plugin_data['type'] ?? 'default',
                'installed'        => $installed,
                'active'           => $active,
                'current_version'  => $current_version,
                'remote_version'   => $remote['version'] ?? null,
                'update_available' => $installed && $remote && version_compare( $remote['version'] ?? '0', $current_version ?? '0', '>' ),
                'download_url'     => $remote['download_url'] ?? null,
                'github_url'       => 'https://github.com/' . $plugin_data['repo'],
                'icon'             => $plugin_data['icon'],
                'beta_enabled'     => $beta_enabled,
                'beta_version'     => $beta['version'] ?? null,
                'beta_available'   => $beta && $current_version && version_compare( $beta['version'] ?? '0', $current_version ?? '0', '>' ),
                'beta_download_url'=> $beta['download_url'] ?? null,
            ];
        }

        return $status;
    }
}
