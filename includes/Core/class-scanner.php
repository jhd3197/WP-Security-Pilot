<?php

class Saman_Security_Scanner {
    const CHUNK_SIZE = 25;
    const MAX_SCAN_BYTES = 5242880;
    private $scan_cache_table_exists = null;

    public function start_scan( $initiator = 'manual' ) {
        global $wpdb;

        $existing = $wpdb->get_var(
            "SELECT id FROM {$wpdb->prefix}ss_scan_jobs WHERE status IN ('pending','running') ORDER BY id DESC LIMIT 1"
        );
        if ( $existing ) {
            return (int) $existing;
        }

        $job_created = $wpdb->insert(
            $wpdb->prefix . 'ss_scan_jobs',
            array(
                'status'          => 'running',
                'total_files'     => 0,
                'processed_files' => 0,
                'last_message'    => 'Initializing scan',
                'started_at'      => current_time( 'mysql' ),
                'completed_at'    => null,
            ),
            array( '%s', '%d', '%d', '%s', '%s', '%s' )
        );

        if ( false === $job_created ) {
            return 0;
        }

        $job_id = (int) $wpdb->insert_id;
        $config = $this->get_scan_config_defaults();
        update_option( $this->get_config_option_key( $job_id ), $config, false );

        $files = $this->collect_files( $config );
        update_option( $this->get_queue_option_key( $job_id ), $files, false );

        $wpdb->update(
            $wpdb->prefix . 'ss_scan_jobs',
            array(
                'total_files'  => count( $files ),
                'last_message' => 'Queued files for scanning',
            ),
            array( 'id' => $job_id ),
            array( '%d', '%s' ),
            array( '%d' )
        );

        wp_schedule_single_event( time() + 1, 'ss_scan_chunk', array( $job_id ) );
        $this->kick_cron();

        if ( class_exists( 'Saman_Security_Activity_Logger' ) ) {
            $label = ( 'scheduled' === $initiator ) ? 'Scheduled scan started' : 'Manual scan started';
            Saman_Security_Activity_Logger::log_event( 'alert', $label, get_current_user_id() );
        }

        return $job_id;
    }

