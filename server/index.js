import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import homelessRoutes from './routes/homeless.js';
import storeRoutes from './routes/store.js';
import transactionRoutes from './routes/transaction.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 請求日誌
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/homeless', homelessRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/transaction', transactionRoutes);

// 健康檢查
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 處理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '找不到該路由'
  });
});

// 錯誤處理
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: '伺服器錯誤',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  console.log('\n📚 Available test accounts:');
  console.log('  NGO Admin: username=admin, password=admin123');
  console.log('  Store: username=store1, password=store123');
  console.log('  Homeless: username=homeless1, password=homeless123');
  console.log('  NGO Partner: username=ngo_partner, password=partner123');
  console.log('  Association: username=association, password=assoc123\n');
});

export default app;
