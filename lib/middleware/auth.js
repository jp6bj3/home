import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.js';
import { UserModel } from '../models/users.js';

// 驗證 Access Token
export const authenticateToken = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: '未提供認證 token'
    });
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    const user = UserModel.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用戶不存在'
      });
    }

    req.user = UserModel.getUserInfo(user);
    next();
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
};

// 驗證角色
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: '權限不足'
      });
    }
    next();
  };
};

// 可選的認證（允許未登入用戶訪問，但如果有 token 則驗證）
export const optionalAuth = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    const user = UserModel.findById(decoded.userId);
    req.user = user ? UserModel.getUserInfo(user) : null;
  } catch (error) {
    req.user = null;
  }

  next();
};
