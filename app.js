// app.js - Main application controller
class CheckEditorApp {
    constructor() {
        this.editor = null;
        this.batchData = [];
        this.currentTemplate = null;
        this.cloudStorage = new CloudStorage();
        
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeApp();
            });
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        // Initialize editor
        this.editor = new CheckEditor('checkCanvas');
        
        // Set up event listeners
        this.setupFileUpload();
        this.setupTemplateSelection();
        this.setupFieldTools();
        this.setupBatchProcessing();
        this.setupExportTools();
        this.setupCloudStorage();
        this.setupHelpModal();
        
        // Load default template
        this.loadTemplate('hk');
        
        console.log('Check Editor App initialized');
    }

    setupFileUpload() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const uploadBtn = document.getElementById('uploadBtn');

        // File input change
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file && file.type.startsWith('image/')) {
                    this.handleImageUpload(file);
                } else {
                    this.showMessage(window.i18n.get('messages.invalid_file'), 'error');
                }
            });
        }

        // Upload button click
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                fileInput?.click();
            });
        }

        // Drag and drop
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
                
                const files = e.dataTransfer.files;
                if (files.length > 0 && files[0].type.startsWith('image/')) {
                    this.handleImageUpload(files[0]);
                } else {
                    this.showMessage(window.i18n.get('messages.invalid_file'), 'error');
                }
            });

            // Click to upload
            uploadArea.addEventListener('click', () => {
                fileInput?.click();
            });
        }
    }

    handleImageUpload(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.editor.loadBackgroundImage(e.target.result)
                .then(() => {
                    this.showMessage(window.i18n.get('messages.upload_success'), 'success');
                    // Adjust canvas size to image
                    this.editor.fitToScreen();
                })
                .catch(() => {
                    this.showMessage(window.i18n.get('messages.upload_error'), 'error');
                });
        };
        reader.readAsDataURL(file);
    }

    setupTemplateSelection() {
        const templateBtns = document.querySelectorAll('.template-btn');
        
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
        const fieldBtns = document.querySelectorAll('.field-btn');
        
        fieldBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const fieldType = btn.getAttribute('data-field');
                this.addFieldToCanvas(fieldType);
            });
        });
    }

    addFieldToCanvas(fieldType) {
        const fieldConfig = window.checkTemplates.createFieldConfig(fieldType, 100, 100);
        if (fieldConfig) {
            this.editor.addField(fieldConfig);
        }
    }

    setupBatchProcessing() {
        const importExcelBtn = document.getElementById('importExcelBtn');
        const excelInput = document.getElementById('excelInput');
        const batchGenerateBtn = document.getElementById('batchGenerateBtn');

        if (importExcelBtn) {
            importExcelBtn.addEventListener('click', () => {
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
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet);
                
                this.batchData = jsonData;
                const batchGenerateBtn = document.getElementById('batchGenerateBtn');
                if (batchGenerateBtn) {
                    batchGenerateBtn.disabled = false;
                }
                
                this.showMessage(
                    window.i18n.get('messages.excel_import_success') + ` (${jsonData.length} 筆記錄)`,
                    'success'
                );
            } catch (error) {
                console.error('Excel import error:', error);
                this.showMessage(window.i18n.get('messages.excel_import_error'), 'error');
            }
        };
        reader.readAsArrayBuffer(file);
    }

    generateBatchChecks() {
        if (this.batchData.length === 0) {
            this.showMessage('請先匯入 Excel 檔案', 'error');
            return;
        }

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
        this.showMessage(window.i18n.get('messages.batch_generate_success'), 'success');
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
        const exportPdfBtn = document.getElementById('exportPdfBtn');
        const exportImageBtn = document.getElementById('exportImageBtn');

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
        try {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('landscape', 'mm', 'a4');
            
            const imageData = this.editor.exportAsImage('png');
            const imgWidth = 250; // A4 landscape width in mm
            const imgHeight = (this.editor.canvas.height / this.editor.canvas.width) * imgWidth;
            
            pdf.addImage(imageData, 'PNG', 20, 20, imgWidth, imgHeight);
            pdf.save(`check_${new Date().toISOString().split('T')[0]}.pdf`);
            
            this.showMessage(window.i18n.get('messages.export_success'), 'success');
        } catch (error) {
            console.error('PDF export error:', error);
            this.showMessage(window.i18n.get('messages.export_error'), 'error');
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
        const saveCloudBtn = document.getElementById('saveCloudBtn');
        const loadCloudBtn = document.getElementById('loadCloudBtn');
        const shareBtn = document.getElementById('shareBtn');

        if (saveCloudBtn) {
            saveCloudBtn.addEventListener('click', () => {
                this.saveToCloud();
            });
        }

        if (loadCloudBtn) {
            loadCloudBtn.addEventListener('click', () => {
                this.loadFromCloud();
            });
        }

        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                this.shareCheck();
            });
        }
    }

    saveToCloud() {
        const data = this.editor.exportCanvasData();
        const id = this.cloudStorage.save(data);
        
        if (id) {
            this.showMessage(window.i18n.get('messages.save_success'), 'success');
        } else {
            this.showMessage(window.i18n.get('messages.save_error'), 'error');
        }
    }

    loadFromCloud() {
        // Show cloud files modal
        this.showCloudFilesModal();
    }

    shareCheck() {
        const data = this.editor.exportCanvasData();
        const id = this.cloudStorage.save(data);
        
        if (id) {
            const shareUrl = `${window.location.origin}${window.location.pathname}?shared=${id}`;
            this.showShareModal(shareUrl);
        } else {
            this.showMessage('分享失敗', 'error');
        }
    }

    setupHelpModal() {
        const helpBtn = document.getElementById('helpBtn');
        const modal = document.getElementById('modal');
        const closeBtn = modal?.querySelector('.close');

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
        const modal = document.getElementById('modal');
        const modalBody = document.getElementById('modalBody');
        
        if (modal && modalBody) {
            modalBody.innerHTML = `
                <h2>${window.i18n.get('help.title')}</h2>
                <div class="help-content">
                    <p>${window.i18n.get('help.upload')}</p>
                    <p>${window.i18n.get('help.fields')}</p>
                    <p>${window.i18n.get('help.drag')}</p>
                    <p>${window.i18n.get('help.customize')}</p>
                    <p>${window.i18n.get('help.export')}</p>
                    <p>${window.i18n.get('help.batch')}</p>
                </div>
            `;
            modal.style.display = 'block';
        }
    }

    showShareModal(url) {
        const modal = document.getElementById('modal');
        const modalBody = document.getElementById('modalBody');
        
        if (modal && modalBody) {
            modalBody.innerHTML = `
                <h2>${window.i18n.get('dialogs.share_title')}</h2>
                <div class="share-content">
                    <p>${window.i18n.get('dialogs.share_link')}:</p>
                    <div class="share-url-container">
                        <input type="text" value="${url}" readonly class="form-control">
                        <button class="btn btn-primary" onclick="navigator.clipboard.writeText('${url}')">
                            ${window.i18n.get('dialogs.copy_link')}
                        </button>
                    </div>
                </div>
            `;
            modal.style.display = 'block';
        }
    }

    showCloudFilesModal() {
        const files = this.cloudStorage.list();
        const modal = document.getElementById('modal');
        const modalBody = document.getElementById('modalBody');
        
        if (modal && modalBody) {
            let filesHtml = '<h2>雲端檔案</h2><div class="cloud-files">';
            
            if (files.length === 0) {
                filesHtml += '<p>沒有找到雲端檔案</p>';
            } else {
                files.forEach(file => {
                    filesHtml += `
                        <div class="cloud-file-item">
                            <span>${file.name}</span>
                            <span>${new Date(file.created).toLocaleDateString()}</span>
                            <button class="btn btn-sm btn-primary" onclick="app.loadCloudFile('${file.id}')">載入</button>
                        </div>
                    `;
                });
            }
            
            filesHtml += '</div>';
            modalBody.innerHTML = filesHtml;
            modal.style.display = 'block';
        }
    }

    loadCloudFile(id) {
        const data = this.cloudStorage.load(id);
        if (data) {
            this.editor.importCanvasData(data);
            document.getElementById('modal').style.display = 'none';
            this.showMessage('雲端檔案載入成功', 'success');
        } else {
            this.showMessage('載入失敗', 'error');
        }
    }

    showMessage(message, type = 'info') {
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.textContent = message;
        
        // Style the message
        Object.assign(messageEl.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '4px',
            color: 'white',
            fontWeight: '500',
            zIndex: '10000',
            transition: 'all 0.3s ease'
        });
        
        // Set background color based on type
        const colors = {
            success: '#48bb78',
            error: '#f56565',
            info: '#4299e1',
            warning: '#ed8936'
        };
        messageEl.style.backgroundColor = colors[type] || colors.info;
        
        // Add to DOM
        document.body.appendChild(messageEl);
        
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

    // Check for shared content on load
    checkForSharedContent() {
        const urlParams = new URLSearchParams(window.location.search);
        const sharedId = urlParams.get('shared');
        
        if (sharedId) {
            const data = this.cloudStorage.load(sharedId);
            if (data) {
                this.editor.importCanvasData(data);
                this.showMessage('已載入分享的支票範本', 'success');
            } else {
                this.showMessage('無法載入分享的內容', 'error');
            }
        }
    }
}

