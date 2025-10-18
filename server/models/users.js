import bcrypt from 'bcryptjs';

// 模擬資料庫 - 實際應用應使用真實資料庫
const users = [
  {
    id: 1,
    username: 'admin',
    password: bcrypt.hashSync('admin123', 10),
    role: 'ngo_admin',
    name: 'NGO 管理員',
    email: 'admin@ngo.org'
  },
  {
    id: 2,
    username: 'store1',
    password: bcrypt.hashSync('store123', 10),
    role: 'store',
    name: 'ABC餐廳',
    storeId: 'STORE_001',
    qrCode: 'STORE_QR_001',
    address: '台北市大安區和平東路123號',
    phone: '02-2345-6789'
  },
  {
    id: 3,
    username: 'homeless1',
    password: bcrypt.hashSync('homeless123', 10),
    role: 'homeless',
    name: '張小明',
    idNumber: 'A123456789',
    qrCode: 'QR_001',
    balance: 150
  },
  {
    id: 4,
    username: 'ngo_partner',
    password: bcrypt.hashSync('partner123', 10),
    role: 'ngo_partner',
    name: 'NGO 夥伴',
    email: 'partner@ngo.org'
  },
  {
    id: 5,
    username: 'association',
    password: bcrypt.hashSync('assoc123', 10),
    role: 'association_admin',
    name: '協會管理員',
    associationName: '台北市街友關懷協會'
  }
];

// 街友資料
const homelessUsers = [
  {
    id: 'A123456789',
    name: '張小明',
    idNumber: 'A123456789',
    qrCode: 'QR_001',
    balance: 150,
    phone: '0912-345-678'
  },
  {
    id: 'B234567890',
    name: '李大華',
    idNumber: 'B234567890',
    qrCode: 'QR_002',
    balance: 200,
    phone: '0923-456-789'
  }
];

// 店家資料
const stores = [
  {
    id: 'STORE_001',
    name: 'ABC餐廳',
    qrCode: 'STORE_QR_001',
    address: '台北市大安區和平東路123號',
    phone: '02-2345-6789',
    products: [
      { id: 1, name: '午餐套餐', points: 80, description: '主菜+湯+飲料' },
      { id: 2, name: '早餐組合', points: 50, description: '三明治+咖啡' },
      { id: 3, name: '晚餐套餐', points: 100, description: '雙主菜+湯+飲料+甜點' },
      { id: 4, name: '單點飲料', points: 20, description: '任選一杯飲料' }
    ]
  },
  {
    id: 'STORE_002',
    name: 'XYZ洗衣店',
    qrCode: 'STORE_QR_002',
    address: '台北市中正區羅斯福路456號',
    phone: '02-3456-7890',
    products: [
      { id: 1, name: '洗衣券', points: 50, description: '一般衣物洗滌' },
      { id: 2, name: '燙衣服務', points: 30, description: '單件燙衣' }
    ]
  }
];

export const UserModel = {
  findByUsername: (username) => {
    return users.find(u => u.username === username);
  },

  findById: (id) => {
    return users.find(u => u.id === id);
  },

  validatePassword: (plainPassword, hashedPassword) => {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  },

  // 取得用戶資訊（不包含密碼）
  getUserInfo: (user) => {
    const { password, ...userInfo } = user;
    return userInfo;
  }
};

export const HomelessModel = {
  findByQrCode: (qrCode) => {
    return homelessUsers.find(h => h.qrCode === qrCode);
  },

  findById: (id) => {
    return homelessUsers.find(h => h.id === id);
  },

  updateBalance: (id, newBalance) => {
    const user = homelessUsers.find(h => h.id === id);
    if (user) {
      user.balance = newBalance;
      return true;
    }
    return false;
  },

  getAll: () => {
    return homelessUsers;
  }
};

export const StoreModel = {
  findByQrCode: (qrCode) => {
    return stores.find(s => s.qrCode === qrCode);
  },

  findById: (id) => {
    return stores.find(s => s.id === id);
  },

  getAll: () => {
    return stores;
  }
};
