// templates.js - Predefined check templates
class CheckTemplates {
    constructor() {
        this.templates = {
            hk: {
                name: 'Hong Kong Check',
                nameCn: '香港支票',
                size: { width: 850, height: 350 },
                backgroundColor: '#ffffff',
                fields: [
                    {
                        id: 'date',
                        type: 'date',
                        x: 680,
                        y: 40,
                        width: 150,
                        height: 30,
                        fontSize: 14,
                        fontFamily: 'Arial',
                        color: '#000000',
                        placeholder: '2024年1月1日',
                        required: true
                    },
                    {
                        id: 'payee',
                        type: 'payee',
                        x: 80,
                        y: 100,
                        width: 400,
                        height: 30,
                        fontSize: 16,
                        fontFamily: 'Arial',
                        color: '#000000',
                        placeholder: '收款人姓名',
                        required: true
                    },
                    {
                        id: 'amount-number',
                        type: 'amount-number',
                        x: 650,
                        y: 100,
                        width: 150,
                        height: 30,
                        fontSize: 16,
                        fontFamily: 'Arial',
                        color: '#000000',
                        placeholder: '1,000.00',
                        required: true,
                        textAlign: 'right'
                    },
                    {
                        id: 'amount-text',
                        type: 'amount-text',
                        x: 80,
                        y: 150,
                        width: 600,
                        height: 30,
                        fontSize: 14,
                        fontFamily: 'Microsoft JhengHei',
                        color: '#000000',
                        placeholder: '壹仟元正',
                        required: true
                    },
                    {
                        id: 'memo',
                        type: 'memo',
                        x: 80,
                        y: 200,
                        width: 300,
                        height: 30,
                        fontSize: 12,
                        fontFamily: 'Arial',
                        color: '#000000',
                        placeholder: '備註說明',
                        required: false
                    },
                    {
                        id: 'signature',
                        type: 'signature',
                        x: 600,
                        y: 250,
                        width: 200,
                        height: 60,
                        fontSize: 12,
                        fontFamily: 'Arial',
                        color: '#000000',
                        placeholder: '簽名',
                        required: true
                    }
                ],
                background: {
                    lines: [
                        { x1: 70, y1: 130, x2: 500, y2: 130, stroke: '#cccccc', strokeWidth: 1 },
                        { x1: 70, y1: 180, x2: 700, y2: 180, stroke: '#cccccc', strokeWidth: 1 },
                        { x1: 70, y1: 230, x2: 400, y2: 230, stroke: '#cccccc', strokeWidth: 1 },
                        { x1: 590, y1: 280, x2: 810, y2: 280, stroke: '#cccccc', strokeWidth: 1 }
                    ],
                    labels: [
                        { text: 'PAY TO:', x: 20, y: 125, fontSize: 10, color: '#666666' },
                        { text: 'HK$:', x: 620, y: 125, fontSize: 10, color: '#666666' },
                        { text: 'DATE:', x: 650, y: 35, fontSize: 10, color: '#666666' },
                        { text: 'MEMO:', x: 20, y: 225, fontSize: 10, color: '#666666' },
                        { text: 'SIGNATURE:', x: 590, y: 275, fontSize: 10, color: '#666666' }
                    ]
                }
            },
            cn: {
                name: 'China Check',
                nameCn: '中國支票',
                size: { width: 800, height: 360 },
                backgroundColor: '#ffffff',
                fields: [
                    {
                        id: 'date',
                        type: 'date',
                        x: 600,
                        y: 50,
                        width: 150,
                        height: 30,
                        fontSize: 14,
                        fontFamily: 'Microsoft JhengHei',
                        color: '#000000',
                        placeholder: '2024年1月1日',
                        required: true
                    },
                    {
                        id: 'payee',
                        type: 'payee',
                        x: 100,
                        y: 110,
                        width: 350,
                        height: 30,
                        fontSize: 16,
                        fontFamily: 'Microsoft JhengHei',
                        color: '#000000',
                        placeholder: '收款人姓名',
                        required: true
                    },
                    {
                        id: 'amount-number',
                        type: 'amount-number',
                        x: 580,
                        y: 110,
                        width: 150,
                        height: 30,
                        fontSize: 16,
                        fontFamily: 'Arial',
                        color: '#000000',
                        placeholder: '1,000.00',
                        required: true,
                        textAlign: 'right'
                    },
                    {
                        id: 'amount-text',
                        type: 'amount-text',
                        x: 100,
                        y: 170,
                        width: 550,
                        height: 30,
                        fontSize: 14,
                        fontFamily: 'Microsoft JhengHei',
                        color: '#000000',
                        placeholder: '人民幣壹仟元整',
                        required: true
                    },
                    {
                        id: 'memo',
                        type: 'memo',
                        x: 100,
                        y: 230,
                        width: 300,
                        height: 30,
                        fontSize: 12,
                        fontFamily: 'Microsoft JhengHei',
                        color: '#000000',
                        placeholder: '用途',
                        required: false
                    },
                    {
                        id: 'signature',
                        type: 'signature',
                        x: 550,
                        y: 270,
                        width: 180,
                        height: 60,
                        fontSize: 12,
                        fontFamily: 'Microsoft JhengHei',
                        color: '#000000',
                        placeholder: '出票人簽章',
                        required: true
                    }
                ],
                background: {
                    lines: [
                        { x1: 90, y1: 140, x2: 470, y2: 140, stroke: '#cccccc', strokeWidth: 1 },
                        { x1: 90, y1: 200, x2: 670, y2: 200, stroke: '#cccccc', strokeWidth: 1 },
                        { x1: 90, y1: 260, x2: 420, y2: 260, stroke: '#cccccc', strokeWidth: 1 },
                        { x1: 540, y1: 310, x2: 740, y2: 310, stroke: '#cccccc', strokeWidth: 1 }
                    ],
                    labels: [
                        { text: '收款人:', x: 40, y: 135, fontSize: 10, color: '#666666' },
                        { text: '人民幣:', x: 520, y: 135, fontSize: 10, color: '#666666' },
                        { text: '出票日期:', x: 540, y: 45, fontSize: 10, color: '#666666' },
                        { text: '用途:', x: 40, y: 255, fontSize: 10, color: '#666666' },
                        { text: '出票人簽章:', x: 540, y: 305, fontSize: 10, color: '#666666' }
                    ]
                }
            },
            us: {
                name: 'US Check',
                nameCn: '美國支票',
                size: { width: 820, height: 320 },
                backgroundColor: '#ffffff',
                fields: [
                    {
                        id: 'date',
                        type: 'date',
                        x: 650,
                        y: 30,
                        width: 150,
                        height: 25,
                        fontSize: 12,
                        fontFamily: 'Arial',
                        color: '#000000',
                        placeholder: 'January 1, 2024',
                        required: true
                    },
                    {
                        id: 'payee',
                        type: 'payee',
                        x: 80,
                        y: 80,
                        width: 400,
                        height: 25,
                        fontSize: 14,
                        fontFamily: 'Arial',
                        color: '#000000',
                        placeholder: 'Payee Name',
                        required: true
                    },
                    {
                        id: 'amount-number',
                        type: 'amount-number',
                        x: 620,
                        y: 80,
                        width: 150,
                        height: 25,
                        fontSize: 14,
                        fontFamily: 'Arial',
                        color: '#000000',
                        placeholder: '$1,000.00',
                        required: true,
                        textAlign: 'right'
                    },
                    {
                        id: 'amount-text',
                        type: 'amount-text',
                        x: 80,
                        y: 130,
                        width: 550,
                        height: 25,
                        fontSize: 12,
                        fontFamily: 'Arial',
                        color: '#000000',
                        placeholder: 'One Thousand Dollars',
                        required: true
                    },
                    {
                        id: 'memo',
                        type: 'memo',
                        x: 80,
                        y: 180,
                        width: 250,
                        height: 25,
                        fontSize: 11,
                        fontFamily: 'Arial',
                        color: '#000000',
                        placeholder: 'Memo',
                        required: false
                    },
                    {
                        id: 'signature',
                        type: 'signature',
                        x: 550,
                        y: 220,
                        width: 220,
                        height: 50,
                        fontSize: 11,
                        fontFamily: 'Arial',
                        color: '#000000',
                        placeholder: 'Signature',
                        required: true
                    }
                ],
                background: {
                    lines: [
                        { x1: 70, y1: 105, x2: 500, y2: 105, stroke: '#cccccc', strokeWidth: 1 },
                        { x1: 70, y1: 155, x2: 650, y2: 155, stroke: '#cccccc', strokeWidth: 1 },
                        { x1: 70, y1: 205, x2: 350, y2: 205, stroke: '#cccccc', strokeWidth: 1 },
                        { x1: 540, y1: 250, x2: 780, y2: 250, stroke: '#cccccc', strokeWidth: 1 }
                    ],
                    labels: [
                        { text: 'PAY TO THE ORDER OF:', x: 20, y: 100, fontSize: 9, color: '#666666' },
                        { text: '$', x: 610, y: 100, fontSize: 12, color: '#666666' },
                        { text: 'DATE:', x: 620, y: 25, fontSize: 9, color: '#666666' },
                        { text: 'MEMO:', x: 20, y: 200, fontSize: 9, color: '#666666' },
                        { text: 'SIGNATURE:', x: 540, y: 245, fontSize: 9, color: '#666666' }
                    ]
                }
            }
        };
    }

