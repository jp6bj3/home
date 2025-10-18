# JWT 認證系統使用說明

## 🚀 快速開始

### 啟動開發環境

```bash
npm run dev
```

這個指令會同時啟動：
- **前端開發伺服器** (Vite): http://localhost:5173
- **後端 API 伺服器** (Express): http://localhost:3001

### 單獨啟動

```bash
# 只啟動前端
npm run dev:client

# 只啟動後端
npm run dev:server
```

## 🔐 測試帳號

### NGO 管理員
- 帳號：`admin`
- 密碼：`admin123`
- 角色：`ngo_admin`

### 店家
- 帳號：`store1`
- 密碼：`store123`
- 角色：`store`

### 街友
- 帳號：`homeless1`
- 密碼：`homeless123`
- 角色：`homeless`

### NGO 夥伴
- 帳號：`ngo_partner`
- 密碼：`partner123`
- 角色：`ngo_partner`

### 協會管理員
- 帳號：`association`
- 密碼：`assoc123`
- 角色：`association_admin`

## 📁 專案結構

```
/Users/una/code/ngo/home/
├── server/                    # 後端程式碼
│   ├── index.js              # Express 主程式
│   ├── config/
│   │   └── jwt.js            # JWT 設定
│   ├── middleware/
│   │   └── auth.js           # 認證中間件
│   ├── routes/
│   │   ├── auth.js           # 認證路由
│   │   ├── homeless.js       # 街友路由
│   │   ├── store.js          # 店家路由
│   │   └── transaction.js    # 交易路由
│   └── models/
│       └── users.js          # 用戶資料模型
├── src/                       # 前端程式碼
│   ├── services/
│   │   ├── api.js            # Axios 設定
│   │   └── auth.js           # API 服務
│   ├── hooks/
│   │   └── useAuth.js        # 認證 Hook
│   └── ...
└── .env                       # 環境變數
```

## 🔑 JWT 認證流程

### 1. 登入
- 前端送出帳號、密碼、角色到 `POST /api/auth/login`
- 後端驗證成功後生成 JWT tokens：
  - **Access Token**: 15分鐘過期，存在 httpOnly cookie
  - **Refresh Token**: 7天過期，存在 httpOnly cookie
- 返回用戶資訊

### 2. 請求 API
- 前端自動攜帶 cookie
- 後端使用 `authenticateToken` 中間件驗證
- 驗證成功則處理請求

### 3. Token 刷新
- Access token 過期時，前端自動呼叫 `POST /api/auth/refresh`
- 使用 refresh token 生成新的 access token
- 重新發送原始請求

### 4. 登出
- 呼叫 `POST /api/auth/logout`
- 清除 cookies

## 🌐 API 端點

### 認證 API
```
POST   /api/auth/login       # 登入
POST   /api/auth/logout      # 登出
POST   /api/auth/refresh     # 刷新 token
GET    /api/auth/me          # 取得當前用戶資訊
GET    /api/auth/verify      # 驗證 token
```

### 街友 API
```
GET    /api/homeless/:qrCode              # 取得街友資訊（公開）
GET    /api/homeless                      # 取得所有街友列表（需 NGO 權限）
PATCH  /api/homeless/:id/balance          # 更新街友餘額（需認證）
```

### 店家 API
```
GET    /api/store/:qrCode                 # 取得店家資訊（公開）
GET    /api/store                         # 取得所有店家列表（需 NGO 權限）
```

### 交易 API
```
POST   /api/transaction                   # 建立交易
GET    /api/transaction?qrCode=xxx        # 取得交易記錄（需認證）
```

### 健康檢查
```
GET    /health                            # 伺服器健康狀態
```

## 🔧 環境變數說明

`.env` 檔案內容：

```env
# JWT 密鑰（生產環境請務必更換）
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-token-secret

# Token 過期時間
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# 伺服器設定
PORT=3001
NODE_ENV=development

# CORS 設定
CLIENT_URL=http://localhost:5173
```

## 📝 API 使用範例

### 登入
```javascript
import { authService } from '@/services/auth';

const result = await authService.login('admin', 'admin123', 'ngo_admin');
console.log(result.user);
```

### 取得街友資訊
```javascript
import { homelessService } from '@/services/auth';

const response = await homelessService.getByQrCode('QR_001');
console.log(response.data);
```

### 建立交易
```javascript
import { transactionService } from '@/services/auth';

const result = await transactionService.create({
  homelessQrCode: 'QR_001',
  storeQrCode: 'STORE_QR_001',
  amount: 80,
  productName: '午餐套餐'
});
```

## 🛡️ 安全特性

1. **httpOnly Cookie**: Token 存在 httpOnly cookie 中，防止 XSS 攻擊
2. **密碼加密**: 使用 bcryptjs 加密密碼
3. **Token 過期**: Access token 短時間過期，減少風險
4. **自動刷新**: Token 過期自動刷新，用戶無感
5. **CORS 設定**: 限制跨域請求來源

## 🔍 除錯

### 查看請求日誌
後端會自動輸出所有 API 請求：
```
2025-10-14T12:00:00.000Z - POST /api/auth/login
```

### 檢查 Cookie
在瀏覽器開發者工具 → Application → Cookies 中可以看到：
- `accessToken`
- `refreshToken`

### 測試 API
```bash
# 健康檢查
curl http://localhost:3001/health

# 取得街友資訊
curl http://localhost:3001/api/homeless/QR_001
```

## 📦 資料庫說明

目前使用記憶體儲存資料（在 `server/models/users.js`）。

**重要**：伺服器重啟後所有資料會重置。

未來可以：
1. 接入 MongoDB
2. 使用 PostgreSQL
3. 使用 MySQL

## 🚨 注意事項

1. `.env` 檔案中的 JWT_SECRET 在生產環境必須使用強密碼
2. 目前資料存在記憶體中，伺服器重啟會遺失
3. CORS 設定在生產環境需要限制允許的來源
4. Cookie 的 secure 選項在生產環境應設為 true（需要 HTTPS）

## 📚 更多資訊

- [JWT 官方文件](https://jwt.io/)
- [Express 官方文件](https://expressjs.com/)
- [Axios 官方文件](https://axios-http.com/)
