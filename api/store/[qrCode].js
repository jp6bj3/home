import { StoreModel } from '../../lib/models/users.js';

export default async function handler(req, res) {
  const { qrCode } = req.query;

  if (req.method === 'GET') {
    // 取得店家資訊（公開）
    try {
      console.log('=== Store API Debug ===');
      console.log('Received qrCode:', qrCode);
      console.log('StoreModel type:', typeof StoreModel);
      console.log('StoreModel.findByQrCode type:', typeof StoreModel.findByQrCode);

      const store = StoreModel.findByQrCode(qrCode);
      console.log('Found store:', store);

      if (!store) {
        console.log('Store not found for qrCode:', qrCode);
        return res.status(404).json({
          success: false,
          message: '找不到該店家資訊'
        });
      }

      console.log('Returning store data successfully');
      res.json({
        success: true,
        data: store
      });
    } catch (error) {
      console.error('Get store error:', error);
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
