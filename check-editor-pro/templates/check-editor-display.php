<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

$container_id = 'check-editor-pro-' . uniqid();
?>

<div id="<?php echo $container_id; ?>" class="check-editor-pro-container" style="width: <?php echo esc_attr($atts['width']); ?>; height: <?php echo esc_attr($atts['height']); ?>;">
    <!-- Header -->
    <header class="cep-header">
        <div class="cep-header-content">
            <h3 class="cep-app-title" data-i18n="app.title"><?php _e('支票編輯工具', 'check-editor-pro'); ?></h3>
            <div class="cep-header-controls">
                <select id="cepLanguageSelect" class="cep-language-select">
                    <option value="zh-TW"><?php _e('繁體中文', 'check-editor-pro'); ?></option>
                    <option value="en"><?php _e('English', 'check-editor-pro'); ?></option>
                </select>
                <button id="cepHelpBtn" class="cep-btn cep-btn-secondary" data-i18n="buttons.help"><?php _e('說明', 'check-editor-pro'); ?></button>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <div class="cep-main-content">
        <!-- Sidebar -->
        <aside class="cep-sidebar">
            <div class="cep-sidebar-section">
                <h4 data-i18n="sidebar.upload"><?php _e('上傳支票', 'check-editor-pro'); ?></h4>
                <div class="cep-upload-area" id="cepUploadArea">
                    <div class="cep-upload-content">
                        <div class="cep-upload-icon">📄</div>
                        <p data-i18n="upload.dragdrop"><?php _e('拖放支票圖像至此', 'check-editor-pro'); ?></p>
                        <p data-i18n="upload.or"><?php _e('或', 'check-editor-pro'); ?></p>
                        <button class="cep-btn cep-btn-primary" id="cepUploadBtn" data-i18n="upload.browse"><?php _e('瀏覽檔案', 'check-editor-pro'); ?></button>
                        <input type="file" id="cepFileInput" accept="image/*" style="display: none;">
                    </div>
                </div>
            </div>

            <div class="cep-sidebar-section">
                <h4 data-i18n="sidebar.templates"><?php _e('範本', 'check-editor-pro'); ?></h4>
                <div class="cep-template-grid">
                    <button class="cep-template-btn" data-template="hk" data-i18n="templates.hk"><?php _e('香港支票', 'check-editor-pro'); ?></button>
                    <button class="cep-template-btn" data-template="cn" data-i18n="templates.cn"><?php _e('中國支票', 'check-editor-pro'); ?></button>
                    <button class="cep-template-btn" data-template="us" data-i18n="templates.us"><?php _e('美國支票', 'check-editor-pro'); ?></button>
                </div>
                
                <?php if (is_user_logged_in()): ?>
                <div class="cep-user-templates">
                    <h5><?php _e('我的範本', 'check-editor-pro'); ?></h5>
                    <div id="cepUserTemplates" class="cep-user-template-list">
                        <!-- User templates will be loaded here -->
                    </div>
                </div>
                <?php endif; ?>
            </div>

            <div class="cep-sidebar-section">
                <h4 data-i18n="sidebar.fields"><?php _e('欄位工具', 'check-editor-pro'); ?></h4>
                <div class="cep-field-tools">
                    <button class="cep-field-btn" data-field="payee" data-i18n="fields.payee"><?php _e('收款人', 'check-editor-pro'); ?></button>
                    <button class="cep-field-btn" data-field="amount-number" data-i18n="fields.amount_number"><?php _e('金額(數字)', 'check-editor-pro'); ?></button>
                    <button class="cep-field-btn" data-field="amount-text" data-i18n="fields.amount_text"><?php _e('金額(大寫)', 'check-editor-pro'); ?></button>
                    <button class="cep-field-btn" data-field="date" data-i18n="fields.date"><?php _e('日期', 'check-editor-pro'); ?></button>
                    <button class="cep-field-btn" data-field="memo" data-i18n="fields.memo"><?php _e('備註', 'check-editor-pro'); ?></button>
                    <button class="cep-field-btn" data-field="signature" data-i18n="fields.signature"><?php _e('簽名', 'check-editor-pro'); ?></button>
                </div>
            </div>

            <?php if ($atts['allow_batch'] === 'true' && get_option('cep_enable_batch_processing', '1') === '1'): ?>
            <div class="cep-sidebar-section">
                <h4 data-i18n="sidebar.batch"><?php _e('批量處理', 'check-editor-pro'); ?></h4>
                <div class="cep-batch-tools">
                    <button class="cep-btn cep-btn-secondary" id="cepImportExcelBtn" data-i18n="batch.import_excel"><?php _e('匯入 Excel', 'check-editor-pro'); ?></button>
                    <input type="file" id="cepExcelInput" accept=".xlsx,.xls" style="display: none;">
                    <button class="cep-btn cep-btn-secondary" id="cepBatchGenerateBtn" data-i18n="batch.generate" disabled><?php _e('批量生成', 'check-editor-pro'); ?></button>
                </div>
            </div>
            <?php endif; ?>

            <?php if ($atts['allow_export'] === 'true'): ?>
            <div class="cep-sidebar-section">
                <h4 data-i18n="sidebar.export"><?php _e('導出', 'check-editor-pro'); ?></h4>
                <div class="cep-export-tools">
                    <button class="cep-btn cep-btn-success" id="cepExportPdfBtn" data-i18n="export.pdf"><?php _e('下載 PDF', 'check-editor-pro'); ?></button>
                    <button class="cep-btn cep-btn-secondary" id="cepExportImageBtn" data-i18n="export.image"><?php _e('下載圖片', 'check-editor-pro'); ?></button>
                </div>
            </div>
            <?php endif; ?>

            <?php if (is_user_logged_in()): ?>
            <div class="cep-sidebar-section">
                <h4 data-i18n="sidebar.cloud"><?php _e('範本管理', 'check-editor-pro'); ?></h4>
                <div class="cep-cloud-tools">
                    <button class="cep-btn cep-btn-secondary" id="cepSaveTemplateBtn" data-i18n="cloud.save"><?php _e('儲存範本', 'check-editor-pro'); ?></button>
                    <button class="cep-btn cep-btn-secondary" id="cepShareBtn" data-i18n="cloud.share"><?php _e('分享', 'check-editor-pro'); ?></button>
                    <button class="cep-btn cep-btn-secondary" id="cepLoadTemplateBtn" data-i18n="cloud.load"><?php _e('載入範本', 'check-editor-pro'); ?></button>
                </div>
            </div>
            <?php endif; ?>
        </aside>

                    <!-- Canvas Area -->
            <main class="cep-canvas-area">
                <div class="cep-canvas-toolbar">
                    <div class="cep-zoom-controls">
                        <button id="cepZoomOutBtn" class="cep-btn cep-btn-sm">-</button>
                        <span id="cepZoomLevel">100%</span>
                        <button id="cepZoomInBtn" class="cep-btn cep-btn-sm">+</button>
                        <button id="cepFitToScreenBtn" class="cep-btn cep-btn-sm" data-i18n="zoom.fit"><?php _e('適合螢幕', 'check-editor-pro'); ?></button>
                    </div>
                    
                    <div class="cep-canvas-size-controls">
                        <label><?php _e('畫布尺寸:', 'check-editor-pro'); ?></label>
                        <select id="cepCanvasSizePreset" class="cep-form-control-sm">
                            <option value="custom"><?php _e('自訂', 'check-editor-pro'); ?></option>
                            <option value="hk_check"><?php _e('香港支票 (215×85mm)', 'check-editor-pro'); ?></option>
                            <option value="us_check"><?php _e('美國支票 (203×89mm)', 'check-editor-pro'); ?></option>
                            <option value="cn_check"><?php _e('中國支票 (190×80mm)', 'check-editor-pro'); ?></option>
                            <option value="a4_landscape"><?php _e('A4橫向 (297×210mm)', 'check-editor-pro'); ?></option>
                            <option value="a5_landscape"><?php _e('A5橫向 (210×148mm)', 'check-editor-pro'); ?></option>
                        </select>
                        <input type="number" id="cepCanvasWidth" placeholder="寬度" class="cep-form-control-xs" min="50" max="2000">
                        <span>×</span>
                        <input type="number" id="cepCanvasHeight" placeholder="高度" class="cep-form-control-xs" min="50" max="2000">
                        <select id="cepCanvasUnit" class="cep-form-control-xs">
                            <option value="px">px</option>
                            <option value="mm" selected>mm</option>
                            <option value="cm">cm</option>
                            <option value="in">in</option>
                        </select>
                        <button id="cepApplySizeBtn" class="cep-btn cep-btn-sm cep-btn-primary"><?php _e('套用', 'check-editor-pro'); ?></button>
                    </div>
                    
                    <div class="cep-canvas-tools">
                        <button id="cepToggleRulerBtn" class="cep-btn cep-btn-sm" title="<?php _e('顯示/隱藏標尺', 'check-editor-pro'); ?>">📏</button>
                        <button id="cepToggleGridBtn" class="cep-btn cep-btn-sm" title="<?php _e('顯示/隱藏網格', 'check-editor-pro'); ?>">⊞</button>
                        <button id="cepSnapToGridBtn" class="cep-btn cep-btn-sm" title="<?php _e('對齊網格', 'check-editor-pro'); ?>">⊡</button>
                    </div>
                    
                    <div class="cep-canvas-info">
                        <span id="cepCanvasSize"><?php _e('尺寸: 未設定', 'check-editor-pro'); ?></span>
                        <span id="cepMousePosition" class="cep-mouse-pos"></span>
                    </div>
                </div>
                <div class="cep-canvas-container" id="cepCanvasContainer">
                    <!-- Horizontal Ruler -->
                    <div id="cepHorizontalRuler" class="cep-ruler cep-ruler-horizontal"></div>
                    <!-- Vertical Ruler -->
                    <div id="cepVerticalRuler" class="cep-ruler cep-ruler-vertical"></div>
                    <!-- Canvas with rulers -->
                    <div class="cep-canvas-wrapper">
                        <canvas id="cepCheckCanvas"></canvas>
                        <!-- Grid overlay -->
                        <div id="cepGridOverlay" class="cep-grid-overlay"></div>
                    </div>
                </div>
            </main>

        <!-- Properties Panel -->
        <aside class="cep-properties-panel" id="cepPropertiesPanel" style="display: none;">
            <h4 data-i18n="properties.title"><?php _e('屬性設定', 'check-editor-pro'); ?></h4>
            <div class="cep-property-group">
                <label data-i18n="properties.text"><?php _e('文字內容:', 'check-editor-pro'); ?></label>
                <input type="text" id="cepFieldText" class="cep-form-control">
            </div>
            <div class="cep-property-group">
                <label data-i18n="properties.font_size"><?php _e('字體大小:', 'check-editor-pro'); ?></label>
                <input type="range" id="cepFontSize" min="8" max="72" value="16" class="cep-form-range">
                <span id="cepFontSizeValue">16px</span>
            </div>
            <div class="cep-property-group">
                <label data-i18n="properties.font_color"><?php _e('字體顏色:', 'check-editor-pro'); ?></label>
                <input type="color" id="cepFontColor" value="#000000" class="cep-form-control">
            </div>
            <div class="cep-property-group">
                <label data-i18n="properties.font_family"><?php _e('字體:', 'check-editor-pro'); ?></label>
                <select id="cepFontFamily" class="cep-form-control">
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Microsoft JhengHei"><?php _e('微軟正黑體', 'check-editor-pro'); ?></option>
                    <option value="Noto Sans TC">Noto Sans TC</option>
                </select>
            </div>
            <div class="cep-property-group">
                <label data-i18n="properties.position"><?php _e('位置:', 'check-editor-pro'); ?></label>
                <div class="cep-position-inputs">
                    <label>X: <input type="number" id="cepPositionX" class="cep-form-control-sm"></label>
                    <label>Y: <input type="number" id="cepPositionY" class="cep-form-control-sm"></label>
                </div>
            </div>
        </aside>
    </div>

    <!-- Modals -->
    <div id="cepModal" class="cep-modal" style="display: none;">
        <div class="cep-modal-content">
            <span class="cep-close">&times;</span>
            <div id="cepModalBody"></div>
        </div>
    </div>

    <!-- Loading overlay -->
    <div id="cepLoadingOverlay" class="cep-loading-overlay" style="display: none;">
        <div class="cep-loading-spinner"></div>
        <p><?php _e('處理中...', 'check-editor-pro'); ?></p>
    </div>
</div>

<script type="text/javascript">
jQuery(document).ready(function($) {
    // Initialize Check Editor for this instance
    if (typeof CheckEditorProWP !== 'undefined') {
        window.checkEditorPro_<?php echo str_replace('-', '_', $container_id); ?> = new CheckEditorProWordPress({
            containerId: '<?php echo $container_id; ?>',
            canvasId: 'cepCheckCanvas',
            defaultTemplate: '<?php echo esc_js($atts['template']); ?>',
            allowUpload: <?php echo $atts['allow_upload'] === 'true' ? 'true' : 'false'; ?>,
            allowExport: <?php echo $atts['allow_export'] === 'true' ? 'true' : 'false'; ?>,
            allowBatch: <?php echo $atts['allow_batch'] === 'true' ? 'true' : 'false'; ?>,
            wpSettings: CheckEditorProWP
        });
    }
});
</script>