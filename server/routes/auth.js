import express from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.js';
import { UserModel } from '../models/users.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// 登入
router.post('/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // 驗證輸入
    if (!username || !password || !role) {
      return res.status(400).json({
        success: false,
        message: '請提供完整的登入資訊'
      });
    }

    // 查找用戶
    const user = UserModel.findByUsername(username);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '帳號或密碼錯誤'
      });
    }

    // 驗證角色
    if (user.role !== role) {
      return res.status(401).json({
        success: false,
        message: '角色不符'
      });
    }

    // 驗證密碼
    const isPasswordValid = UserModel.validatePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '帳號或密碼錯誤'
      });
    }

    // 生成 tokens
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      jwtConfig.secret,
      { expiresIn: jwtConfig.accessExpiry }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      jwtConfig.refreshSecret,
      { expiresIn: jwtConfig.refreshExpiry }
    );

    // 設定 cookies
    res.cookie('accessToken', accessToken, {
      ...jwtConfig.cookieOptions,
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, jwtConfig.cookieOptions);

    // 返回用戶資訊
    const userInfo = UserModel.getUserInfo(user);

    res.json({
      success: true,
      message: '登入成功',
      user: userInfo
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: '伺服器錯誤'
    });
  }
});

// 登出
router.post('/logout', (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.json({
    success: true,
    message: '登出成功'
  });
});

// 刷新 token
router.post('/refresh', (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: '未提供 refresh token'
      });
    }

    // 驗證 refresh token
    const decoded = jwt.verify(refreshToken, jwtConfig.refreshSecret);
    const user = UserModel.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用戶不存在'
      });
    }

    // 生成新的 access token
    const newAccessToken = jwt.sign(
      { userId: user.id, role: user.role },
      jwtConfig.secret,
      { expiresIn: jwtConfig.accessExpiry }
    );

    // 設定新的 access token cookie
    res.cookie('accessToken', newAccessToken, {
      ...jwtConfig.cookieOptions,
      maxAge: 15 * 60 * 1000
    });

    res.json({
      success: true,
      message: 'Token 已刷新'
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return res.status(401).json({
        success: false,
        message: 'Refresh token 已過期，請重新登入'
      });
    }

    res.status(403).json({
      success: false,
      message: '無效的 refresh token'
    });
  }
});

// 取得當前用戶資訊
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// 驗證 token（檢查登入狀態）
router.get('/verify', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Token 有效',
    user: req.user
  });
});

export default router;
