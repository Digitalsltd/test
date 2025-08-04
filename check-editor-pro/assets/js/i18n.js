// i18n.js - Internationalization support
class I18n {
    constructor() {
        this.currentLanguage = 'zh-TW';
        this.translations = {
            'zh-TW': {
                'app.title': '支票編輯工具',
                'buttons.help': '說明',
                'sidebar.upload': '上傳支票',
                'sidebar.templates': '範本',
                'sidebar.fields': '欄位工具',
                'sidebar.batch': '批量處理',
                'sidebar.export': '導出',
                'sidebar.cloud': '雲端儲存',
                'upload.dragdrop': '拖放支票圖像至此',
                'upload.or': '或',
                'upload.browse': '瀏覽檔案',
                'templates.hk': '香港支票',
                'templates.cn': '中國支票',
                'templates.us': '美國支票',
                'fields.payee': '收款人',
                'fields.amount_number': '金額(數字)',
                'fields.amount_text': '金額(大寫)',
                'fields.date': '日期',
                'fields.memo': '備註',
                'fields.signature': '簽名',
                'batch.import_excel': '匯入 Excel',
                'batch.generate': '批量生成',
                'export.pdf': '下載 PDF',
                'export.image': '下載圖片',
                'cloud.save': '儲存至雲端',
                'cloud.share': '分享',
                'cloud.load': '載入雲端檔案',
                'zoom.fit': '適合螢幕',
                'properties.title': '屬性設定',
                'properties.text': '文字內容',
                'properties.font_size': '字體大小',
                'properties.font_color': '字體顏色',
                'properties.font_family': '字體',
                'properties.position': '位置',
                'messages.upload_success': '檔案上傳成功',
                'messages.upload_error': '檔案上傳失敗',
                'messages.save_success': '儲存成功',
                'messages.save_error': '儲存失敗',
                'messages.export_success': 'PDF 導出成功',
                'messages.export_error': 'PDF 導出失敗',
                'messages.invalid_file': '無效的檔案格式',
                'messages.excel_import_success': 'Excel 匯入成功',
                'messages.excel_import_error': 'Excel 匯入失敗',
                'messages.batch_generate_success': '批量生成完成',
                'messages.batch_generate_error': '批量生成失敗',
                'placeholders.payee': '收款人姓名',
                'placeholders.amount_number': '1,000.00',
                'placeholders.amount_text': '壹仟元正',
                'placeholders.date': '2024年1月1日',
                'placeholders.memo': '備註說明',
                'placeholders.signature': '簽名',
                'dialogs.confirm_delete': '確定要刪除此欄位嗎？',
                'dialogs.unsaved_changes': '有未儲存的變更，確定要離開嗎？',
                'dialogs.share_title': '分享支票範本',
                'dialogs.share_link': '分享連結',
                'dialogs.copy_link': '複製連結',
                'help.title': '使用說明',
                'help.upload': '1. 上傳支票圖像或選擇預設範本',
                'help.fields': '2. 點擊欄位工具添加文字欄位',
                'help.drag': '3. 拖拽欄位到合適位置',
                'help.customize': '4. 在右側面板調整字體和顏色',
                'help.export': '5. 點擊導出按鈕下載 PDF 或圖片',
                'help.batch': '6. 匯入 Excel 檔案進行批量處理'
            },
            'en': {
                'app.title': 'Check Editor Tool',
                'buttons.help': 'Help',
                'sidebar.upload': 'Upload Check',
                'sidebar.templates': 'Templates',
                'sidebar.fields': 'Field Tools',
                'sidebar.batch': 'Batch Processing',
                'sidebar.export': 'Export',
                'sidebar.cloud': 'Cloud Storage',
                'upload.dragdrop': 'Drag and drop check image here',
                'upload.or': 'or',
                'upload.browse': 'Browse Files',
                'templates.hk': 'Hong Kong Check',
                'templates.cn': 'China Check',
                'templates.us': 'US Check',
                'fields.payee': 'Payee',
                'fields.amount_number': 'Amount (Number)',
                'fields.amount_text': 'Amount (Text)',
                'fields.date': 'Date',
                'fields.memo': 'Memo',
                'fields.signature': 'Signature',
                'batch.import_excel': 'Import Excel',
                'batch.generate': 'Batch Generate',
                'export.pdf': 'Download PDF',
                'export.image': 'Download Image',
                'cloud.save': 'Save to Cloud',
                'cloud.share': 'Share',
                'cloud.load': 'Load from Cloud',
                'zoom.fit': 'Fit to Screen',
                'properties.title': 'Properties',
                'properties.text': 'Text Content',
                'properties.font_size': 'Font Size',
                'properties.font_color': 'Font Color',
                'properties.font_family': 'Font Family',
                'properties.position': 'Position',
                'messages.upload_success': 'File uploaded successfully',
                'messages.upload_error': 'File upload failed',
                'messages.save_success': 'Saved successfully',
                'messages.save_error': 'Save failed',
                'messages.export_success': 'PDF exported successfully',
                'messages.export_error': 'PDF export failed',
                'messages.invalid_file': 'Invalid file format',
                'messages.excel_import_success': 'Excel imported successfully',
                'messages.excel_import_error': 'Excel import failed',
                'messages.batch_generate_success': 'Batch generation completed',
                'messages.batch_generate_error': 'Batch generation failed',
                'placeholders.payee': 'Payee Name',
                'placeholders.amount_number': '1,000.00',
                'placeholders.amount_text': 'One Thousand Dollars',
                'placeholders.date': 'January 1, 2024',
                'placeholders.memo': 'Memo',
                'placeholders.signature': 'Signature',
                'dialogs.confirm_delete': 'Are you sure you want to delete this field?',
                'dialogs.unsaved_changes': 'You have unsaved changes. Are you sure you want to leave?',
                'dialogs.share_title': 'Share Check Template',
                'dialogs.share_link': 'Share Link',
                'dialogs.copy_link': 'Copy Link',
                'help.title': 'Help Guide',
                'help.upload': '1. Upload check image or select a template',
                'help.fields': '2. Click field tools to add text fields',
                'help.drag': '3. Drag fields to appropriate positions',
                'help.customize': '4. Adjust font and color in the right panel',
                'help.export': '5. Click export button to download PDF or image',
                'help.batch': '6. Import Excel file for batch processing'
            }
        };
        this.init();
    }

