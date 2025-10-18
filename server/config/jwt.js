import dotenv from 'dotenv';

dotenv.config();

export const jwtConfig = {
  secret: process.env.JWT_SECRET || '@JWT_SECRET',
  refreshSecret: process.env.JWT_REFRESH_SECRET || '@JWT_REFRESH_SECRET',
  accessExpiry: process.env.JWT_ACCESS_EXPIRY || '@JWT_ACCESS_EXPIRY',
  refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '@JWT_REFRESH_EXPIRYS',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
};
