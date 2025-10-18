# Vercel 部署指南

## ✅ 已完成的轉換

後端 API 已經從 Express 伺服器轉換為 Vercel Serverless Functions，可以直接部署到 Vercel。

## 📁 新的目錄結構

```
/Users/una/code/ngo/home/
├── api/                          # Vercel Serverless Functions
│   ├── auth/
│   │   ├── login.js             # POST /api/auth/login
│   │   ├── logout.js            # POST /api/auth/logout
│   │   ├── refresh.js           # POST /api/auth/refresh
│   │   ├── me.js                # GET /api/auth/me
│   │   └── verify.js            # GET /api/auth/verify
│   ├── homeless/
│   │   └── [qrCode].js          # GET /api/homeless/:qrCode
│   ├── store/
│   │   └── [qrCode].js          # GET /api/store/:qrCode
│   └── transaction.js           # POST/GET /api/transaction
├── lib/                          # 共用程式碼
│   ├── config/
│   │   └── jwt.js
│   ├── middleware/
│   │   └── auth.js
│   └── models/
│       └── users.js
├── src/                          # React 前端
└── vercel.json                   # Vercel 配置
```

## 🚀 部署步驟

### 1. 安裝 Vercel CLI（可選，用於本地測試）

```bash
npm install -g vercel
```

### 2. 本地測試

```bash
vercel dev
```

這會在 `http://localhost:3000` 啟動本地開發伺服器，模擬 Vercel 環境。

### 3. 部署到 Vercel

#### 方法 A：使用 Vercel Dashboard（推薦）

1. 前往 [vercel.com](https://vercel.com)
2. 登入你的帳號
3. 點擊 "New Project"
4. 連接你的 GitHub repository
5. Vercel 會自動偵測設定
6. 設定環境變數（見下方）
7. 點擊 "Deploy"

#### 方法 B：使用 CLI

```bash
# 登入 Vercel
vercel login

# 部署
vercel

# 部署到生產環境
vercel --prod
```

### 4. 設定環境變數

在 Vercel Dashboard → Settings → Environment Variables 新增：

```
JWT_SECRET=你的超強密碼-請務必更換-生產環境專用
JWT_REFRESH_SECRET=你的刷新密碼-請務必更換-生產環境專用
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
NODE_ENV=production
```

**重要：** `JWT_SECRET` 和 `JWT_REFRESH_SECRET` 請使用強密碼！

### 5. 驗證部署

部署完成後，訪問：
- 前端：`https://your-project.vercel.app`
- API 健康檢查：`https://your-project.vercel.app/api/auth/verify`（應返回 401）

## 🔑 API 端點

所有 API 端點前綴為 `/api`：

### 認證
- `POST /api/auth/login` - 登入
- `POST /api/auth/logout` - 登出
- `POST /api/auth/refresh` - 刷新 token
- `GET /api/auth/me` - 取得當前用戶
- `GET /api/auth/verify` - 驗證 token

### 街友
- `GET /api/homeless/:qrCode` - 取得街友資訊

### 店家
- `GET /api/store/:qrCode` - 取得店家資訊

### 交易
- `POST /api/transaction` - 建立交易
- `GET /api/transaction?qrCode=xxx` - 取得交易記錄

## ⚠️ 重要注意事項

### 1. 資料持久化問題

**目前狀態：** 交易記錄和餘額更新存在記憶體中，Serverless Functions 每次請求都是新的實例，資料不會持久化。

**解決方案：** 需要連接資料庫

推薦選項：
- **Vercel Postgres**（Vercel 官方，無縫整合）
- **MongoDB Atlas**（免費方案，NoSQL）
- **Supabase**（免費方案，PostgreSQL）
- **PlanetScale**（免費方案，MySQL）

### 2. 冷啟動

Serverless Functions 如果長時間沒有請求，下次請求會有 1-2 秒的冷啟動時間。

### 3. CORS 設定

已在各 API 檔案中處理，Vercel 會自動設定正確的 CORS headers。

## 🔄 從開發環境切換到生產環境

### 開發環境（使用 Express 伺服器）
```bash
npm run dev
```
- 前端：http://localhost:5173
- 後端：http://localhost:3001

### 測試 Serverless Functions（本地）
```bash
vercel dev
```
- 前端 + API：http://localhost:3000

### 生產環境（Vercel）
```bash
vercel --prod
```
- 前端 + API：https://your-project.vercel.app

## 📝 後續建議

### 1. 連接資料庫

為了讓交易記錄和餘額更新能夠持久化，建議：

1. 選擇資料庫（推薦 Vercel Postgres 或 Supabase）
2. 更新 `lib/models/users.js` 使用真實資料庫查詢
3. 建立資料庫 schema（users, transactions, stores, homeless）

### 2. 環境變數管理

- 開發環境：`.env`
- 生產環境：Vercel Dashboard → Environment Variables

### 3. 監控與日誌

Vercel Dashboard 提供：
- 部署日誌
- Function 執行日誌
- 錯誤追蹤

## 🐛 除錯

### API 返回 405 錯誤

- ✅ 已修復：所有 API Functions 都正確處理 HTTP 方法
- 確認請求使用正確的 HTTP 方法（GET/POST）

### Cookie 無法設定

- 確認環境變數 `NODE_ENV=production`
- Cookie 會自動加上 `Secure` flag（需要 HTTPS）

### API 無法連接

- 檢查 Vercel Dashboard → Deployments → Function Logs
- 確認 `vercel.json` 配置正確

## 📚 參考資料

- [Vercel Serverless Functions 文件](https://vercel.com/docs/functions/serverless-functions)
- [Vercel 環境變數](https://vercel.com/docs/projects/environment-variables)
- [動態路由](https://vercel.com/docs/functions/serverless-functions/runtimes/node-js#path-segments)