    init() {
        // Check for saved language preference
        const savedLanguage = localStorage.getItem('checkEditor_language');
        if (savedLanguage && this.translations[savedLanguage]) {
            this.currentLanguage = savedLanguage;
        }
        
        // Set up language selector
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.value = this.currentLanguage;
            languageSelect.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
        }
        
        // Apply initial translations
        this.applyTranslations();
    }

    setLanguage(language) {
        if (this.translations[language]) {
            this.currentLanguage = language;
            localStorage.setItem('checkEditor_language', language);
            this.applyTranslations();
            document.documentElement.lang = language;
            
            // Trigger language change event
            window.dispatchEvent(new CustomEvent('languageChange', {
                detail: { language: language }
            }));
        }
    }

    get(key, params = {}) {
        let translation = this.translations[this.currentLanguage][key] || key;
        
        // Replace parameters in translation
        Object.keys(params).forEach(param => {
            translation = translation.replace(`{${param}}`, params[param]);
        });
        
        return translation;
    }

    applyTranslations() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.get(key);
            
            if (element.tagName === 'INPUT' && element.type === 'text') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });
    }

    // Format numbers based on locale
    formatNumber(number) {
        const formatters = {
            'zh-TW': new Intl.NumberFormat('zh-TW'),
            'en': new Intl.NumberFormat('en-US')
        };
        
        return formatters[this.currentLanguage] ? 
            formatters[this.currentLanguage].format(number) : 
            number.toString();
    }

    // Format dates based on locale
    formatDate(date) {
        const formatters = {
            'zh-TW': new Intl.DateTimeFormat('zh-TW', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            'en': new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        };
        
        return formatters[this.currentLanguage] ? 
            formatters[this.currentLanguage].format(date) : 
            date.toDateString();
    }

    // Convert numbers to Chinese characters (for amount in Chinese)
    numberToChinese(num) {
        if (this.currentLanguage !== 'zh-TW') {
            return this.numberToEnglish(num);
        }
        
        const digits = ['零', '壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖'];
        const units = ['', '拾', '佰', '仟'];
        const bigUnits = ['', '萬', '億', '兆'];
        
        if (num === 0) return '零元正';
        if (num < 0) return '負' + this.numberToChinese(Math.abs(num));
        
        const [integerPart, decimalPart] = num.toString().split('.');
        let result = '';
        
        // Convert integer part
        if (parseInt(integerPart) > 0) {
            result = this.convertIntegerToChinese(parseInt(integerPart), digits, units, bigUnits);
        }
        
        result += '元';
        
        // Convert decimal part
        if (decimalPart && parseInt(decimalPart) > 0) {
            const cents = parseInt(decimalPart.padEnd(2, '0').substring(0, 2));
            const jiao = Math.floor(cents / 10);
            const fen = cents % 10;
            
            if (jiao > 0) {
                result += digits[jiao] + '角';
            }
            if (fen > 0) {
                result += digits[fen] + '分';
            }
        } else {
            result += '正';
        }
        
        return result;
    }

    convertIntegerToChinese(num, digits, units, bigUnits) {
        if (num === 0) return '';
        
        let result = '';
        let unitIndex = 0;
        
        while (num > 0) {
            const segment = num % 10000;
            if (segment > 0) {
                let segmentStr = this.convertSegmentToChinese(segment, digits, units);
                if (unitIndex > 0) {
                    segmentStr += bigUnits[unitIndex];
                }
                result = segmentStr + result;
            }
            num = Math.floor(num / 10000);
            unitIndex++;
        }
        
        return result;
    }

    convertSegmentToChinese(segment, digits, units) {
        let result = '';
        let digitIndex = 0;
        let hasZero = false;
        
        while (segment > 0) {
            const digit = segment % 10;
            if (digit > 0) {
                if (hasZero && result.length > 0) {
                    result = '零' + result;
                }
                result = digits[digit] + (digitIndex > 0 ? units[digitIndex] : '') + result;
                hasZero = false;
            } else {
                hasZero = true;
            }
            segment = Math.floor(segment / 10);
            digitIndex++;
        }
        
        return result;
    }

    numberToEnglish(num) {
        const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
        const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
        const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
        const thousands = ['', 'thousand', 'million', 'billion'];
        
        if (num === 0) return 'zero dollars';
        
        const [integerPart, decimalPart] = num.toString().split('.');
        let result = this.convertIntegerToEnglish(parseInt(integerPart), ones, teens, tens, thousands);
        
        result += parseInt(integerPart) === 1 ? ' dollar' : ' dollars';
        
        if (decimalPart && parseInt(decimalPart) > 0) {
            const cents = parseInt(decimalPart.padEnd(2, '0').substring(0, 2));
            result += ' and ' + this.convertIntegerToEnglish(cents, ones, teens, tens, thousands);
            result += cents === 1 ? ' cent' : ' cents';
        }
        
        return result.charAt(0).toUpperCase() + result.slice(1);
    }

    convertIntegerToEnglish(num, ones, teens, tens, thousands) {
        if (num === 0) return '';
        
        let result = '';
        let thousandIndex = 0;
        
        while (num > 0) {
            const segment = num % 1000;
            if (segment > 0) {
                let segmentStr = this.convertSegmentToEnglish(segment, ones, teens, tens);
                if (thousandIndex > 0) {
                    segmentStr += ' ' + thousands[thousandIndex];
                }
                result = segmentStr + (result ? ' ' + result : '');
            }
            num = Math.floor(num / 1000);
            thousandIndex++;
        }
        
        return result;
    }

    convertSegmentToEnglish(segment, ones, teens, tens) {
        let result = '';
        
        const hundreds = Math.floor(segment / 100);
        const remainder = segment % 100;
        
        if (hundreds > 0) {
            result += ones[hundreds] + ' hundred';
        }
        
        if (remainder > 0) {
            if (result) result += ' ';
            
            if (remainder < 10) {
                result += ones[remainder];
            } else if (remainder < 20) {
                result += teens[remainder - 10];
            } else {
                const tensDigit = Math.floor(remainder / 10);
                const onesDigit = remainder % 10;
                result += tens[tensDigit];
                if (onesDigit > 0) {
                    result += '-' + ones[onesDigit];
                }
            }
        }
        
        return result;
    }
}

// Initialize i18n when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.i18n = new I18n();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18n;
}