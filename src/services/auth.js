import api from './api';

export const authService = {
  // 登入
  login: async (username, password, role) => {
    const response = await api.post('/auth/login', {
      username,
      password,
      role
    });
    return response.data;
  },

  // 登出
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // 取得當前用戶資訊
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // 驗證 token
  verifyToken: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },

  // 刷新 token
  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  }
};

export const homelessService = {
  // 根據 QR code 取得街友資訊
  getByQrCode: async (qrCode) => {
    const response = await api.get(`/homeless/${qrCode}`);
    return response.data;
  },

  // 取得所有街友列表
  getAll: async () => {
    const response = await api.get('/homeless');
    return response.data;
  },

  // 更新街友餘額
  updateBalance: async (id, newBalance) => {
    const response = await api.patch(`/homeless/${id}/balance`, {
      newBalance
    });
    return response.data;
  }
};

export const storeService = {
  // 根據 QR code 取得店家資訊
  getByQrCode: async (qrCode) => {
    const response = await api.get(`/store/${qrCode}`);
    return response.data;
  },

  // 取得所有店家列表
  getAll: async () => {
    const response = await api.get('/store');
    return response.data;
  }
};

export const transactionService = {
  // 建立交易
  create: async (transactionData) => {
    const response = await api.post('/transaction', transactionData);
    return response.data;
  },

  // 取得交易記錄
  getTransactions: async (qrCode) => {
    const response = await api.get('/transaction', {
      params: { qrCode }
    });
    return response.data;
  }
};