    getTemplate(templateId) {
        return this.templates[templateId] || null;
    }

    getAllTemplates() {
        return Object.keys(this.templates).map(id => ({
            id,
            name: this.templates[id].name,
            nameCn: this.templates[id].nameCn,
            size: this.templates[id].size
        }));
    }

    createTemplatePreview(templateId, canvas) {
        const template = this.getTemplate(templateId);
        if (!template || !canvas) return;

        const ctx = canvas.getContext('2d');
        const scale = Math.min(
            canvas.width / template.size.width,
            canvas.height / template.size.height
        ) * 0.8;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calculate offset for centering
        const offsetX = (canvas.width - template.size.width * scale) / 2;
        const offsetY = (canvas.height - template.size.height * scale) / 2;

        // Save context
        ctx.save();
        ctx.translate(offsetX, offsetY);
        ctx.scale(scale, scale);

        // Draw background
        ctx.fillStyle = template.backgroundColor;
        ctx.fillRect(0, 0, template.size.width, template.size.height);

        // Draw border
        ctx.strokeStyle = '#cccccc';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, template.size.width, template.size.height);

        // Draw background lines
        if (template.background && template.background.lines) {
            template.background.lines.forEach(line => {
                ctx.beginPath();
                ctx.moveTo(line.x1, line.y1);
                ctx.lineTo(line.x2, line.y2);
                ctx.strokeStyle = line.stroke;
                ctx.lineWidth = line.strokeWidth;
                ctx.stroke();
            });
        }

