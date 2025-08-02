# Check Editor Pro - WordPress Plugin

一個專業的 WordPress 支票編輯插件，提供完整的拖拉式欄位編輯、多語言支援、批量處理和PDF導出功能。

## 功能特色

### 🎯 核心功能
- **拖放式欄位編輯** - 直接在支票圖像上拖拽欄位調整位置
- **即時預覽** - 實時查看編輯效果
- **多語言支援** - 繁體中文 / English 雙語介面
- **WordPress 整合** - 完全整合 WordPress 用戶系統和檔案管理

### 📝 支票欄位
- 收款人名稱
- 銀碼（數字格式）
- 銀碼（大寫中文/英文）
- 日期
- 備註/備考
- 簽名欄

### 📋 預設範本
- **香港支票範本** - 符合香港銀行格式
- **中國支票範本** - 適用於中國銀行支票
- **美國支票範本** - 標準美式支票格式

### 📊 WordPress 特色功能
- **短代碼支援** - 使用 `[check_editor]` 在任何頁面顯示編輯器
- **用戶權限管理** - 支援 WordPress 用戶權限系統
- **範本儲存** - 範本儲存在 WordPress 資料庫
- **媒體庫整合** - 使用 WordPress 媒體庫上傳圖片
- **AJAX 操作** - 無需重新載入頁面
- **響應式設計** - 適配各種螢幕尺寸

## 安裝步驟

### 方法一：從 WordPress 管理後台安裝
1. 下載插件 zip 檔案
2. 登入 WordPress 管理後台
3. 前往 **插件 > 新增插件**
4. 點擊 **上傳插件**
5. 選擇下載的 zip 檔案
6. 點擊 **立即安裝**
7. 安裝完成後點擊 **啟用插件**

### 方法二：FTP 上傳
1. 解壓縮插件檔案
2. 將 `check-editor-pro` 資料夾上傳到 `/wp-content/plugins/` 目錄
3. 在 WordPress 管理後台啟用插件

## 使用方法

### 短代碼使用

#### 基本使用
```
[check_editor]
```

#### 自訂參數
```
[check_editor template="hk" width="100%" height="600px" allow_upload="true" allow_export="true" allow_batch="true"]
```

### 短代碼參數說明

| 參數 | 預設值 | 說明 | 選項 |
|------|--------|------|------|
| `template` | `hk` | 預設範本 | `hk`, `cn`, `us` |
| `width` | `100%` | 編輯器寬度 | 任何 CSS 寬度值 |
| `height` | `600px` | 編輯器高度 | 任何 CSS 高度值 |
| `allow_upload` | `true` | 允許上傳圖片 | `true`, `false` |
| `allow_export` | `true` | 允許導出功能 | `true`, `false` |
| `allow_batch` | `true` | 允許批量處理 | `true`, `false` |

### 使用範例

#### 只允許編輯，不允許上傳
```
[check_editor allow_upload="false" allow_batch="false"]
```

#### 使用美國支票範本，固定大小
```
[check_editor template="us" width="900px" height="500px"]
```

#### 嵌入在側邊欄或小區域
```
[check_editor width="400px" height="300px" allow_batch="false"]
```

## 管理設定

### 插件設定頁面
在 WordPress 管理後台，前往 **Check Editor > 設定** 可以配置：

- **公開存取** - 是否允許未登入用戶使用
- **檔案上傳限制** - 最大檔案大小和允許的檔案格式
- **預設範本** - 選擇預設載入的支票範本
- **批量處理** - 啟用/停用批量處理功能
- **分享功能** - 啟用/停用範本分享

### 範本管理
在 **Check Editor > 範本** 頁面可以：
- 查看所有用戶範本
- 管理公開範本
- 刪除不需要的範本

## 用戶權限

### 權限要求
- **查看編輯器**: 任何訪客（如果啟用公開存取）或登入用戶
- **上傳圖片**: 具有 `upload_files` 權限的用戶
- **儲存範本**: 登入用戶
- **批量處理**: 登入用戶
- **管理設定**: 管理員（`manage_options` 權限）

### 角色建議
- **管理員**: 完整功能存取
- **編輯者**: 可使用所有編輯功能
- **作者**: 可使用基本編輯和儲存功能
- **訂閱者**: 僅可查看（如果啟用公開存取）

## 技術要求

### 最低要求
- WordPress 5.0 或更高版本
- PHP 7.4 或更高版本
- MySQL 5.6 或更高版本

### 建議配置
- WordPress 6.0+
- PHP 8.0+
- 足夠的記憶體限制（推薦 256MB）
- 現代瀏覽器支援（Chrome 60+, Firefox 55+, Safari 12+, Edge 79+）

## 檔案結構

```
check-editor-pro/
├── check-editor-pro.php       # 主插件檔案
├── admin/                     # 管理後台檔案
│   ├── pages/                 # 管理頁面
│   └── class-admin.php        # 管理類別
├── assets/                    # 前端資源
│   ├── css/                   # 樣式檔案
│   ├── js/                    # JavaScript 檔案
│   └── images/                # 圖片資源
├── includes/                  # 核心功能類別
├── templates/                 # 範本檔案
├── languages/                 # 翻譯檔案
└── README.md                  # 說明文件
```

## Excel 批量處理

### 支援的欄位格式

| 中文欄位名 | 英文欄位名 | 說明 |
|-----------|-----------|------|
| 收款人 | payee, Payee | 收款人姓名 |
| 金額 | amount, Amount | 支票金額（數字） |
| 日期 | date, Date | 支票日期 |
| 備註 | memo, Memo | 備註信息 |
| 簽名 | signature, Signature | 簽名資訊 |

### Excel 檔案範例
```csv
收款人,金額,日期,備註,簽名
ABC公司,5000.00,2024-01-15,辦公用品,張三
XYZ有限公司,12500.50,2024-01-16,設備租金,李四
```

## 常見問題

### Q: 如何修改預設範本？
A: 可以在管理後台的設定頁面選擇不同的預設範本，或通過短代碼參數指定。

### Q: 支援哪些圖片格式？
A: 預設支援 JPG, JPEG, PNG, GIF。可在設定頁面修改允許的檔案格式。

### Q: 如何自訂 CSS 樣式？
A: 可以在主題的 style.css 中使用 `.check-editor-pro-container` 作為選擇器來自訂樣式。

### Q: 範本儲存在哪裡？
A: 範本儲存在 WordPress 資料庫的 `wp_cep_templates` 表格中。

### Q: 如何備份範本？
A: 範本隨 WordPress 資料庫一起備份。也可以在範本管理頁面匯出特定範本。

## 更新日誌

### 版本 1.0.0
- 初始發布
- 支援拖拉式欄位編輯
- 多語言介面（繁體中文/English）
- 預設支票範本（香港/中國/美國）
- Excel 批量處理
- PDF 和圖片導出
- WordPress 用戶整合
- 響應式設計

## 支援與回饋

如有問題或建議，請：
- 提交 WordPress 支援論壇問題
- 聯繫插件開發者
- 查看插件文檔和FAQ

## 授權條款

本插件採用 GPL v2 或更高版本授權，遵循 WordPress 插件開發標準。

---

© 2024 Check Editor Pro. 專為 WordPress 用戶設計的專業支票編輯解決方案。