    public function run_scan_chunk( $job_id ) {
        global $wpdb;

        $job_id = absint( $job_id );
        if ( ! $job_id ) {
            return;
        }

        $lock_key = $this->get_lock_key( $job_id );
        if ( get_transient( $lock_key ) ) {
            return;
        }

        set_transient( $lock_key, 1, MINUTE_IN_SECONDS );

        try {
            $job = $this->get_job( $job_id );
            if ( ! $job || in_array( $job['status'], array( 'completed', 'stopped' ), true ) ) {
                return;
            }

            if ( 'pending' === $job['status'] ) {
                $wpdb->update(
                    $wpdb->prefix . 'ss_scan_jobs',
                    array( 'status' => 'running' ),
                    array( 'id' => $job_id ),
                    array( '%s' ),
                    array( '%d' )
                );
            }

            $queue_key = $this->get_queue_option_key( $job_id );
            $queue = get_option( $queue_key, array() );
            if ( empty( $queue ) || ! is_array( $queue ) ) {
                $this->complete_job( $job_id );
                return;
            }

            $config = $this->get_scan_config( $job_id );
            $chunk_size = $this->get_chunk_size( $config );
            $chunk = array_slice( $queue, 0, $chunk_size );
            $remaining = array_slice( $queue, $chunk_size );
            update_option( $queue_key, $remaining, false );

            $ignore_patterns = $this->get_ignore_patterns();
            $checksums = $this->get_core_checksums();
            $signatures = $this->get_malware_signatures();
            $cache_enabled = ! empty( $config['cache_enabled'] ) && $this->has_scan_cache_table();

            $processed = 0;
            $last_message = '';
            $skipped_unchanged = false;

            foreach ( $chunk as $file_path ) {
                $processed++;
                if ( $this->is_ignored( $file_path, $ignore_patterns ) ) {
                    continue;
                }

                if ( ! file_exists( $file_path ) || ! is_readable( $file_path ) ) {
                    continue;
                }

                $relative_path = $this->get_relative_path( $file_path );
                if ( $cache_enabled && $this->should_skip_file( $relative_path, $file_path, $config ) ) {
                    $skipped_unchanged = true;
                    continue;
                }

                $last_message = 'Scanning ' . $relative_path;
                $file_status = 'clean';
                $issue_found = false;

                if ( $this->is_core_file( $relative_path, $checksums ) ) {
                    $issue_found = $this->check_core_checksum( $job_id, $file_path, $relative_path, $checksums, $config );
                    if ( $issue_found ) {
                        $file_status = 'modified';
                    }
                    if ( $cache_enabled ) {
                        $this->update_scan_cache_record( $relative_path, $file_path, $file_status );
                    }
                    continue;
                }

                if ( 'low' !== $config['scan_intensity'] ) {
                    $issue_found = $this->check_malware_signatures( $job_id, $file_path, $relative_path, $signatures, $config );
                    if ( $issue_found ) {
                        $file_status = 'flagged';
                    }
                }

                if ( $cache_enabled ) {
                    $this->update_scan_cache_record( $relative_path, $file_path, $file_status );
                }
            }

            if ( ! $last_message && $skipped_unchanged ) {
                $last_message = 'Skipping unchanged files';
            }

            $new_processed = min( (int) $job['processed_files'] + $processed, (int) $job['total_files'] );

            $wpdb->update(
                $wpdb->prefix . 'ss_scan_jobs',
                array(
                    'processed_files' => $new_processed,
                    'last_message'    => $last_message ? $last_message : $job['last_message'],
                ),
                array( 'id' => $job_id ),
                array( '%d', '%s' ),
                array( '%d' )
            );

            if ( empty( $remaining ) ) {
                $this->complete_job( $job_id );
                return;
            }

            $delay = $this->get_chunk_delay( $config );
            wp_schedule_single_event( time() + $delay, 'ss_scan_chunk', array( $job_id ) );
        } finally {
            delete_transient( $lock_key );
        }
    }

    public function stop_scan( $job_id ) {
        global $wpdb;

        $job_id = absint( $job_id );
        if ( ! $job_id ) {
            return false;
        }

        wp_clear_scheduled_hook( 'ss_scan_chunk', array( $job_id ) );
        delete_option( $this->get_queue_option_key( $job_id ) );
        delete_option( $this->get_config_option_key( $job_id ) );

        $updated = $wpdb->update(
            $wpdb->prefix . 'ss_scan_jobs',
            array(
                'status'       => 'stopped',
                'completed_at' => current_time( 'mysql' ),
                'last_message' => 'Scan stopped by user',
            ),
            array( 'id' => $job_id ),
            array( '%s', '%s', '%s' ),
            array( '%d' )
        );

        if ( class_exists( 'Saman_Security_Activity_Logger' ) ) {
            Saman_Security_Activity_Logger::log_event( 'alert', 'Scan stopped', get_current_user_id() );
        }

        return false !== $updated;
    }

