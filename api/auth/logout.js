export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  // 清除 cookies
  res.setHeader('Set-Cookie', [
    'accessToken=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax',
    'refreshToken=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax'
  ]);

  res.json({
    success: true,
    message: '登出成功'
  });
}
