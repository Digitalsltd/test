// app.js - WordPress adapted Check Editor application
class CheckEditorProWordPress {
    constructor(options) {
        this.containerId = options.containerId;
        this.canvasId = options.canvasId;
        this.container = document.getElementById(this.containerId);
        this.editor = null;
        this.batchData = [];
        this.currentTemplate = options.defaultTemplate || 'hk';
        this.wpSettings = options.wpSettings || {};
        this.options = options;
        
        this.init();
    }

    init() {
        // Wait for all dependencies to load
        if (typeof fabric === 'undefined' || typeof window.jspdf === 'undefined') {
            setTimeout(() => this.init(), 100);
            return;
        }

        // Initialize editor with scoped IDs
        this.editor = new CheckEditorPro(this.canvasId);
        
        // Override some methods for WordPress integration
        this.setupWordPressIntegration();
        
        // Set up event listeners with scoped selectors
        this.setupFileUpload();
        this.setupTemplateSelection();
        this.setupFieldTools();
        this.setupBatchProcessing();
        this.setupExportTools();
        this.setupCloudStorage();
        this.setupHelpModal();
        this.setupCanvasSizeControls();
        this.setupRulerAndGrid();
        
        // Load default template
        this.loadTemplate(this.currentTemplate);
        
        // Load user templates if logged in
        if (this.wpSettings.isLoggedIn) {
            this.loadUserTemplates();
        }
        
        console.log('Check Editor Pro WordPress initialized');
    }

    setupWordPressIntegration() {
        // Override original methods to work with WordPress
        const originalShowMessage = this.showMessage;
        this.showMessage = (message, type = 'info') => {
            this.showWordPressMessage(message, type);
        };

        // Override AJAX calls to use WordPress AJAX
        this.originalSaveToCloud = this.saveToCloud;
        this.saveToCloud = () => this.saveToWordPressDatabase();
    }

    // Scoped element selection
    $(selector) {
        return this.container.querySelector(selector);
    }

    $$(selector) {
        return this.container.querySelectorAll(selector);
    }

