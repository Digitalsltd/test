<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Handle form submission
if (isset($_POST['submit']) && wp_verify_nonce($_POST['_wpnonce'], 'cep_settings_nonce')) {
    // Sanitize and save settings
    update_option('cep_allow_public_access', isset($_POST['cep_allow_public_access']) ? '1' : '0');
    update_option('cep_max_file_size', absint($_POST['cep_max_file_size']));
    update_option('cep_allowed_file_types', sanitize_text_field($_POST['cep_allowed_file_types']));
    update_option('cep_default_template', sanitize_text_field($_POST['cep_default_template']));
    update_option('cep_enable_batch_processing', isset($_POST['cep_enable_batch_processing']) ? '1' : '0');
    update_option('cep_max_batch_items', absint($_POST['cep_max_batch_items']));
    update_option('cep_auto_save_templates', isset($_POST['cep_auto_save_templates']) ? '1' : '0');
    update_option('cep_enable_sharing', isset($_POST['cep_enable_sharing']) ? '1' : '0');
    
    echo '<div class="notice notice-success"><p>' . __('設定已儲存！', 'check-editor-pro') . '</p></div>';
}

// Get current settings
$allow_public_access = get_option('cep_allow_public_access', '0');
$max_file_size = get_option('cep_max_file_size', '10');
$allowed_file_types = get_option('cep_allowed_file_types', 'jpg,jpeg,png,gif');
$default_template = get_option('cep_default_template', 'hk');
$enable_batch_processing = get_option('cep_enable_batch_processing', '1');
$max_batch_items = get_option('cep_max_batch_items', '50');
$auto_save_templates = get_option('cep_auto_save_templates', '1');
$enable_sharing = get_option('cep_enable_sharing', '1');
?>

