import jwt from 'jsonwebtoken';
import { jwtConfig } from '../../lib/config/jwt.js';
import { UserModel } from '../../lib/models/users.js';

export default async function handler(req, res) {
  // 只允許 POST 請求
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

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
    res.setHeader('Set-Cookie', [
      `accessToken=${accessToken}; HttpOnly; Path=/; Max-Age=${15 * 60}; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`,
      `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
    ]);

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
}