    setupFileUpload() {
        const uploadArea = this.$('#cepUploadArea');
        const fileInput = this.$('#cepFileInput');
        const uploadBtn = this.$('#cepUploadBtn');

        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file && file.type.startsWith('image/')) {
                    this.handleImageUpload(file);
                } else {
                    this.showMessage(this.wpSettings.strings.invalidFileType + ': ' + this.wpSettings.allowedTypes.join(', '), 'error');
                }
            });
        }

        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                if (!this.wpSettings.canUpload) {
                    this.showMessage(this.wpSettings.strings.loginRequired, 'error');
                    return;
                }
                fileInput?.click();
            });
        }

        if (uploadArea) {
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('dragover');
            });

            uploadArea.addEventListener('dragleave', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
                
                if (!this.wpSettings.canUpload) {
                    this.showMessage(this.wpSettings.strings.loginRequired, 'error');
                    return;
                }
                
                const files = e.dataTransfer.files;
                if (files.length > 0 && files[0].type.startsWith('image/')) {
                    this.handleImageUpload(files[0]);
                } else {
                    this.showMessage(this.wpSettings.strings.invalidFileType, 'error');
                }
            });

            uploadArea.addEventListener('click', () => {
                if (!this.wpSettings.canUpload) {
                    this.showMessage(this.wpSettings.strings.loginRequired, 'error');
                    return;
                }
                fileInput?.click();
            });
        }
    }

    handleImageUpload(file) {
        // Check file size
        if (file.size > this.wpSettings.maxFileSize) {
            this.showMessage(this.wpSettings.strings.fileTooLarge + ' ' + (this.wpSettings.maxFileSize / 1024 / 1024) + 'MB', 'error');
            return;
        }

        // Check file type
        const fileExt = file.name.split('.').pop().toLowerCase();
        if (!this.wpSettings.allowedTypes.includes(fileExt)) {
            this.showMessage(this.wpSettings.strings.invalidFileType + ': ' + this.wpSettings.allowedTypes.join(', '), 'error');
            return;
        }

        this.showLoading(true);

        // Upload to WordPress using AJAX
        const formData = new FormData();
        formData.append('action', 'cep_upload_image');
        formData.append('nonce', this.wpSettings.nonce);
        formData.append('file', file);

        fetch(this.wpSettings.ajaxUrl, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            this.showLoading(false);
            if (data.success) {
                this.editor.loadBackgroundImage(data.data.url)
                    .then(() => {
                        this.showMessage(data.data.message, 'success');
                        this.editor.fitToScreen();
                    })
                    .catch(() => {
                        this.showMessage(this.wpSettings.strings.uploadError, 'error');
                    });
            } else {
                this.showMessage(data.data || this.wpSettings.strings.uploadError, 'error');
            }
        })
        .catch(() => {
            this.showLoading(false);
            this.showMessage(this.wpSettings.strings.uploadError, 'error');
        });
    }

    setupTemplateSelection() {
        const templateBtns = this.$$('.cep-template-btn');
        
        templateBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const templateId = btn.getAttribute('data-template');
                this.loadTemplate(templateId);
                
                // Update active state
                templateBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    loadTemplate(templateId) {
        if (typeof window.checkTemplates === 'undefined') {
            setTimeout(() => this.loadTemplate(templateId), 100);
            return;
        }

        const template = window.checkTemplates.getTemplate(templateId);
        if (template) {
            this.currentTemplate = templateId;
            
            // Set canvas size
            this.editor.setCanvasSize(template.size.width, template.size.height);
            
            // Clear existing fields
            this.editor.clearAllFields();
            
            // Set background
            this.editor.setBackgroundColor(template.backgroundColor);
            
            // Draw template background
            if (template.background) {
                this.editor.drawTemplateBackground(template.background);
            }
            
            // Add template fields
            template.fields.forEach(fieldConfig => {
                this.editor.addField(fieldConfig);
            });
            
            this.editor.fitToScreen();
            this.showMessage(`已載入 ${template.nameCn} 範本`, 'success');
        }
    }

    setupFieldTools() {
        const fieldBtns = this.$$('.cep-field-btn');
        
        fieldBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const fieldType = btn.getAttribute('data-field');
                this.addFieldToCanvas(fieldType);
            });
        });
    }

    addFieldToCanvas(fieldType) {
        if (typeof window.checkTemplates === 'undefined') return;
        
        const fieldConfig = window.checkTemplates.createFieldConfig(fieldType, 100, 100);
        if (fieldConfig) {
            this.editor.addField(fieldConfig);
        }
    }

    setupBatchProcessing() {
        if (!this.options.allowBatch) return;

        const importExcelBtn = this.$('#cepImportExcelBtn');
        const excelInput = this.$('#cepExcelInput');
        const batchGenerateBtn = this.$('#cepBatchGenerateBtn');

        if (importExcelBtn) {
            importExcelBtn.addEventListener('click', () => {
                if (!this.wpSettings.isLoggedIn) {
                    this.showMessage(this.wpSettings.strings.loginRequired, 'error');
                    return;
                }
                excelInput?.click();
            });
        }

        if (excelInput) {
            excelInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.handleExcelImport(file);
                }
            });
        }

        if (batchGenerateBtn) {
            batchGenerateBtn.addEventListener('click', () => {
                this.generateBatchChecks();
            });
        }
    }

    handleExcelImport(file) {
        if (typeof XLSX === 'undefined') {
            this.showMessage('Excel 處理庫未載入', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet);
                
                this.batchData = jsonData;
                const batchGenerateBtn = this.$('#cepBatchGenerateBtn');
                if (batchGenerateBtn) {
                    batchGenerateBtn.disabled = false;
                }
                
                this.showMessage(`Excel 匯入成功 (${jsonData.length} 筆記錄)`, 'success');
            } catch (error) {
                console.error('Excel import error:', error);
                this.showMessage('Excel 匯入失敗', 'error');
            }
        };
        reader.readAsArrayBuffer(file);
    }

    generateBatchChecks() {
        if (this.batchData.length === 0) {
            this.showMessage('請先匯入 Excel 檔案', 'error');
            return;
        }

        if (typeof window.jspdf === 'undefined') {
            this.showMessage('PDF 生成庫未載入', 'error');
            return;
        }

        this.showLoading(true);
        this.showMessage('開始批量生成支票...', 'info');
        
        // Create PDF with multiple checks
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('landscape', 'mm', 'a4');
        
        this.batchData.forEach((row, index) => {
            if (index > 0) {
                pdf.addPage();
            }
            
            // Update fields with row data
            this.updateFieldsWithData(row);
            
            // Export current check to PDF page
            const imageData = this.editor.exportAsImage('png');
            const imgWidth = 250; // A4 landscape width in mm
            const imgHeight = (this.editor.canvas.height / this.editor.canvas.width) * imgWidth;
            
            pdf.addImage(imageData, 'PNG', 20, 20, imgWidth, imgHeight);
        });
        
        // Download PDF
        pdf.save(`batch_checks_${new Date().toISOString().split('T')[0]}.pdf`);
        this.showLoading(false);
        this.showMessage('批量生成完成', 'success');
    }

    updateFieldsWithData(data) {
        this.editor.fields.forEach(field => {
            const fieldType = field.fieldType;
            let value = '';
            
            switch (fieldType) {
                case 'payee':
                    value = data['收款人'] || data['payee'] || data['Payee'] || '';
                    break;
                case 'amount-number':
                    value = data['金額'] || data['amount'] || data['Amount'] || '';
                    break;
                case 'amount-text':
                    const amount = parseFloat(data['金額'] || data['amount'] || data['Amount'] || 0);
                    value = window.i18n ? window.i18n.numberToChinese(amount) : amount.toString();
                    break;
                case 'date':
                    value = data['日期'] || data['date'] || data['Date'] || new Date().toLocaleDateString();
                    break;
                case 'memo':
                    value = data['備註'] || data['memo'] || data['Memo'] || '';
                    break;
                case 'signature':
                    value = data['簽名'] || data['signature'] || data['Signature'] || '';
                    break;
            }
            
            if (value) {
                field.set('text', value.toString());
            }
        });
        
        this.editor.canvas.renderAll();
    }

    setupExportTools() {
        if (!this.options.allowExport) return;

        const exportPdfBtn = this.$('#cepExportPdfBtn');
        const exportImageBtn = this.$('#cepExportImageBtn');

        if (exportPdfBtn) {
            exportPdfBtn.addEventListener('click', () => {
                this.exportToPDF();
            });
        }

        if (exportImageBtn) {
            exportImageBtn.addEventListener('click', () => {
                this.exportToImage();
            });
        }
    }

    exportToPDF() {
        if (typeof window.jspdf === 'undefined') {
            this.showMessage('PDF 生成庫未載入', 'error');
            return;
        }

        try {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('landscape', 'mm', 'a4');
            
            const imageData = this.editor.exportAsImage('png');
            const imgWidth = 250; // A4 landscape width in mm
            const imgHeight = (this.editor.canvas.height / this.editor.canvas.width) * imgWidth;
            
            pdf.addImage(imageData, 'PNG', 20, 20, imgWidth, imgHeight);
            pdf.save(`check_${new Date().toISOString().split('T')[0]}.pdf`);
            
            this.showMessage('PDF 導出成功', 'success');
        } catch (error) {
            console.error('PDF export error:', error);
            this.showMessage('PDF 導出失敗', 'error');
        }
    }

    exportToImage() {
        try {
            const imageData = this.editor.exportAsImage('png');
            const link = document.createElement('a');
            link.download = `check_${new Date().toISOString().split('T')[0]}.png`;
            link.href = imageData;
            link.click();
            
            this.showMessage('圖片導出成功', 'success');
        } catch (error) {
            console.error('Image export error:', error);
            this.showMessage('圖片導出失敗', 'error');
        }
    }

    setupCloudStorage() {
        if (!this.wpSettings.isLoggedIn) return;

        const saveTemplateBtn = this.$('#cepSaveTemplateBtn');
        const loadTemplateBtn = this.$('#cepLoadTemplateBtn');
        const shareBtn = this.$('#cepShareBtn');

        if (saveTemplateBtn) {
            saveTemplateBtn.addEventListener('click', () => {
                this.saveToWordPressDatabase();
            });
        }

        if (loadTemplateBtn) {
            loadTemplateBtn.addEventListener('click', () => {
                this.showUserTemplatesModal();
            });
        }

        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                this.shareTemplate();
            });
        }
    }

    saveToWordPressDatabase() {
        const name = prompt('請輸入範本名稱:', `支票範本_${new Date().toLocaleDateString()}`);
        if (!name) return;

        const data = this.editor.exportCanvasData();
        
        const formData = new FormData();
        formData.append('action', 'cep_save_template');
        formData.append('nonce', this.wpSettings.nonce);
        formData.append('name', name);
        formData.append('data', JSON.stringify(data));
        formData.append('is_public', false); // Default to private

        this.showLoading(true);

        fetch(this.wpSettings.ajaxUrl, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(result => {
            this.showLoading(false);
            if (result.success) {
                this.showMessage(result.data.message, 'success');
                this.loadUserTemplates(); // Refresh user templates
            } else {
                this.showMessage(result.data || '儲存失敗', 'error');
            }
        })
        .catch(() => {
            this.showLoading(false);
            this.showMessage('儲存失敗', 'error');
        });
    }

    loadUserTemplates() {
        const userTemplatesContainer = this.$('#cepUserTemplates');
        if (!userTemplatesContainer) return;

        // This would typically load from WordPress database
        // For now, we'll show a placeholder
        userTemplatesContainer.innerHTML = '<p style="font-size: 0.8rem; color: #666;">載入用戶範本...</p>';
    }

    shareTemplate() {
        // Similar to save but mark as public
        const name = prompt('請輸入要分享的範本名稱:', `分享範本_${new Date().toLocaleDateString()}`);
        if (!name) return;

        const data = this.editor.exportCanvasData();
        
        const formData = new FormData();
        formData.append('action', 'cep_save_template');
        formData.append('nonce', this.wpSettings.nonce);
        formData.append('name', name);
        formData.append('data', JSON.stringify(data));
        formData.append('is_public', true);

        this.showLoading(true);

        fetch(this.wpSettings.ajaxUrl, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(result => {
            this.showLoading(false);
            if (result.success) {
                const shareUrl = `${window.location.origin}${window.location.pathname}?cep_template=${result.data.id}`;
                this.showShareModal(shareUrl);
            } else {
                this.showMessage(result.data || '分享失敗', 'error');
            }
        })
        .catch(() => {
            this.showLoading(false);
            this.showMessage('分享失敗', 'error');
        });
    }

    setupHelpModal() {
        const helpBtn = this.$('#cepHelpBtn');
        const modal = this.$('#cepModal');
        const closeBtn = modal?.querySelector('.cep-close');

        if (helpBtn) {
            helpBtn.addEventListener('click', () => {
                this.showHelpModal();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                if (modal) modal.style.display = 'none';
            });
        }

        // Close modal when clicking outside
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
    }

    showHelpModal() {
        const modal = this.$('#cepModal');
        const modalBody = this.$('#cepModalBody');
        
        if (modal && modalBody) {
            modalBody.innerHTML = `
                <h2>使用說明</h2>
                <div class="cep-help-content">
                    <p><strong>1. 上傳支票圖像或選擇預設範本</strong></p>
                    <p><strong>2. 點擊欄位工具添加文字欄位</strong></p>
                    <p><strong>3. 拖拽欄位到合適位置</strong></p>
                    <p><strong>4. 在右側面板調整字體和顏色</strong></p>
                    <p><strong>5. 點擊導出按鈕下載 PDF 或圖片</strong></p>
                    <p><strong>6. 匯入 Excel 檔案進行批量處理</strong></p>
                </div>
            `;
            modal.style.display = 'block';
        }
    }

    showShareModal(url) {
        const modal = this.$('#cepModal');
        const modalBody = this.$('#cepModalBody');
        
        if (modal && modalBody) {
            modalBody.innerHTML = `
                <h2>分享範本</h2>
                <div class="cep-share-content">
                    <p>分享連結:</p>
                    <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                        <input type="text" value="${url}" readonly class="cep-form-control" style="flex: 1;">
                        <button class="cep-btn cep-btn-primary" onclick="navigator.clipboard.writeText('${url}'); alert('連結已複製!')">
                            複製連結
                        </button>
                    </div>
                </div>
            `;
            modal.style.display = 'block';
        }
    }

    showLoading(show) {
        const overlay = this.$('#cepLoadingOverlay');
        if (overlay) {
            overlay.style.display = show ? 'flex' : 'none';
        }
    }

    showWordPressMessage(message, type = 'info') {
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `cep-message ${type}`;
        messageEl.textContent = message;
        
        // Add to container
        this.container.appendChild(messageEl);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            messageEl.style.opacity = '0';
            messageEl.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 3000);
    }

    setupCanvasSizeControls() {
        const sizePreset = this.$('#cepCanvasSizePreset');
        const widthInput = this.$('#cepCanvasWidth');
        const heightInput = this.$('#cepCanvasHeight');
        const unitSelect = this.$('#cepCanvasUnit');
        const applyBtn = this.$('#cepApplySizeBtn');

        // Canvas size presets
        const presets = {
            'hk_check': { width: 215, height: 85, unit: 'mm' },
            'us_check': { width: 203, height: 89, unit: 'mm' },
            'cn_check': { width: 190, height: 80, unit: 'mm' },
            'a4_landscape': { width: 297, height: 210, unit: 'mm' },
            'a5_landscape': { width: 210, height: 148, unit: 'mm' }
        };

        if (sizePreset) {
            sizePreset.addEventListener('change', (e) => {
                const preset = presets[e.target.value];
                if (preset) {
                    widthInput.value = preset.width;
                    heightInput.value = preset.height;
                    unitSelect.value = preset.unit;
                }
            });
        }

        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                this.applyCanvasSize();
            });
        }

        // Auto-apply on Enter key
        [widthInput, heightInput].forEach(input => {
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.applyCanvasSize();
                    }
                });
            }
        });
    }

    applyCanvasSize() {
        const widthInput = this.$('#cepCanvasWidth');
        const heightInput = this.$('#cepCanvasHeight');
        const unitSelect = this.$('#cepCanvasUnit');

        const width = parseFloat(widthInput.value);
        const height = parseFloat(heightInput.value);
        const unit = unitSelect.value;

        if (!width || !height || width <= 0 || height <= 0) {
            this.showMessage('請輸入有效的寬度和高度', 'error');
            return;
        }

        // Convert to pixels (96 DPI)
        const pixelWidth = this.convertToPixels(width, unit);
        const pixelHeight = this.convertToPixels(height, unit);

        // Update canvas size
        this.editor.setCanvasSize(pixelWidth, pixelHeight);
        this.updateCanvasInfo(width, height, unit);
        this.updateRulers();
        this.updateGrid();
        
        this.showMessage(`畫布尺寸已設定為 ${width} × ${height} ${unit}`, 'success');
    }

    convertToPixels(value, unit) {
        const dpi = 96; // Standard web DPI
        switch (unit) {
            case 'mm':
                return value * dpi / 25.4;
            case 'cm':
                return value * dpi / 2.54;
            case 'in':
                return value * dpi;
            case 'px':
            default:
                return value;
        }
    }

    convertFromPixels(pixels, unit) {
        const dpi = 96;
        switch (unit) {
            case 'mm':
                return pixels * 25.4 / dpi;
            case 'cm':
                return pixels * 2.54 / dpi;
            case 'in':
                return pixels / dpi;
            case 'px':
            default:
                return pixels;
        }
    }

    updateCanvasInfo(width, height, unit) {
        const canvasSize = this.$('#cepCanvasSize');
        if (canvasSize) {
            canvasSize.textContent = `尺寸: ${width} × ${height} ${unit}`;
        }
    }

    setupRulerAndGrid() {
        const toggleRulerBtn = this.$('#cepToggleRulerBtn');
        const toggleGridBtn = this.$('#cepToggleGridBtn');
        const snapToGridBtn = this.$('#cepSnapToGridBtn');

        this.rulerVisible = true;
        this.gridVisible = false;
        this.snapToGrid = false;

        if (toggleRulerBtn) {
            toggleRulerBtn.addEventListener('click', () => {
                this.toggleRuler();
            });
        }

        if (toggleGridBtn) {
            toggleGridBtn.addEventListener('click', () => {
                this.toggleGrid();
            });
        }

        if (snapToGridBtn) {
            snapToGridBtn.addEventListener('click', () => {
                this.toggleSnapToGrid();
            });
        }

        // Initialize rulers
        this.updateRulers();
        this.setupMouseTracking();
    }

    toggleRuler() {
        this.rulerVisible = !this.rulerVisible;
        const horizontalRuler = this.$('#cepHorizontalRuler');
        const verticalRuler = this.$('#cepVerticalRuler');
        const toggleBtn = this.$('#cepToggleRulerBtn');

        if (horizontalRuler) horizontalRuler.style.display = this.rulerVisible ? 'block' : 'none';
        if (verticalRuler) verticalRuler.style.display = this.rulerVisible ? 'block' : 'none';
        if (toggleBtn) toggleBtn.classList.toggle('active', this.rulerVisible);
    }

    toggleGrid() {
        this.gridVisible = !this.gridVisible;
        const gridOverlay = this.$('#cepGridOverlay');
        const toggleBtn = this.$('#cepToggleGridBtn');

        if (gridOverlay) {
            gridOverlay.classList.toggle('visible', this.gridVisible);
        }
        if (toggleBtn) toggleBtn.classList.toggle('active', this.gridVisible);
        
        this.updateGrid();
    }

    toggleSnapToGrid() {
        this.snapToGrid = !this.snapToGrid;
        const snapBtn = this.$('#cepSnapToGridBtn');
        
        if (snapBtn) snapBtn.classList.toggle('active', this.snapToGrid);
        
        // Enable/disable snap to grid in editor
        if (this.editor && this.editor.canvas) {
            this.editor.canvas.snapToGrid = this.snapToGrid;
        }
    }

    updateRulers() {
        if (!this.rulerVisible) return;

        const horizontalRuler = this.$('#cepHorizontalRuler');
        const verticalRuler = this.$('#cepVerticalRuler');
        const unitSelect = this.$('#cepCanvasUnit');
        const unit = unitSelect ? unitSelect.value : 'mm';

        if (horizontalRuler && this.editor && this.editor.canvas) {
            this.drawRuler(horizontalRuler, 'horizontal', unit);
        }

        if (verticalRuler && this.editor && this.editor.canvas) {
            this.drawRuler(verticalRuler, 'vertical', unit);
        }
    }

    drawRuler(rulerElement, orientation, unit) {
        rulerElement.innerHTML = '';
        
        const canvasSize = orientation === 'horizontal' ? 
            this.editor.canvas.width : this.editor.canvas.height;
        
        rulerElement.style.width = orientation === 'horizontal' ? canvasSize + 'px' : '20px';
        rulerElement.style.height = orientation === 'vertical' ? canvasSize + 'px' : '20px';

        const realSize = this.convertFromPixels(canvasSize, unit);
        const step = this.getRulerStep(realSize, unit);
        const pixelStep = this.convertToPixels(step, unit);

        for (let i = 0; i <= realSize; i += step) {
            const position = this.convertToPixels(i, unit);
            if (position > canvasSize) break;

            const isMajor = i % (step * 5) === 0;
            const mark = document.createElement('div');
            mark.className = `cep-ruler-mark ${isMajor ? 'major' : 'minor'}`;
            
            if (orientation === 'horizontal') {
                mark.style.left = position + 'px';
            } else {
                mark.style.top = position + 'px';
            }

            rulerElement.appendChild(mark);

            // Add labels for major marks
            if (isMajor && i > 0) {
                const label = document.createElement('div');
                label.className = 'cep-ruler-label';
                label.textContent = Math.round(i);
                
                if (orientation === 'horizontal') {
                    label.style.left = position + 'px';
                } else {
                    label.style.top = position + 'px';
                }
                
                rulerElement.appendChild(label);
            }
        }
    }

    getRulerStep(size, unit) {
        // Determine appropriate step size based on total size
        if (unit === 'mm') {
            if (size <= 50) return 1;
            if (size <= 200) return 5;
            if (size <= 500) return 10;
            return 20;
        } else if (unit === 'cm') {
            if (size <= 10) return 0.2;
            if (size <= 50) return 1;
            return 2;
        } else if (unit === 'in') {
            if (size <= 2) return 0.1;
            if (size <= 12) return 0.25;
            return 0.5;
        } else { // px
            if (size <= 200) return 10;
            if (size <= 1000) return 50;
            return 100;
        }
    }

    updateGrid() {
        const gridOverlay = this.$('#cepGridOverlay');
        if (!gridOverlay || !this.gridVisible) return;

        const unitSelect = this.$('#cepCanvasUnit');
        const unit = unitSelect ? unitSelect.value : 'mm';
        const gridSize = this.convertToPixels(unit === 'mm' ? 5 : unit === 'cm' ? 0.5 : unit === 'in' ? 0.1 : 20, unit);

        gridOverlay.style.backgroundSize = `${gridSize}px ${gridSize}px`;
    }

    setupMouseTracking() {
        const canvas = this.$('#cepCheckCanvas');
        const mousePosition = this.$('#cepMousePosition');
        
        if (canvas && mousePosition) {
            canvas.addEventListener('mousemove', (e) => {
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const unitSelect = this.$('#cepCanvasUnit');
                const unit = unitSelect ? unitSelect.value : 'mm';
                
                const realX = this.convertFromPixels(x, unit);
                const realY = this.convertFromPixels(y, unit);
                
                mousePosition.textContent = `${realX.toFixed(1)}, ${realY.toFixed(1)} ${unit}`;
            });

            canvas.addEventListener('mouseleave', () => {
                mousePosition.textContent = '';
            });
        }
    }
}

// Make available globally
window.CheckEditorProWordPress = CheckEditorProWordPress;