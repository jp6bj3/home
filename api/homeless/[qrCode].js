import { HomelessModel } from '../../lib/models/users.js';

export default async function handler(req, res) {
  const { qrCode } = req.query;

  if (req.method === 'GET') {
    // 取得街友資訊（公開）
    try {
      const homeless = HomelessModel.findByQrCode(qrCode);

      if (!homeless) {
        return res.status(404).json({
          success: false,
          message: '找不到該街友資訊'
        });
      }

      res.json({
        success: true,
        data: homeless
      });
    } catch (error) {
      console.error('Get homeless error:', error);
      res.status(500).json({
        success: false,
        message: '伺服器錯誤'
      });
    }
  } else {
    res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }
}
