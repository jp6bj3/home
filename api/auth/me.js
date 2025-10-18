import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { jwtConfig } from '../../lib/config/jwt.js';
import { UserModel } from '../../lib/models/users.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: '未提供認證 token'
      });
    }

    const decoded = jwt.verify(token, jwtConfig.secret);
    const user = UserModel.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用戶不存在'
      });
    }

    res.json({
      success: true,
      user: UserModel.getUserInfo(user)
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token 已過期',
        expired: true
      });
    }
    return res.status(403).json({
      success: false,
      message: '無效的 token'
    });
  }
}