<div class="wrap">
    <h1><?php _e('Check Editor Pro - 設定', 'check-editor-pro'); ?></h1>
    
    <form method="post" action="">
        <?php wp_nonce_field('cep_settings_nonce'); ?>
        
        <table class="form-table">
            <tbody>
                <tr>
                    <th scope="row">
                        <label for="cep_allow_public_access"><?php _e('允許公開存取', 'check-editor-pro'); ?></label>
                    </th>
                    <td>
                        <input type="checkbox" id="cep_allow_public_access" name="cep_allow_public_access" value="1" <?php checked($allow_public_access, '1'); ?>>
                        <p class="description"><?php _e('允許未登入的用戶使用支票編輯器。', 'check-editor-pro'); ?></p>
                    </td>
                </tr>
                
                <tr>
                    <th scope="row">
                        <label for="cep_max_file_size"><?php _e('最大檔案大小 (MB)', 'check-editor-pro'); ?></label>
                    </th>
                    <td>
                        <input type="number" id="cep_max_file_size" name="cep_max_file_size" value="<?php echo esc_attr($max_file_size); ?>" min="1" max="100" class="small-text">
                        <p class="description"><?php _e('設定允許上傳的最大檔案大小。', 'check-editor-pro'); ?></p>
                    </td>
                </tr>
                
                <tr>
                    <th scope="row">
                        <label for="cep_allowed_file_types"><?php _e('允許的檔案格式', 'check-editor-pro'); ?></label>
                    </th>
                    <td>
                        <input type="text" id="cep_allowed_file_types" name="cep_allowed_file_types" value="<?php echo esc_attr($allowed_file_types); ?>" class="regular-text">
                        <p class="description"><?php _e('輸入允許的檔案格式，用逗號分隔。例如：jpg,jpeg,png,gif', 'check-editor-pro'); ?></p>
                    </td>
                </tr>
                
                <tr>
                    <th scope="row">
                        <label for="cep_default_template"><?php _e('預設範本', 'check-editor-pro'); ?></label>
                    </th>
                    <td>
                        <select id="cep_default_template" name="cep_default_template">
                            <option value="hk" <?php selected($default_template, 'hk'); ?>><?php _e('香港支票', 'check-editor-pro'); ?></option>
                            <option value="cn" <?php selected($default_template, 'cn'); ?>><?php _e('中國支票', 'check-editor-pro'); ?></option>
                            <option value="us" <?php selected($default_template, 'us'); ?>><?php _e('美國支票', 'check-editor-pro'); ?></option>
                        </select>
                        <p class="description"><?php _e('選擇預設載入的支票範本。', 'check-editor-pro'); ?></p>
                    </td>
                </tr>
                
                <tr>
                    <th scope="row">
                        <label for="cep_enable_batch_processing"><?php _e('啟用批量處理', 'check-editor-pro'); ?></label>
                    </th>
                    <td>
                        <input type="checkbox" id="cep_enable_batch_processing" name="cep_enable_batch_processing" value="1" <?php checked($enable_batch_processing, '1'); ?>>
                        <p class="description"><?php _e('允許用戶匯入 Excel 檔案進行批量支票生成。', 'check-editor-pro'); ?></p>
                    </td>
                </tr>
                
                <tr>
                    <th scope="row">
                        <label for="cep_max_batch_items"><?php _e('批量處理最大項目數', 'check-editor-pro'); ?></label>
                    </th>
                    <td>
                        <input type="number" id="cep_max_batch_items" name="cep_max_batch_items" value="<?php echo esc_attr($max_batch_items); ?>" min="1" max="1000" class="small-text">
                        <p class="description"><?php _e('限制單次批量處理的最大項目數量。', 'check-editor-pro'); ?></p>
                    </td>
                </tr>
                
                <tr>
                    <th scope="row">
                        <label for="cep_auto_save_templates"><?php _e('自動儲存範本', 'check-editor-pro'); ?></label>
                    </th>
                    <td>
                        <input type="checkbox" id="cep_auto_save_templates" name="cep_auto_save_templates" value="1" <?php checked($auto_save_templates, '1'); ?>>
                        <p class="description"><?php _e('自動儲存用戶的範本編輯。', 'check-editor-pro'); ?></p>
                    </td>
                </tr>
                
                <tr>
                    <th scope="row">
                        <label for="cep_enable_sharing"><?php _e('啟用分享功能', 'check-editor-pro'); ?></label>
                    </th>
                    <td>
                        <input type="checkbox" id="cep_enable_sharing" name="cep_enable_sharing" value="1" <?php checked($enable_sharing, '1'); ?>>
                        <p class="description"><?php _e('允許用戶分享範本給其他人。', 'check-editor-pro'); ?></p>
                    </td>
                </tr>
            </tbody>
        </table>
        
        <?php submit_button(__('儲存設定', 'check-editor-pro')); ?>
    </form>
    
    <hr>
    
    <h2><?php _e('系統資訊', 'check-editor-pro'); ?></h2>
    <table class="widefat">
        <thead>
            <tr>
                <th><?php _e('項目', 'check-editor-pro'); ?></th>
                <th><?php _e('值', 'check-editor-pro'); ?></th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><?php _e('插件版本', 'check-editor-pro'); ?></td>
                <td><?php echo CHECK_EDITOR_PRO_VERSION; ?></td>
            </tr>
            <tr>
                <td><?php _e('WordPress 版本', 'check-editor-pro'); ?></td>
                <td><?php echo get_bloginfo('version'); ?></td>
            </tr>
            <tr>
                <td><?php _e('PHP 版本', 'check-editor-pro'); ?></td>
                <td><?php echo PHP_VERSION; ?></td>
            </tr>
            <tr>
                <td><?php _e('上傳目錄', 'check-editor-pro'); ?></td>
                <td>
                    <?php 
                    $upload_dir = wp_upload_dir();
                    $check_editor_dir = $upload_dir['basedir'] . '/check-editor-pro';
                    echo esc_html($check_editor_dir);
                    if (is_writable($check_editor_dir)) {
                        echo ' <span style="color: green;">✓ ' . __('可寫入', 'check-editor-pro') . '</span>';
                    } else {
                        echo ' <span style="color: red;">✗ ' . __('無法寫入', 'check-editor-pro') . '</span>';
                    }
                    ?>
                </td>
            </tr>
            <tr>
                <td><?php _e('資料庫表格', 'check-editor-pro'); ?></td>
                <td>
                    <?php
                    global $wpdb;
                    $templates_table = $wpdb->prefix . 'cep_templates';
                    $settings_table = $wpdb->prefix . 'cep_settings';
                    
                    $templates_exists = $wpdb->get_var("SHOW TABLES LIKE '$templates_table'") === $templates_table;
                    $settings_exists = $wpdb->get_var("SHOW TABLES LIKE '$settings_table'") === $settings_table;
                    
                    if ($templates_exists && $settings_exists) {
                        echo '<span style="color: green;">✓ ' . __('已建立', 'check-editor-pro') . '</span>';
                    } else {
                        echo '<span style="color: red;">✗ ' . __('未建立', 'check-editor-pro') . '</span>';
                    }
                    ?>
                </td>
            </tr>
            <tr>
                <td><?php _e('範本數量', 'check-editor-pro'); ?></td>
                <td>
                    <?php
                    global $wpdb;
                    $templates_table = $wpdb->prefix . 'cep_templates';
                    $count = $wpdb->get_var("SELECT COUNT(*) FROM $templates_table");
                    echo intval($count);
                    ?>
                </td>
            </tr>
        </tbody>
    </table>
    
    <hr>
    
    <h2><?php _e('使用說明', 'check-editor-pro'); ?></h2>
    <div class="cep-usage-info">
        <h3><?php _e('短代碼使用方法', 'check-editor-pro'); ?></h3>
        <p><?php _e('在任何文章或頁面中使用以下短代碼來顯示支票編輯器：', 'check-editor-pro'); ?></p>
        
        <h4><?php _e('基本使用', 'check-editor-pro'); ?></h4>
        <code>[check_editor]</code>
        
        <h4><?php _e('自訂參數', 'check-editor-pro'); ?></h4>
        <code>[check_editor template="hk" width="100%" height="600px" allow_upload="true" allow_export="true" allow_batch="true"]</code>
        
        <h4><?php _e('參數說明', 'check-editor-pro'); ?></h4>
        <ul>
            <li><strong>template</strong>: 預設範本 (hk/cn/us)</li>
            <li><strong>width</strong>: 寬度 (例如：100%, 800px)</li>
            <li><strong>height</strong>: 高度 (例如：600px, 80vh)</li>
            <li><strong>allow_upload</strong>: 是否允許上傳圖片 (true/false)</li>
            <li><strong>allow_export</strong>: 是否允許導出 (true/false)</li>
            <li><strong>allow_batch</strong>: 是否允許批量處理 (true/false)</li>
        </ul>
        
        <h4><?php _e('範例', 'check-editor-pro'); ?></h4>
        <p><?php _e('只允許編輯，不允許上傳和批量處理：', 'check-editor-pro'); ?></p>
        <code>[check_editor allow_upload="false" allow_batch="false"]</code>
        
        <p><?php _e('使用美國支票範本，固定大小：', 'check-editor-pro'); ?></p>
        <code>[check_editor template="us" width="900px" height="500px"]</code>
    </div>
    
    <style>
    .cep-usage-info {
        background: #f9f9f9;
        padding: 20px;
        border-radius: 5px;
        margin-top: 20px;
    }
    .cep-usage-info code {
        background: #333;
        color: #fff;
        padding: 10px;
        display: block;
        margin: 10px 0;
        border-radius: 3px;
        font-family: monospace;
    }
    .cep-usage-info h4 {
        margin-top: 20px;
        margin-bottom: 10px;
    }
    .cep-usage-info ul {
        margin-left: 20px;
    }
    </style>
</div>