    public function get_status( $job_id ) {
        global $wpdb;

        $job_id = absint( $job_id );
        if ( ! $job_id ) {
            return null;
        }

        $job = $this->get_job( $job_id );
        if ( ! $job ) {
            return null;
        }

        if ( in_array( $job['status'], array( 'pending', 'running' ), true ) ) {
            $this->maybe_run_inline_chunk( $job_id );
        }

        $progress = 0;
        if ( $job['total_files'] > 0 ) {
            $progress = (int) floor( ( $job['processed_files'] / $job['total_files'] ) * 100 );
        }

        $results = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT file_path, status, issue_type, details, created_at
                 FROM {$wpdb->prefix}ss_scan_results
                 WHERE job_id = %d
                 ORDER BY id DESC
                 LIMIT 20",
                $job_id
            ),
            ARRAY_A
        );

        return array(
            'id'             => (int) $job['id'],
            'status'         => $job['status'],
            'progress'       => $progress,
            'processed_files'=> (int) $job['processed_files'],
            'total_files'    => (int) $job['total_files'],
            'message'        => $job['last_message'],
            'results'        => $results,
            'started_at'     => $job['started_at'],
            'completed_at'   => $job['completed_at'],
        );
    }

    public function get_latest_status() {
        global $wpdb;

        $job_id = $wpdb->get_var(
            "SELECT id FROM {$wpdb->prefix}ss_scan_jobs ORDER BY id DESC LIMIT 1"
        );

        if ( ! $job_id ) {
            return null;
        }

        return $this->get_status( $job_id );
    }

    public function run_scheduled_scan() {
        $this->start_scan( 'scheduled' );
    }

    public function update_schedule( $settings ) {
        $frequency = isset( $settings['frequency'] ) ? sanitize_key( $settings['frequency'] ) : 'daily';
        $time = isset( $settings['time'] ) ? sanitize_text_field( $settings['time'] ) : '02:00';
        $enabled = isset( $settings['enabled'] ) ? filter_var( $settings['enabled'], FILTER_VALIDATE_BOOLEAN ) : false;

        if ( ! in_array( $frequency, array( 'daily', 'weekly' ), true ) ) {
            $frequency = 'daily';
        }

        if ( ! preg_match( '/^\\d{2}:\\d{2}$/', $time ) ) {
            $time = '02:00';
        }

        $schedule = array(
            'frequency' => $frequency,
            'time'      => $time,
            'enabled'   => $enabled,
        );

        update_option( 'ss_scan_schedule', $schedule );

        wp_clear_scheduled_hook( 'ss_scan_scheduled' );

        if ( $enabled ) {
            $timestamp = $this->get_next_schedule_timestamp( $time, $frequency );
            wp_schedule_event( $timestamp, $frequency, 'ss_scan_scheduled' );
        }

        return $schedule;
    }

    public function get_schedule() {
        $schedule = get_option( 'ss_scan_schedule', array() );
        if ( ! is_array( $schedule ) ) {
            $schedule = array();
        }

        return array(
            'frequency' => isset( $schedule['frequency'] ) ? $schedule['frequency'] : 'daily',
            'time'      => isset( $schedule['time'] ) ? $schedule['time'] : '02:00',
            'enabled'   => isset( $schedule['enabled'] ) ? (bool) $schedule['enabled'] : false,
        );
    }

    public function get_ignore_patterns() {
        global $wpdb;

        $table = $wpdb->prefix . 'ss_scan_ignore';
        $exists = $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $table ) );
        if ( $exists !== $table ) {
            return array();
        }

        $patterns = $wpdb->get_col( "SELECT path_pattern FROM {$table} ORDER BY id ASC" );
        return array_filter( array_map( 'trim', $patterns ) );
    }

    public function set_ignore_patterns( $patterns ) {
        global $wpdb;

        $table = $wpdb->prefix . 'ss_scan_ignore';
        $exists = $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $table ) );
        if ( $exists !== $table ) {
            return array();
        }

        $patterns = array_filter( array_map( 'sanitize_text_field', (array) $patterns ) );

        $wpdb->query( "TRUNCATE TABLE {$table}" );

        foreach ( $patterns as $pattern ) {
            $wpdb->insert(
                $table,
                array(
                    'path_pattern' => $pattern,
                    'created_at'   => current_time( 'mysql' ),
                ),
                array( '%s', '%s' )
            );
        }

        return $patterns;
    }

    private function complete_job( $job_id ) {
        global $wpdb;

        $wpdb->update(
            $wpdb->prefix . 'ss_scan_jobs',
            array(
                'status'       => 'completed',
                'completed_at' => current_time( 'mysql' ),
                'last_message' => 'Scan completed',
            ),
            array( 'id' => $job_id ),
            array( '%s', '%s', '%s' ),
            array( '%d' )
        );

        delete_option( $this->get_queue_option_key( $job_id ) );
        delete_option( $this->get_config_option_key( $job_id ) );

        if ( class_exists( 'Saman_Security_Activity_Logger' ) ) {
            Saman_Security_Activity_Logger::log_event( 'alert', 'Scan completed', get_current_user_id() );
        }
    }

    private function get_job( $job_id ) {
        global $wpdb;

        return $wpdb->get_row(
            $wpdb->prepare(
                "SELECT id, status, total_files, processed_files, last_message, started_at, completed_at
                 FROM {$wpdb->prefix}ss_scan_jobs
                 WHERE id = %d",
                $job_id
            ),
            ARRAY_A
        );
    }

    private function collect_files( $config ) {
        $files = array();
        $checksums = $this->get_core_checksums();

        foreach ( $checksums as $relative => $checksum ) {
            $path = trailingslashit( ABSPATH ) . ltrim( $relative, '/' );
            if ( file_exists( $path ) && is_readable( $path ) ) {
                $files[] = $path;
            }
        }

        $scan_dirs = array();

        if ( 'low' !== $config['scan_intensity'] ) {
            $scan_dirs = array(
                WP_CONTENT_DIR . '/plugins',
                WP_CONTENT_DIR . '/mu-plugins',
                WP_CONTENT_DIR . '/themes',
            );
        }

        if ( 'high' === $config['scan_intensity'] ) {
            $scan_dirs[] = WP_CONTENT_DIR . '/uploads';
        }

        foreach ( $scan_dirs as $dir ) {
            if ( ! is_dir( $dir ) ) {
                continue;
            }

            $iterator = new RecursiveIteratorIterator(
                new RecursiveDirectoryIterator( $dir, FilesystemIterator::SKIP_DOTS )
            );

            foreach ( $iterator as $file ) {
                if ( ! $file->isFile() ) {
                    continue;
                }

                $path = $file->getPathname();
                if ( $this->is_scan_target( $path ) ) {
                    $files[] = $path;
                }
            }
        }

        $files = array_values( array_unique( $files ) );

        return $files;
    }

    private function is_scan_target( $path ) {
        $extension = strtolower( pathinfo( $path, PATHINFO_EXTENSION ) );
        return in_array( $extension, array( 'php', 'js' ), true );
    }

    private function check_core_checksum( $job_id, $file_path, $relative_path, $checksums, $config ) {
        $expected = $checksums[ $relative_path ];
        $hash = @md5_file( $file_path );
        if ( false === $hash || $hash !== $expected ) {
            if ( ! empty( $config['enable_auto_repair'] ) ) {
                $this->attempt_auto_repair( $relative_path, $file_path );
            }
            $this->log_result(
                $job_id,
                $relative_path,
                'modified',
                'core_checksum',
                'Checksum mismatch'
            );
            Saman_Security_Notifications::send_alert(
                'core_file_modified',
                'Core file integrity check failed.',
                array( 'file' => $relative_path )
            );
            return true;
        }
        return false;
    }

    private function check_malware_signatures( $job_id, $file_path, $relative_path, $signatures, $config ) {
        $extension = strtolower( pathinfo( $file_path, PATHINFO_EXTENSION ) );
        if ( ! in_array( $extension, array( 'php', 'js' ), true ) ) {
            return false;
        }

        if ( filesize( $file_path ) > self::MAX_SCAN_BYTES ) {
            return false;
        }

        $contents = @file_get_contents( $file_path );
        if ( false === $contents ) {
            return false;
        }

        $found = false;
        foreach ( $signatures as $signature ) {
            $pattern = $signature['pattern'];
            if ( $this->pattern_matches( $pattern, $contents ) ) {
                $this->log_result(
                    $job_id,
                    $relative_path,
                    'flagged',
                    'malware_signature',
                    $signature['name']
                );
                Saman_Security_Notifications::send_alert(
                    'malware_found',
                    'Malware signature detected.',
                    array(
                        'file'      => $relative_path,
                        'signature' => $signature['name'],
                    )
                );
                $found = true;
                return true;
            }
        }

        if ( 'high' === $config['scan_intensity'] ) {
            $custom_issue = apply_filters( 'saman_security_scanner_vulnerability', null, $file_path );
            if ( $custom_issue ) {
                $this->log_result(
                    $job_id,
                    $relative_path,
                    'flagged',
                    'vuln_plugin',
                    sanitize_text_field( $custom_issue )
                );
                $found = true;
            }
        }

        return $found;
    }

    private function log_result( $job_id, $file_path, $status, $issue_type, $details ) {
        global $wpdb;

        $wpdb->insert(
            $wpdb->prefix . 'ss_scan_results',
            array(
                'job_id'     => $job_id,
                'file_path'  => $file_path,
                'status'     => $status,
                'issue_type' => $issue_type,
                'details'    => $details,
                'created_at' => current_time( 'mysql' ),
            ),
            array( '%d', '%s', '%s', '%s', '%s', '%s' )
        );
    }

    private function is_core_file( $relative_path, $checksums ) {
        return isset( $checksums[ $relative_path ] );
    }

    private function get_core_checksums() {
        $version = get_bloginfo( 'version' );
        $locale = get_locale();
        $cache_key = 'ss_core_checksums_' . md5( $version . '|' . $locale );
        $checksums = get_site_transient( $cache_key );

        if ( false !== $checksums && is_array( $checksums ) ) {
            return $checksums;
        }

        require_once ABSPATH . 'wp-admin/includes/update.php';
        $checksums = get_core_checksums( $version, $locale );
        if ( ! is_array( $checksums ) ) {
            $checksums = array();
        }

        set_site_transient( $cache_key, $checksums, DAY_IN_SECONDS );

        return $checksums;
    }

    private function get_malware_signatures() {
        $path = plugin_dir_path( __FILE__ ) . '../data/malware-signatures.json';
        if ( ! file_exists( $path ) ) {
            return array();
        }

        $json = file_get_contents( $path );
        if ( false === $json ) {
            return array();
        }

        $data = json_decode( $json, true );
        if ( ! is_array( $data ) ) {
            return array();
        }

        $signatures = array();
        foreach ( $data as $entry ) {
            if ( empty( $entry['name'] ) || empty( $entry['pattern'] ) ) {
                continue;
            }
            $signatures[] = array(
                'name'    => sanitize_text_field( $entry['name'] ),
                'pattern' => $entry['pattern'],
            );
        }

        return $signatures;
    }

    private function pattern_matches( $pattern, $value ) {
        $pattern = trim( $pattern );
        if ( '' === $pattern ) {
            return false;
        }

        $normalized = $this->normalize_pattern( $pattern );
        if ( ! $this->is_regex_valid( $normalized ) ) {
            return false;
        }

        return (bool) preg_match( $normalized, $value );
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

    private function get_relative_path( $path ) {
        return ltrim( str_replace( '\\', '/', str_replace( ABSPATH, '', $path ) ), '/' );
    }

    private function attempt_auto_repair( $relative_path, $file_path ) {
        if ( ! wp_is_writable( $file_path ) ) {
            return false;
        }

        $version = get_bloginfo( 'version' );
        $url = sprintf(
            'https://core.svn.wordpress.org/tags/%s/%s',
            rawurlencode( $version ),
            ltrim( $relative_path, '/' )
        );

        $response = wp_safe_remote_get( $url, array( 'timeout' => 10 ) );
        if ( is_wp_error( $response ) ) {
            return false;
        }

        $status = wp_remote_retrieve_response_code( $response );
        if ( 200 !== $status ) {
            return false;
        }

        $body = wp_remote_retrieve_body( $response );
        if ( empty( $body ) ) {
            return false;
        }

        $written = file_put_contents( $file_path, $body );
        if ( false === $written ) {
            return false;
        }

        return true;
    }

    private function is_ignored( $path, $patterns ) {
        if ( empty( $patterns ) ) {
            return false;
        }

        $relative = $this->get_relative_path( $path );
        foreach ( $patterns as $pattern ) {
            if ( fnmatch( $pattern, $relative ) || fnmatch( $pattern, $path ) ) {
                return true;
            }
        }

        return false;
    }

    private function get_queue_option_key( $job_id ) {
        return 'ss_scan_queue_' . absint( $job_id );
    }

    private function get_config_option_key( $job_id ) {
        return 'ss_scan_config_' . absint( $job_id );
    }

    private function has_scan_cache_table() {
        if ( null !== $this->scan_cache_table_exists ) {
            return $this->scan_cache_table_exists;
        }

        global $wpdb;
        $table = $wpdb->prefix . 'ss_scan_files';
        $exists = $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $table ) );
        $this->scan_cache_table_exists = ( $exists === $table );

        return $this->scan_cache_table_exists;
    }

    private function get_scan_cache_record( $relative_path ) {
        if ( ! $this->has_scan_cache_table() ) {
            return null;
        }

        global $wpdb;
        $table = $wpdb->prefix . 'ss_scan_files';
        return $wpdb->get_row(
            $wpdb->prepare(
                "SELECT file_hash, file_mtime, last_scanned, last_status
                 FROM {$table}
                 WHERE file_path = %s",
                $relative_path
            ),
            ARRAY_A
        );
    }

    private function should_skip_file( $relative_path, $file_path, $config ) {
        if ( empty( $config['cache_enabled'] ) ) {
            return false;
        }

        $record = $this->get_scan_cache_record( $relative_path );
        if ( ! $record ) {
            return false;
        }

        if ( ! empty( $record['last_status'] ) && in_array( $record['last_status'], array( 'flagged', 'modified' ), true ) ) {
            return false;
        }

        $mtime = @filemtime( $file_path );
        if ( false === $mtime ) {
            return false;
        }

        if ( (int) $record['file_mtime'] !== (int) $mtime ) {
            return false;
        }

        $recheck_days = isset( $config['cache_recheck_days'] ) ? absint( $config['cache_recheck_days'] ) : 0;
        if ( $recheck_days < 1 ) {
            return false;
        }

        $last_scanned = ! empty( $record['last_scanned'] ) ? strtotime( $record['last_scanned'] ) : 0;
        if ( ! $last_scanned ) {
            return false;
        }

        return ( time() - $last_scanned ) < ( $recheck_days * DAY_IN_SECONDS );
    }

    private function update_scan_cache_record( $relative_path, $file_path, $status ) {
        if ( ! $this->has_scan_cache_table() ) {
            return;
        }

        if ( ! file_exists( $file_path ) || ! is_readable( $file_path ) ) {
            return;
        }

        $hash = $this->get_file_hash( $file_path );
        $mtime = @filemtime( $file_path );
        if ( false === $mtime ) {
            $mtime = 0;
        }

        global $wpdb;
        $table = $wpdb->prefix . 'ss_scan_files';
        $wpdb->replace(
            $table,
            array(
                'file_path'   => $relative_path,
                'file_hash'   => $hash,
                'file_mtime'  => (int) $mtime,
                'last_scanned'=> current_time( 'mysql' ),
                'last_status' => $status,
            ),
            array( '%s', '%s', '%d', '%s', '%s' )
        );
    }

    private function get_file_hash( $file_path ) {
        $hash = @md5_file( $file_path );
        return $hash ? $hash : '';
    }

    private function ensure_scan_is_scheduled( $job_id ) {
        $job_id = absint( $job_id );
        if ( ! $job_id ) {
            return;
        }

        if ( wp_next_scheduled( 'ss_scan_chunk', array( $job_id ) ) ) {
            return;
        }

        $queue = get_option( $this->get_queue_option_key( $job_id ), array() );
        if ( empty( $queue ) || ! is_array( $queue ) ) {
            return;
        }

        wp_schedule_single_event( time() + 5, 'ss_scan_chunk', array( $job_id ) );
        $this->kick_cron();
    }

    private function maybe_run_inline_chunk( $job_id ) {
        $queue = get_option( $this->get_queue_option_key( $job_id ), array() );
        if ( empty( $queue ) || ! is_array( $queue ) ) {
            return;
        }

        $next_scheduled = wp_next_scheduled( 'ss_scan_chunk', array( $job_id ) );
        $cron_disabled = defined( 'DISABLE_WP_CRON' ) && DISABLE_WP_CRON;
        $overdue = $next_scheduled && $next_scheduled <= ( time() - 5 );

        if ( ! $cron_disabled && $next_scheduled && ! $overdue ) {
            return;
        }

        $throttle_key = 'ss_scan_inline_' . absint( $job_id );
        if ( get_transient( $throttle_key ) ) {
            return;
        }

        set_transient( $throttle_key, 1, 3 );
        $this->run_scan_chunk( $job_id );
    }

    private function kick_cron() {
        if ( function_exists( 'spawn_cron' ) ) {
            spawn_cron();
            return;
        }

        $cron_url = site_url( 'wp-cron.php' );
        wp_remote_post( $cron_url, array( 'timeout' => 3, 'blocking' => false ) );
    }

    private function get_scan_config_defaults() {
        return array(
            'scan_intensity'     => Saman_Security_Settings::get_setting( array( 'scanner', 'scan_intensity' ), 'medium' ),
            'enable_auto_repair' => Saman_Security_Settings::get_setting( array( 'scanner', 'enable_auto_repair' ), false ),
            'scan_speed'         => Saman_Security_Settings::get_setting( array( 'scanner', 'scan_speed' ), 3 ),
            'cache_enabled'      => Saman_Security_Settings::get_setting( array( 'scanner', 'cache_enabled' ), true ),
            'cache_recheck_days' => Saman_Security_Settings::get_setting( array( 'scanner', 'cache_recheck_days' ), 30 ),
        );
    }

    private function get_scan_config( $job_id ) {
        $config = get_option( $this->get_config_option_key( $job_id ), array() );
        if ( ! is_array( $config ) || empty( $config ) ) {
            $config = $this->get_scan_config_defaults();
        }

        return array(
            'scan_intensity'     => isset( $config['scan_intensity'] ) ? $config['scan_intensity'] : 'medium',
            'enable_auto_repair' => ! empty( $config['enable_auto_repair'] ),
            'scan_speed'         => isset( $config['scan_speed'] ) ? absint( $config['scan_speed'] ) : 3,
            'cache_enabled'      => ! empty( $config['cache_enabled'] ),
            'cache_recheck_days' => isset( $config['cache_recheck_days'] ) ? absint( $config['cache_recheck_days'] ) : 30,
        );
    }

    private function get_next_schedule_timestamp( $time, $frequency ) {
        $timezone = wp_timezone();
        $now = new DateTime( 'now', $timezone );
        $target = DateTime::createFromFormat( 'Y-m-d H:i', $now->format( 'Y-m-d' ) . ' ' . $time, $timezone );

        if ( $target <= $now ) {
            $target->modify( ( 'weekly' === $frequency ) ? '+7 day' : '+1 day' );
        }

        return $target->getTimestamp();
    }

    private function get_lock_key( $job_id ) {
        return 'ss_scan_lock_' . absint( $job_id );
    }

    private function get_chunk_size( $config ) {
        $speed = isset( $config['scan_speed'] ) ? absint( $config['scan_speed'] ) : 3;
        switch ( $speed ) {
            case 1:
                return 10;
            case 2:
                return 20;
            case 4:
                return 60;
            case 5:
                return 90;
            case 3:
            default:
                return 35;
        }
    }

    private function get_chunk_delay( $config ) {
        $speed = isset( $config['scan_speed'] ) ? absint( $config['scan_speed'] ) : 3;
        switch ( $speed ) {
            case 1:
                return 10;
            case 2:
                return 7;
            case 4:
                return 3;
            case 5:
                return 2;
            case 3:
            default:
                return 5;
        }
    }
}
