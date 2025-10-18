import express from 'express';
import { StoreModel } from '../models/users.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// 取得店家資訊（公開 - 用於 QR code 掃描）
router.get('/:qrCode', (req, res) => {
  try {
    const { qrCode } = req.params;
    const store = StoreModel.findByQrCode(qrCode);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: '找不到該店家資訊'
      });
    }

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
});

// 取得所有店家列表（需要 NGO 權限）
router.get('/', authenticateToken, authorizeRoles('ngo_admin', 'ngo_partner'), (req, res) => {
  try {
    const stores = StoreModel.getAll();

    res.json({
      success: true,
      data: stores
    });
  } catch (error) {
    console.error('Get all stores error:', error);
    res.status(500).json({
      success: false,
      message: '伺服器錯誤'
    });
  }
});

export default router;
