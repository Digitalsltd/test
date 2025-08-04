// checkEditor.js - Main check editor using Fabric.js
class CheckEditor {
    constructor(canvasId) {
        this.canvasId = canvasId;
        this.canvas = new fabric.Canvas(canvasId);
        this.fields = new Map();
        this.selectedField = null;
        this.backgroundImage = null;
        this.zoom = 1;
        this.panMode = false;
        this.lastPanPoint = null;
        this.backgroundElements = [];
        
        this.init();
    }

    init() {
        // Set canvas properties
        this.canvas.setWidth(850);
        this.canvas.setHeight(350);
        this.canvas.backgroundColor = '#ffffff';
        
        // Enable selection and interaction
        this.canvas.selection = true;
        this.canvas.preserveObjectStacking = true;
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize zoom controls
        this.setupZoomControls();
        
        // Set up properties panel
        this.setupPropertiesPanel();
    }

    setupEventListeners() {
        // Object selection
        this.canvas.on('selection:created', (e) => {
            this.onObjectSelected(e.selected[0]);
        });
        
        this.canvas.on('selection:updated', (e) => {
            this.onObjectSelected(e.selected[0]);
        });
        
        this.canvas.on('selection:cleared', () => {
            this.onObjectDeselected();
        });
        
        // Object modification
        this.canvas.on('object:modified', (e) => {
            this.onObjectModified(e.target);
        });
        
        // Mouse wheel for zoom
        this.canvas.on('mouse:wheel', (opt) => {
            this.handleMouseWheel(opt);
        });
        
        // Panning
        this.canvas.on('mouse:down', (opt) => {
            this.handleMouseDown(opt);
        });
        
        this.canvas.on('mouse:move', (opt) => {
            this.handleMouseMove(opt);
        });
        
        this.canvas.on('mouse:up', () => {
            this.handleMouseUp();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyDown(e);
        });
    }

