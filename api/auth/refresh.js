import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { jwtConfig } from '../../lib/config/jwt.js';
import { UserModel } from '../../lib/models/users.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const refreshToken = cookies.refreshToken;

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
    res.setHeader('Set-Cookie',
      `accessToken=${newAccessToken}; HttpOnly; Path=/; Max-Age=${15 * 60}; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
    );

    res.json({
      success: true,
      message: 'Token 已刷新'
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      res.setHeader('Set-Cookie', [
        'accessToken=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax',
        'refreshToken=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax'
      ]);
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
}
