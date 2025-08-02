<?php
/**
 * Plugin Name: Check Editor Pro
 * Plugin URI: https://your-website.com/check-editor-pro
 * Description: 專業支票編輯工具，支援拖拉式欄位編輯、多語言介面、批量處理和PDF導出功能。Professional check editing tool with drag-and-drop fields, multi-language support, batch processing and PDF export.
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https://your-website.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: check-editor-pro
 * Domain Path: /languages
 * Requires at least: 5.0
 * Tested up to: 6.4
 * Requires PHP: 7.4
 * Network: false
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('CHECK_EDITOR_PRO_VERSION', '1.0.0');
define('CHECK_EDITOR_PRO_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('CHECK_EDITOR_PRO_PLUGIN_URL', plugin_dir_url(__FILE__));
define('CHECK_EDITOR_PRO_PLUGIN_BASENAME', plugin_basename(__FILE__));

/**
 * Main Check Editor Pro Plugin Class
 */
class CheckEditorPro {
    
    /**
     * Single instance of the plugin
     */
    private static $instance = null;
    
    /**
     * Get single instance
     */
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    /**
     * Constructor
     */
    private function __construct() {
        $this->init();
    }
    
    /**
     * Initialize plugin
     */
    private function init() {
        // Load text domain for translations
        add_action('plugins_loaded', array($this, 'load_textdomain'));
        
        // Register activation/deactivation hooks
        register_activation_hook(__FILE__, array($this, 'activate'));
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));
        
        // Initialize plugin components
        add_action('init', array($this, 'init_plugin'));
        
        // Admin hooks
        if (is_admin()) {
            add_action('admin_menu', array($this, 'add_admin_menu'));
            add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
        }
        
        // Frontend hooks
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_scripts'));
        add_shortcode('check_editor', array($this, 'shortcode_display'));
        
        // AJAX handlers
        add_action('wp_ajax_cep_save_template', array($this, 'ajax_save_template'));
        add_action('wp_ajax_cep_load_template', array($this, 'ajax_load_template'));
        add_action('wp_ajax_cep_delete_template', array($this, 'ajax_delete_template'));
        add_action('wp_ajax_cep_upload_image', array($this, 'ajax_upload_image'));
        
        // Allow non-logged in users if enabled in settings
        add_action('wp_ajax_nopriv_cep_save_template', array($this, 'ajax_save_template'));
        add_action('wp_ajax_nopriv_cep_load_template', array($this, 'ajax_load_template'));
    }
    
    /**
     * Load text domain for translations
     */
    public function load_textdomain() {
        load_plugin_textdomain('check-editor-pro', false, dirname(CHECK_EDITOR_PRO_PLUGIN_BASENAME) . '/languages');
    }
    
    /**
     * Plugin activation
     */
    public function activate() {
        $this->create_database_tables();
        $this->create_upload_directory();
        $this->set_default_options();
        
        // Flush rewrite rules
        flush_rewrite_rules();
    }
    
    /**
     * Plugin deactivation
     */
    public function deactivate() {
        // Clean up temporary files
        $this->cleanup_temp_files();
        
        // Flush rewrite rules
        flush_rewrite_rules();
    }
    
    /**
     * Initialize plugin components
     */
    public function init_plugin() {
        // Include required files
        $this->include_files();
        
        // Initialize components
        $this->init_components();
    }
    
    /**
     * Include required files
     */
    private function include_files() {
        require_once CHECK_EDITOR_PRO_PLUGIN_DIR . 'includes/class-database.php';
        require_once CHECK_EDITOR_PRO_PLUGIN_DIR . 'includes/class-templates.php';
        require_once CHECK_EDITOR_PRO_PLUGIN_DIR . 'includes/class-ajax-handler.php';
        require_once CHECK_EDITOR_PRO_PLUGIN_DIR . 'includes/class-file-handler.php';
        require_once CHECK_EDITOR_PRO_PLUGIN_DIR . 'includes/class-permissions.php';
        require_once CHECK_EDITOR_PRO_PLUGIN_DIR . 'admin/class-admin.php';
    }
    
    /**
     * Initialize components
     */
    private function init_components() {
        // Initialize database handler
        CheckEditorPro_Database::getInstance();
        
        // Initialize templates
        CheckEditorPro_Templates::getInstance();
        
        // Initialize admin if in admin area
        if (is_admin()) {
            CheckEditorPro_Admin::getInstance();
        }
    }
    
    /**
     * Create database tables
     */
    private function create_database_tables() {
        global $wpdb;
        
        $charset_collate = $wpdb->get_charset_collate();
        
        // Templates table
        $table_name = $wpdb->prefix . 'cep_templates';
        $sql = "CREATE TABLE $table_name (
            id int(11) NOT NULL AUTO_INCREMENT,
            name varchar(255) NOT NULL,
            type varchar(50) NOT NULL DEFAULT 'custom',
            data longtext NOT NULL,
            user_id int(11) NOT NULL,
            is_public tinyint(1) DEFAULT 0,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY user_id (user_id),
            KEY type (type),
            KEY is_public (is_public)
        ) $charset_collate;";
        
        // Settings table
        $settings_table = $wpdb->prefix . 'cep_settings';
        $sql .= "CREATE TABLE $settings_table (
            id int(11) NOT NULL AUTO_INCREMENT,
            option_name varchar(255) NOT NULL,
            option_value longtext,
            autoload varchar(20) NOT NULL DEFAULT 'yes',
            PRIMARY KEY (id),
            UNIQUE KEY option_name (option_name)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }
    
    /**
     * Create upload directory
     */
    private function create_upload_directory() {
        $upload_dir = wp_upload_dir();
        $check_editor_dir = $upload_dir['basedir'] . '/check-editor-pro';
        
        if (!file_exists($check_editor_dir)) {
            wp_mkdir_p($check_editor_dir);
            
            // Create .htaccess file for security
            $htaccess_content = "Options -Indexes\n";
            $htaccess_content .= "<Files *.php>\n";
            $htaccess_content .= "deny from all\n";
            $htaccess_content .= "</Files>\n";
            
            file_put_contents($check_editor_dir . '/.htaccess', $htaccess_content);
        }
    }
    
    /**
     * Set default options
     */
    private function set_default_options() {
        $default_options = array(
            'cep_allow_public_access' => '0',
            'cep_max_file_size' => '10',
            'cep_allowed_file_types' => 'jpg,jpeg,png,gif',
            'cep_default_template' => 'hk',
            'cep_enable_batch_processing' => '1',
            'cep_max_batch_items' => '50'
        );
        
        foreach ($default_options as $option => $value) {
            if (get_option($option) === false) {
                add_option($option, $value);
            }
        }
    }
    
    /**
     * Clean up temporary files
     */
    private function cleanup_temp_files() {
        $upload_dir = wp_upload_dir();
        $temp_dir = $upload_dir['basedir'] . '/check-editor-pro/temp';
        
        if (is_dir($temp_dir)) {
            $files = glob($temp_dir . '/*');
            foreach ($files as $file) {
                if (is_file($file)) {
                    unlink($file);
                }
            }
        }
    }
    
    /**
     * Add admin menu
     */
    public function add_admin_menu() {
        add_menu_page(
            __('Check Editor Pro', 'check-editor-pro'),
            __('Check Editor', 'check-editor-pro'),
            'manage_options',
            'check-editor-pro',
            array($this, 'admin_page'),
            'dashicons-edit-page',
            30
        );
        
        add_submenu_page(
            'check-editor-pro',
            __('Settings', 'check-editor-pro'),
            __('Settings', 'check-editor-pro'),
            'manage_options',
            'check-editor-pro-settings',
            array($this, 'settings_page')
        );
        
        add_submenu_page(
            'check-editor-pro',
            __('Templates', 'check-editor-pro'),
            __('Templates', 'check-editor-pro'),
            'manage_options',
            'check-editor-pro-templates',
            array($this, 'templates_page')
        );
    }
    
    /**
     * Enqueue admin scripts and styles
     */
    public function enqueue_admin_scripts($hook) {
        if (strpos($hook, 'check-editor-pro') === false) {
            return;
        }
        
        // CSS
        wp_enqueue_style(
            'check-editor-pro-admin',
            CHECK_EDITOR_PRO_PLUGIN_URL . 'assets/css/admin.css',
            array(),
            CHECK_EDITOR_PRO_VERSION
        );
        
        // JavaScript
        wp_enqueue_script(
            'check-editor-pro-admin',
            CHECK_EDITOR_PRO_PLUGIN_URL . 'assets/js/admin.js',
            array('jquery'),
            CHECK_EDITOR_PRO_VERSION,
            true
        );
        
        // Localize script
        wp_localize_script('check-editor-pro-admin', 'checkEditorPro', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('check_editor_pro_nonce'),
            'strings' => array(
                'confirmDelete' => __('Are you sure you want to delete this template?', 'check-editor-pro'),
                'saveSuccess' => __('Template saved successfully!', 'check-editor-pro'),
                'saveError' => __('Error saving template.', 'check-editor-pro')
            )
        ));
    }
    
    /**
     * Enqueue frontend scripts and styles
     */
    public function enqueue_frontend_scripts() {
        // Only enqueue on pages with the shortcode
        global $post;
        if (is_a($post, 'WP_Post') && has_shortcode($post->post_content, 'check_editor')) {
            
            // CSS
            wp_enqueue_style(
                'check-editor-pro-frontend',
                CHECK_EDITOR_PRO_PLUGIN_URL . 'assets/css/frontend.css',
                array(),
                CHECK_EDITOR_PRO_VERSION
            );
            
            // Third-party libraries
            wp_enqueue_script(
                'fabricjs',
                'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.0/fabric.min.js',
                array(),
                '5.3.0',
                true
            );
            
            wp_enqueue_script(
                'jspdf',
                'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
                array(),
                '2.5.1',
                true
            );
            
            wp_enqueue_script(
                'xlsx',
                'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
                array(),
                '0.18.5',
                true
            );
            
            // Plugin scripts
            wp_enqueue_script(
                'check-editor-pro-i18n',
                CHECK_EDITOR_PRO_PLUGIN_URL . 'assets/js/i18n.js',
                array(),
                CHECK_EDITOR_PRO_VERSION,
                true
            );
            
            wp_enqueue_script(
                'check-editor-pro-templates',
                CHECK_EDITOR_PRO_PLUGIN_URL . 'assets/js/templates.js',
                array(),
                CHECK_EDITOR_PRO_VERSION,
                true
            );
            
            wp_enqueue_script(
                'check-editor-pro-core',
                CHECK_EDITOR_PRO_PLUGIN_URL . 'assets/js/check-editor.js',
                array('fabricjs'),
                CHECK_EDITOR_PRO_VERSION,
                true
            );
            
            wp_enqueue_script(
                'check-editor-pro-app',
                CHECK_EDITOR_PRO_PLUGIN_URL . 'assets/js/app.js',
                array('check-editor-pro-core', 'check-editor-pro-i18n', 'check-editor-pro-templates'),
                CHECK_EDITOR_PRO_VERSION,
                true
            );
            
            // Localize script for WordPress integration
            wp_localize_script('check-editor-pro-app', 'checkEditorProWP', array(
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('check_editor_pro_nonce'),
                'uploadUrl' => wp_upload_dir()['baseurl'] . '/check-editor-pro/',
                'maxFileSize' => get_option('cep_max_file_size', 10) * 1024 * 1024, // Convert MB to bytes
                'allowedTypes' => explode(',', get_option('cep_allowed_file_types', 'jpg,jpeg,png,gif')),
                'userId' => get_current_user_id(),
                'isLoggedIn' => is_user_logged_in(),
                'canUpload' => current_user_can('upload_files'),
                'strings' => array(
                    'loginRequired' => __('Please log in to save templates.', 'check-editor-pro'),
                    'uploadError' => __('Upload failed. Please try again.', 'check-editor-pro'),
                    'fileTooLarge' => __('File is too large. Maximum size is', 'check-editor-pro'),
                    'invalidFileType' => __('Invalid file type. Allowed types:', 'check-editor-pro')
                )
            ));
        }
    }
    
    /**
     * Display shortcode
     */
    public function shortcode_display($atts) {
        $atts = shortcode_atts(array(
            'template' => get_option('cep_default_template', 'hk'),
            'width' => '100%',
            'height' => '600px',
            'allow_upload' => 'true',
            'allow_export' => 'true',
            'allow_batch' => get_option('cep_enable_batch_processing', '1') ? 'true' : 'false'
        ), $atts, 'check_editor');
        
        // Check permissions
        if (!$this->check_user_permissions()) {
            return '<p>' . __('You do not have permission to access the check editor.', 'check-editor-pro') . '</p>';
        }
        
        ob_start();
        include CHECK_EDITOR_PRO_PLUGIN_DIR . 'templates/check-editor-display.php';
        return ob_get_clean();
    }
    
    /**
     * Check user permissions
     */
    private function check_user_permissions() {
        // If public access is allowed
        if (get_option('cep_allow_public_access', '0') === '1') {
            return true;
        }
        
        // Check if user is logged in
        if (!is_user_logged_in()) {
            return false;
        }
        
        // Check user capabilities
        return current_user_can('edit_posts') || current_user_can('upload_files');
    }
    
    /**
     * AJAX: Save template
     */
    public function ajax_save_template() {
        check_ajax_referer('check_editor_pro_nonce', 'nonce');
        
        if (!$this->check_user_permissions()) {
            wp_die(__('Permission denied.', 'check-editor-pro'));
        }
        
        $name = sanitize_text_field($_POST['name']);
        $data = wp_kses_post($_POST['data']);
        $is_public = isset($_POST['is_public']) ? (bool)$_POST['is_public'] : false;
        
        global $wpdb;
        $table_name = $wpdb->prefix . 'cep_templates';
        
        $result = $wpdb->insert(
            $table_name,
            array(
                'name' => $name,
                'type' => 'custom',
                'data' => $data,
                'user_id' => get_current_user_id(),
                'is_public' => $is_public ? 1 : 0
            ),
            array('%s', '%s', '%s', '%d', '%d')
        );
        
        if ($result !== false) {
            wp_send_json_success(array(
                'id' => $wpdb->insert_id,
                'message' => __('Template saved successfully!', 'check-editor-pro')
            ));
        } else {
            wp_send_json_error(__('Failed to save template.', 'check-editor-pro'));
        }
    }
    
    /**
     * AJAX: Load template
     */
    public function ajax_load_template() {
        check_ajax_referer('check_editor_pro_nonce', 'nonce');
        
        $template_id = intval($_POST['template_id']);
        
        global $wpdb;
        $table_name = $wpdb->prefix . 'cep_templates';
        
        $template = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $table_name WHERE id = %d AND (is_public = 1 OR user_id = %d)",
            $template_id,
            get_current_user_id()
        ));
        
        if ($template) {
            wp_send_json_success(array(
                'data' => json_decode($template->data, true),
                'name' => $template->name
            ));
        } else {
            wp_send_json_error(__('Template not found.', 'check-editor-pro'));
        }
    }
    
    /**
     * AJAX: Delete template
     */
    public function ajax_delete_template() {
        check_ajax_referer('check_editor_pro_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die(__('Permission denied.', 'check-editor-pro'));
        }
        
        $template_id = intval($_POST['template_id']);
        
        global $wpdb;
        $table_name = $wpdb->prefix . 'cep_templates';
        
        $result = $wpdb->delete(
            $table_name,
            array('id' => $template_id),
            array('%d')
        );
        
        if ($result !== false) {
            wp_send_json_success(__('Template deleted successfully!', 'check-editor-pro'));
        } else {
            wp_send_json_error(__('Failed to delete template.', 'check-editor-pro'));
        }
    }
    
    /**
     * AJAX: Upload image
     */
    public function ajax_upload_image() {
        check_ajax_referer('check_editor_pro_nonce', 'nonce');
        
        if (!current_user_can('upload_files')) {
            wp_die(__('Permission denied.', 'check-editor-pro'));
        }
        
        if (!function_exists('wp_handle_upload')) {
            require_once(ABSPATH . 'wp-admin/includes/file.php');
        }
        
        $uploadedfile = $_FILES['file'];
        $upload_overrides = array('test_form' => false);
        
        $movefile = wp_handle_upload($uploadedfile, $upload_overrides);
        
        if ($movefile && !isset($movefile['error'])) {
            wp_send_json_success(array(
                'url' => $movefile['url'],
                'message' => __('Image uploaded successfully!', 'check-editor-pro')
            ));
        } else {
            wp_send_json_error($movefile['error']);
        }
    }
    
    /**
     * Admin page
     */
    public function admin_page() {
        include CHECK_EDITOR_PRO_PLUGIN_DIR . 'admin/pages/main.php';
    }
    
    /**
     * Settings page
     */
    public function settings_page() {
        include CHECK_EDITOR_PRO_PLUGIN_DIR . 'admin/pages/settings.php';
    }
    
    /**
     * Templates page
     */
    public function templates_page() {
        include CHECK_EDITOR_PRO_PLUGIN_DIR . 'admin/pages/templates.php';
    }
}

// Initialize the plugin
CheckEditorPro::getInstance();