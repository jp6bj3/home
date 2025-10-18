import { HomelessModel } from '../lib/models/users.js';

// 模擬交易記錄（Serverless 環境每次請求都是新的實例，實際應使用資料庫）
// 這裡僅作為示範，實際部署需要連接資料庫
let transactions = [];

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // 建立交易（扣點）
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
        id: Date.now(),
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
  } else if (req.method === 'GET') {
    // 取得交易記錄（需認證，這裡暫時省略認證）
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
  } else {
    res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }
}
