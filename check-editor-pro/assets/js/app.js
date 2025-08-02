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
}

// Make available globally
window.CheckEditorProWordPress = CheckEditorProWordPress;