        // Draw background labels
        if (template.background && template.background.labels) {
            template.background.labels.forEach(label => {
                ctx.fillStyle = label.color;
                ctx.font = `${label.fontSize}px Arial`;
                ctx.fillText(label.text, label.x, label.y);
            });
        }

        // Draw field placeholders
        template.fields.forEach(field => {
            ctx.fillStyle = '#e0e0e0';
            ctx.fillRect(field.x, field.y, field.width, field.height);
            
            ctx.strokeStyle = '#cccccc';
            ctx.lineWidth = 1;
            ctx.strokeRect(field.x, field.y, field.width, field.height);
            
            ctx.fillStyle = '#999999';
            ctx.font = `${field.fontSize}px ${field.fontFamily}`;
            ctx.textAlign = field.textAlign || 'left';
            
            const textX = field.textAlign === 'right' ? 
                field.x + field.width - 5 : 
                field.x + 5;
            const textY = field.y + field.height / 2 + field.fontSize / 3;
            
            ctx.fillText(field.placeholder, textX, textY);
        });

        // Restore context
        ctx.restore();
    }

    loadTemplateToEditor(templateId, editor) {
        const template = this.getTemplate(templateId);
        if (!template || !editor) return false;

        try {
            // Set canvas size
            editor.setCanvasSize(template.size.width, template.size.height);
            
            // Clear existing fields
            editor.clearAllFields();
            
            // Set background
            editor.setBackgroundColor(template.backgroundColor);
            
            // Add template fields
            template.fields.forEach(fieldConfig => {
                editor.addField(fieldConfig);
            });
            
            // Draw background elements
            if (template.background) {
                editor.drawTemplateBackground(template.background);
            }
            
            return true;
        } catch (error) {
            console.error('Error loading template:', error);
            return false;
        }
    }

    exportTemplate(templateData) {
        return {
            version: '1.0',
            name: templateData.name || 'Custom Template',
            size: templateData.size,
            backgroundColor: templateData.backgroundColor || '#ffffff',
            fields: templateData.fields || [],
            background: templateData.background || {},
            created: new Date().toISOString()
        };
    }

    importTemplate(templateJson) {
        try {
            const template = JSON.parse(templateJson);
            
            // Validate template structure
            if (!template.size || !template.fields) {
                throw new Error('Invalid template format');
            }
            
            return template;
        } catch (error) {
            console.error('Error importing template:', error);
            return null;
        }
    }

    // Generate template from current editor state
    generateTemplateFromEditor(editor, name) {
        if (!editor) return null;
        
        const fields = editor.getAllFields().map(field => ({
            id: field.id,
            type: field.type,
            x: field.x,
            y: field.y,
            width: field.width,
            height: field.height,
            fontSize: field.fontSize,
            fontFamily: field.fontFamily,
            color: field.color,
            placeholder: field.placeholder || '',
            required: field.required || false,
            textAlign: field.textAlign || 'left'
        }));
        
        return this.exportTemplate({
            name: name,
            size: editor.getCanvasSize(),
            backgroundColor: editor.getBackgroundColor(),
            fields: fields,
            background: editor.getBackgroundElements()
        });
    }

    // Create custom field configurations
    createFieldConfig(type, x = 100, y = 100) {
        const configs = {
            'payee': {
                type: 'payee',
                width: 300,
                height: 30,
                fontSize: 14,
                fontFamily: 'Arial',
                color: '#000000',
                placeholder: window.i18n ? window.i18n.get('placeholders.payee') : 'Payee Name',
                required: true
            },
            'amount-number': {
                type: 'amount-number',
                width: 120,
                height: 30,
                fontSize: 14,
                fontFamily: 'Arial',
                color: '#000000',
                placeholder: window.i18n ? window.i18n.get('placeholders.amount_number') : '1,000.00',
                required: true,
                textAlign: 'right'
            },
            'amount-text': {
                type: 'amount-text',
                width: 400,
                height: 30,
                fontSize: 12,
                fontFamily: 'Microsoft JhengHei',
                color: '#000000',
                placeholder: window.i18n ? window.i18n.get('placeholders.amount_text') : 'One Thousand Dollars',
                required: true
            },
            'date': {
                type: 'date',
                width: 120,
                height: 25,
                fontSize: 12,
                fontFamily: 'Arial',
                color: '#000000',
                placeholder: window.i18n ? window.i18n.get('placeholders.date') : 'Date',
                required: true
            },
            'memo': {
                type: 'memo',
                width: 200,
                height: 25,
                fontSize: 11,
                fontFamily: 'Arial',
                color: '#000000',
                placeholder: window.i18n ? window.i18n.get('placeholders.memo') : 'Memo',
                required: false
            },
            'signature': {
                type: 'signature',
                width: 180,
                height: 50,
                fontSize: 11,
                fontFamily: 'Arial',
                color: '#000000',
                placeholder: window.i18n ? window.i18n.get('placeholders.signature') : 'Signature',
                required: true
            }
        };

        const config = configs[type];
        if (config) {
            return {
                ...config,
                id: `${type}_${Date.now()}`,
                x: x,
                y: y
            };
        }
        
        return null;
    }
}

// Initialize templates when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.checkTemplates = new CheckTemplates();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CheckTemplates;
}