import express from 'express';
import { HomelessModel } from '../models/users.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// 模擬交易記錄資料庫
const transactions = [];

// 建立交易（扣點）
router.post('/', async (req, res) => {
  try {
    const { homelessQrCode, storeQrCode, amount, productName } = req.body;

    // 驗證輸入
    if (!homelessQrCode || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: '請提供完整的交易資訊'
      });
    }

    // 查找街友
    const homeless = HomelessModel.findByQrCode(homelessQrCode);

    if (!homeless) {
      return res.status(404).json({
        success: false,
        message: '找不到街友資訊'
      });
    }

    // 檢查餘額
    if (homeless.balance < amount) {
      return res.status(400).json({
        success: false,
        message: '餘額不足'
      });
    }

    // 扣除點數
    const newBalance = homeless.balance - amount;
    HomelessModel.updateBalance(homeless.id, newBalance);

    // 記錄交易
    const transaction = {
      id: transactions.length + 1,
      homelessQrCode,
      storeQrCode,
      amount,
      productName,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };

    transactions.push(transaction);

    res.json({
      success: true,
      message: '交易成功',
      data: {
        transaction,
        newBalance
      }
    });
  } catch (error) {
    console.error('Transaction error:', error);
    res.status(500).json({
      success: false,
      message: '交易失敗'
    });
  }
});

// 取得交易記錄
router.get('/', authenticateToken, (req, res) => {
  try {
    const { qrCode } = req.query;

    let filteredTransactions = transactions;

    if (qrCode) {
      filteredTransactions = transactions.filter(
        t => t.homelessQrCode === qrCode || t.storeQrCode === qrCode
      );
    }

    res.json({
      success: true,
      data: filteredTransactions
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: '伺服器錯誤'
    });
  }
});

export default router;
