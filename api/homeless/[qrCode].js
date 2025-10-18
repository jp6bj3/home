import { HomelessModel } from '../../lib/models/users.js';

export default async function handler(req, res) {
  const { qrCode } = req.query;

  if (req.method === 'GET') {
    // 取得街友資訊（公開）
    try {
      console.log('=== Homeless API Debug ===');
      console.log('Received qrCode:', qrCode);
      console.log('HomelessModel type:', typeof HomelessModel);
      console.log('HomelessModel.findByQrCode type:', typeof HomelessModel.findByQrCode);

      const homeless = HomelessModel.findByQrCode(qrCode);
      console.log('Found homeless:', homeless);

      if (!homeless) {
        console.log('Homeless not found for qrCode:', qrCode);
        return res.status(404).json({
          success: false,
          message: '找不到該街友資訊'
        });
      }

      console.log('Returning homeless data successfully');
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