    setupZoomControls() {
        const zoomInBtn = document.getElementById('zoomInBtn');
        const zoomOutBtn = document.getElementById('zoomOutBtn');
        const fitToScreenBtn = document.getElementById('fitToScreenBtn');
        const zoomLevel = document.getElementById('zoomLevel');

        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => {
                this.zoomIn();
            });
        }

        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => {
                this.zoomOut();
            });
        }

        if (fitToScreenBtn) {
            fitToScreenBtn.addEventListener('click', () => {
                this.fitToScreen();
            });
        }

        this.updateZoomDisplay();
    }

    setupPropertiesPanel() {
        const fieldText = document.getElementById('fieldText');
        const fontSize = document.getElementById('fontSize');
        const fontSizeValue = document.getElementById('fontSizeValue');
        const fontColor = document.getElementById('fontColor');
        const fontFamily = document.getElementById('fontFamily');
        const positionX = document.getElementById('positionX');
        const positionY = document.getElementById('positionY');

        if (fieldText) {
            fieldText.addEventListener('input', (e) => {
                this.updateSelectedFieldProperty('text', e.target.value);
            });
        }

        if (fontSize) {
            fontSize.addEventListener('input', (e) => {
                const size = parseInt(e.target.value);
                this.updateSelectedFieldProperty('fontSize', size);
                if (fontSizeValue) {
                    fontSizeValue.textContent = size + 'px';
                }
            });
        }

        if (fontColor) {
            fontColor.addEventListener('change', (e) => {
                this.updateSelectedFieldProperty('fill', e.target.value);
            });
        }

        if (fontFamily) {
            fontFamily.addEventListener('change', (e) => {
                this.updateSelectedFieldProperty('fontFamily', e.target.value);
            });
        }

        if (positionX) {
            positionX.addEventListener('change', (e) => {
                this.updateSelectedFieldProperty('left', parseInt(e.target.value));
            });
        }

        if (positionY) {
            positionY.addEventListener('change', (e) => {
                this.updateSelectedFieldProperty('top', parseInt(e.target.value));
            });
        }
    }

    // Field Management
    addField(fieldConfig) {
        const field = this.createFieldObject(fieldConfig);
        if (field) {
            this.canvas.add(field);
            this.fields.set(field.id, field);
            this.canvas.setActiveObject(field);
            this.canvas.renderAll();
            return field;
        }
        return null;
    }

    createFieldObject(config) {
        const text = new fabric.Textbox(config.placeholder || '', {
            left: config.x || 100,
            top: config.y || 100,
            width: config.width || 200,
            height: config.height || 30,
            fontSize: config.fontSize || 14,
            fontFamily: config.fontFamily || 'Arial',
            fill: config.color || '#000000',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderColor: 'rgba(102, 126, 234, 0.8)',
            cornerColor: 'rgba(102, 126, 234, 0.8)',
            cornerStyle: 'circle',
            transparentCorners: false,
            textAlign: config.textAlign || 'left',
            splitByGrapheme: true,
            editable: true
        });

        // Add custom properties
        text.id = config.id || `field_${Date.now()}`;
        text.fieldType = config.type;
        text.isRequired = config.required || false;
        text.originalPlaceholder = config.placeholder || '';

        // Add type-specific behavior
        this.addFieldBehavior(text, config.type);

        return text;
    }

    addFieldBehavior(field, type) {
        switch (type) {
            case 'amount-number':
                field.on('changed', () => {
                    this.formatAmountNumber(field);
                });
                break;
            case 'amount-text':
                field.on('changed', () => {
                    this.updateAmountText(field);
                });
                break;
            case 'date':
                field.on('changed', () => {
                    this.formatDate(field);
                });
                break;
        }
    }

    formatAmountNumber(field) {
        const text = field.text;
        const number = parseFloat(text.replace(/[^\d.-]/g, ''));
        
        if (!isNaN(number)) {
            const formatted = window.i18n ? 
                window.i18n.formatNumber(number) : 
                number.toLocaleString();
            
            if (field.text !== formatted) {
                field.set('text', formatted);
                this.canvas.renderAll();
                
                // Update corresponding amount-text field
                this.updateCorrespondingAmountText(number);
            }
        }
    }

    updateAmountText(field) {
        // Auto-convert number to text if user enters a number
        const text = field.text;
        const number = parseFloat(text.replace(/[^\d.-]/g, ''));
        
        if (!isNaN(number) && number > 0) {
            const textAmount = window.i18n ? 
                window.i18n.numberToChinese(number) : 
                this.numberToWords(number);
            
            field.set('text', textAmount);
            this.canvas.renderAll();
        }
    }

    updateCorrespondingAmountText(number) {
        // Find amount-text field and update it
        this.fields.forEach(field => {
            if (field.fieldType === 'amount-text') {
                const textAmount = window.i18n ? 
                    window.i18n.numberToChinese(number) : 
                    this.numberToWords(number);
                
                field.set('text', textAmount);
                this.canvas.renderAll();
            }
        });
    }

    formatDate(field) {
        const text = field.text;
        // Try to parse and format date
        const date = new Date(text);
        
        if (!isNaN(date.getTime())) {
            const formatted = window.i18n ? 
                window.i18n.formatDate(date) : 
                date.toLocaleDateString();
            
            if (field.text !== formatted) {
                field.set('text', formatted);
                this.canvas.renderAll();
            }
        }
    }

    numberToWords(num) {
        // Simple English number to words conversion
        const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
        const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
        const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
        
        if (num === 0) return 'zero dollars';
        
        let result = '';
        const dollars = Math.floor(num);
        const cents = Math.round((num - dollars) * 100);
        
        if (dollars > 0) {
            result += this.convertNumberToWords(dollars, ones, tens, teens) + ' dollar';
            if (dollars !== 1) result += 's';
        }
        
        if (cents > 0) {
            if (result) result += ' and ';
            result += this.convertNumberToWords(cents, ones, tens, teens) + ' cent';
            if (cents !== 1) result += 's';
        }
        
        return result.charAt(0).toUpperCase() + result.slice(1);
    }

    convertNumberToWords(num, ones, tens, teens) {
        if (num < 10) return ones[num];
        if (num < 20) return teens[num - 10];
        if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
        if (num < 1000) return ones[Math.floor(num / 100)] + ' hundred' + (num % 100 ? ' ' + this.convertNumberToWords(num % 100, ones, tens, teens) : '');
        
        return num.toString(); // Fallback for larger numbers
    }

    removeField(fieldId) {
        const field = this.fields.get(fieldId);
        if (field) {
            this.canvas.remove(field);
            this.fields.delete(fieldId);
            this.canvas.renderAll();
        }
    }

    clearAllFields() {
        this.fields.forEach(field => {
            this.canvas.remove(field);
        });
        this.fields.clear();
        this.canvas.renderAll();
    }

    getAllFields() {
        return Array.from(this.fields.values()).map(field => ({
            id: field.id,
            type: field.fieldType,
            text: field.text,
            x: field.left,
            y: field.top,
            width: field.width,
            height: field.height,
            fontSize: field.fontSize,
            fontFamily: field.fontFamily,
            color: field.fill,
            required: field.isRequired,
            textAlign: field.textAlign
        }));
    }

    // Image handling
    loadBackgroundImage(imageUrl) {
        return new Promise((resolve, reject) => {
            fabric.Image.fromURL(imageUrl, (img) => {
                if (this.backgroundImage) {
                    this.canvas.remove(this.backgroundImage);
                }
                
                // Scale image to fit canvas
                const scaleX = this.canvas.width / img.width;
                const scaleY = this.canvas.height / img.height;
                const scale = Math.min(scaleX, scaleY);
                
                img.scale(scale);
                img.set({
                    left: (this.canvas.width - img.width * scale) / 2,
                    top: (this.canvas.height - img.height * scale) / 2,
                    selectable: false,
                    evented: false
                });
                
                this.backgroundImage = img;
                this.canvas.add(img);
                this.canvas.sendToBack(img);
                this.canvas.renderAll();
                
                resolve(img);
            }, { crossOrigin: 'anonymous' });
        });
    }

    // Canvas controls
    setCanvasSize(width, height) {
        this.canvas.setWidth(width);
        this.canvas.setHeight(height);
        this.canvas.renderAll();
        this.updateCanvasInfo();
    }

    getCanvasSize() {
        return {
            width: this.canvas.width,
            height: this.canvas.height
        };
    }

    setBackgroundColor(color) {
        this.canvas.backgroundColor = color;
        this.canvas.renderAll();
    }

    getBackgroundColor() {
        return this.canvas.backgroundColor;
    }

    updateCanvasInfo() {
        const canvasSize = document.getElementById('canvasSize');
        if (canvasSize) {
            canvasSize.textContent = `尺寸: ${this.canvas.width} x ${this.canvas.height}`;
        }
    }

    // Zoom and pan
    zoomIn() {
        this.setZoom(this.zoom * 1.2);
    }

    zoomOut() {
        this.setZoom(this.zoom / 1.2);
    }

    setZoom(zoom) {
        this.zoom = Math.max(0.1, Math.min(5, zoom));
        this.canvas.setZoom(this.zoom);
        this.canvas.renderAll();
        this.updateZoomDisplay();
    }

    fitToScreen() {
        const container = document.getElementById('canvasContainer');
        if (container) {
            const containerWidth = container.clientWidth - 40; // padding
            const containerHeight = container.clientHeight - 40;
            const scaleX = containerWidth / this.canvas.width;
            const scaleY = containerHeight / this.canvas.height;
            const scale = Math.min(scaleX, scaleY, 1);
            
            this.setZoom(scale);
        }
    }

    updateZoomDisplay() {
        const zoomLevel = document.getElementById('zoomLevel');
        if (zoomLevel) {
            zoomLevel.textContent = Math.round(this.zoom * 100) + '%';
        }
    }

    handleMouseWheel(opt) {
        const delta = opt.e.deltaY;
        let zoom = this.canvas.getZoom();
        zoom *= 0.999 ** delta;
        
        if (zoom > 5) zoom = 5;
        if (zoom < 0.1) zoom = 0.1;
        
        this.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
        this.zoom = zoom;
        this.updateZoomDisplay();
        
        opt.e.preventDefault();
        opt.e.stopPropagation();
    }

    handleMouseDown(opt) {
        if (opt.e.shiftKey || this.panMode) {
            this.canvas.isDragging = true;
            this.canvas.selection = false;
            this.lastPanPoint = { x: opt.e.clientX, y: opt.e.clientY };
        }
    }

    handleMouseMove(opt) {
        if (this.canvas.isDragging) {
            const vpt = this.canvas.viewportTransform;
            vpt[4] += opt.e.clientX - this.lastPanPoint.x;
            vpt[5] += opt.e.clientY - this.lastPanPoint.y;
            this.canvas.requestRenderAll();
            this.lastPanPoint = { x: opt.e.clientX, y: opt.e.clientY };
        }
    }

    handleMouseUp() {
        this.canvas.setViewportTransform(this.canvas.viewportTransform);
        this.canvas.isDragging = false;
        this.canvas.selection = true;
    }

    handleKeyDown(e) {
        if (e.key === 'Delete' && this.selectedField) {
            this.removeField(this.selectedField.id);
            this.selectedField = null;
        }
        
        if (e.key === ' ') {
            this.panMode = true;
            e.preventDefault();
        }
    }

    // Properties panel
    onObjectSelected(obj) {
        this.selectedField = obj;
        this.updatePropertiesPanel(obj);
        this.showPropertiesPanel();
    }

    onObjectDeselected() {
        this.selectedField = null;
        this.hidePropertiesPanel();
    }

    onObjectModified(obj) {
        if (obj === this.selectedField) {
            this.updatePropertiesPanel(obj);
        }
    }

    updatePropertiesPanel(obj) {
        const fieldText = document.getElementById('fieldText');
        const fontSize = document.getElementById('fontSize');
        const fontSizeValue = document.getElementById('fontSizeValue');
        const fontColor = document.getElementById('fontColor');
        const fontFamily = document.getElementById('fontFamily');
        const positionX = document.getElementById('positionX');
        const positionY = document.getElementById('positionY');

        if (fieldText) fieldText.value = obj.text || '';
        if (fontSize) fontSize.value = obj.fontSize || 14;
        if (fontSizeValue) fontSizeValue.textContent = (obj.fontSize || 14) + 'px';
        if (fontColor) fontColor.value = obj.fill || '#000000';
        if (fontFamily) fontFamily.value = obj.fontFamily || 'Arial';
        if (positionX) positionX.value = Math.round(obj.left || 0);
        if (positionY) positionY.value = Math.round(obj.top || 0);
    }

    updateSelectedFieldProperty(property, value) {
        if (this.selectedField) {
            this.selectedField.set(property, value);
            this.canvas.renderAll();
        }
    }

    showPropertiesPanel() {
        const panel = document.getElementById('propertiesPanel');
        if (panel) {
            panel.style.display = 'block';
        }
    }

    hidePropertiesPanel() {
        const panel = document.getElementById('propertiesPanel');
        if (panel) {
            panel.style.display = 'none';
        }
    }

    // Template background drawing
    drawTemplateBackground(background) {
        this.backgroundElements = [];
        
        // Draw lines
        if (background.lines) {
            background.lines.forEach(lineConfig => {
                const line = new fabric.Line([
                    lineConfig.x1, lineConfig.y1,
                    lineConfig.x2, lineConfig.y2
                ], {
                    stroke: lineConfig.stroke,
                    strokeWidth: lineConfig.strokeWidth,
                    selectable: false,
                    evented: false
                });
                
                this.canvas.add(line);
                this.backgroundElements.push(line);
            });
        }
        
        // Draw labels
        if (background.labels) {
            background.labels.forEach(labelConfig => {
                const label = new fabric.Text(labelConfig.text, {
                    left: labelConfig.x,
                    top: labelConfig.y,
                    fontSize: labelConfig.fontSize,
                    fill: labelConfig.color,
                    selectable: false,
                    evented: false
                });
                
                this.canvas.add(label);
                this.backgroundElements.push(label);
            });
        }
        
        this.canvas.renderAll();
    }

    getBackgroundElements() {
        return this.backgroundElements.map(element => {
            if (element.type === 'line') {
                return {
                    type: 'line',
                    x1: element.x1,
                    y1: element.y1,
                    x2: element.x2,
                    y2: element.y2,
                    stroke: element.stroke,
                    strokeWidth: element.strokeWidth
                };
            } else if (element.type === 'text') {
                return {
                    type: 'label',
                    text: element.text,
                    x: element.left,
                    y: element.top,
                    fontSize: element.fontSize,
                    color: element.fill
                };
            }
        }).filter(Boolean);
    }

    // Export functions
    exportAsImage(format = 'png') {
        return this.canvas.toDataURL({
            format: format,
            quality: 1,
            multiplier: 2 // Higher resolution
        });
    }

    exportCanvasData() {
        return {
            size: this.getCanvasSize(),
            backgroundColor: this.getBackgroundColor(),
            fields: this.getAllFields(),
            backgroundElements: this.getBackgroundElements(),
            zoom: this.zoom
        };
    }

    importCanvasData(data) {
        if (data.size) {
            this.setCanvasSize(data.size.width, data.size.height);
        }
        
        if (data.backgroundColor) {
            this.setBackgroundColor(data.backgroundColor);
        }
        
        if (data.fields) {
            this.clearAllFields();
            data.fields.forEach(fieldData => {
                this.addField(fieldData);
            });
        }
        
        if (data.backgroundElements) {
            this.drawTemplateBackground({ 
                lines: data.backgroundElements.filter(el => el.type === 'line'),
                labels: data.backgroundElements.filter(el => el.type === 'label')
            });
        }
        
        if (data.zoom) {
            this.setZoom(data.zoom);
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CheckEditor;
}