// Simple cloud storage simulation using localStorage
class CloudStorage {
    constructor() {
        this.storageKey = 'checkEditor_cloudFiles';
    }

    save(data) {
        try {
            const files = this.getFiles();
            const id = 'file_' + Date.now();
            const file = {
                id: id,
                name: `支票範本_${new Date().toLocaleDateString()}`,
                data: data,
                created: new Date().toISOString()
            };
            
            files[id] = file;
            localStorage.setItem(this.storageKey, JSON.stringify(files));
            
            return id;
        } catch (error) {
            console.error('Cloud save error:', error);
            return null;
        }
    }

    load(id) {
        try {
            const files = this.getFiles();
            return files[id] ? files[id].data : null;
        } catch (error) {
            console.error('Cloud load error:', error);
            return null;
        }
    }

    list() {
        try {
            const files = this.getFiles();
            return Object.values(files).sort((a, b) => 
                new Date(b.created) - new Date(a.created)
            );
        } catch (error) {
            console.error('Cloud list error:', error);
            return [];
        }
    }

    delete(id) {
        try {
            const files = this.getFiles();
            delete files[id];
            localStorage.setItem(this.storageKey, JSON.stringify(files));
            return true;
        } catch (error) {
            console.error('Cloud delete error:', error);
            return false;
        }
    }

    getFiles() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error('Cloud storage error:', error);
            return {};
        }
    }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new CheckEditorApp();
    
    // Check for shared content after a brief delay
    setTimeout(() => {
        app.checkForSharedContent();
    }, 500);
});

// Export for global access
window.CheckEditorApp = CheckEditorApp;