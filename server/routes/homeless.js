import express from 'express';
import { HomelessModel } from '../models/users.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// 取得街友資訊（公開 - 用於 QR code 掃描）
router.get('/:qrCode', (req, res) => {
  try {
    const { qrCode } = req.params;
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
});

// 取得所有街友列表（需要 NGO 權限）
router.get('/', authenticateToken, authorizeRoles('ngo_admin', 'ngo_partner'), (req, res) => {
  try {
    const homelessList = HomelessModel.getAll();

    res.json({
      success: true,
      data: homelessList
    });
  } catch (error) {
    console.error('Get all homeless error:', error);
    res.status(500).json({
      success: false,
      message: '伺服器錯誤'
    });
  }
});

// 更新街友餘額（需要認證）
router.patch('/:id/balance', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { newBalance } = req.body;

    if (typeof newBalance !== 'number' || newBalance < 0) {
      return res.status(400).json({
        success: false,
        message: '無效的餘額金額'
      });
    }

    const success = HomelessModel.updateBalance(id, newBalance);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: '找不到該街友'
      });
    }

    res.json({
      success: true,
      message: '餘額更新成功',
      data: { id, newBalance }
    });
  } catch (error) {
    console.error('Update balance error:', error);
    res.status(500).json({
      success: false,
      message: '伺服器錯誤'
    });
  }
});

export default router;
