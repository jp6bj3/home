import React, { useState } from 'react';
import MainLayout from '../../components/Layout/MainLayout';

const AssociationDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('reports');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  const tabs = [
    { id: 'reports', name: '商圈報表', icon: '📊' },
    { id: 'stores', name: '合作店家', icon: '🏪' },
    { id: 'accounts', name: '帳號管理', icon: '👥' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'reports':
        return <DistrictReports dateRange={dateRange} setDateRange={setDateRange} />;
      case 'stores':
        return <PartnerStores />;
      case 'accounts':
        return <AccountManagement />;
      default:
        return <DistrictReports dateRange={dateRange} setDateRange={setDateRange} />;
    }
  };

  return (
    <MainLayout title="商圈協會控制台" user={user} onLogout={onLogout}>
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </MainLayout>
  );
};

const DistrictReports = ({ dateRange, setDateRange }) => {
  const mockData = {
    totalTransactions: 156,
    totalAmount: 12400,
    storeCount: 8,
    topStores: [
      { name: 'ABC餐廳', transactions: 45, amount: 3600 },
      { name: '小明洗衣店', transactions: 32, amount: 1600 },
      { name: '溫暖理髮店', transactions: 28, amount: 2800 },
      { name: 'DEF便利商店', transactions: 25, amount: 2000 }
    ],
    recentTransactions: [
      { id: 1, date: '2025-10-02 15:20', item: '洗衣券', points: 50, store: 'ABC洗衣店', user: '張小明' },
      { id: 2, date: '2025-10-02 14:15', item: '午餐套餐', points: 80, store: 'DEF餐廳', user: '李小華' },
      { id: 3, date: '2025-10-02 13:30', item: '理髮服務', points: 100, store: '理髮店', user: '王小美' },
      { id: 4, date: '2025-10-02 12:45', item: '便當', points: 75, store: 'GHI便當店', user: '陳小強' }
    ]
  };

  return (
    <div className="space-y-6">
      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center">
                <span className="text-white text-sm">📊</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-900">總交易數</p>
              <p className="text-2xl font-semibold text-blue-600">{mockData.totalTransactions}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-green-600 rounded-md flex items-center justify-center">
                <span className="text-white text-sm">💰</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-900">總消費點數</p>
              <p className="text-2xl font-semibold text-green-600">{mockData.totalAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-purple-600 rounded-md flex items-center justify-center">
                <span className="text-white text-sm">🏪</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-900">合作店家</p>
              <p className="text-2xl font-semibold text-purple-600">{mockData.storeCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-orange-600 rounded-md flex items-center justify-center">
                <span className="text-white text-sm">📈</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-orange-900">平均每筆</p>
              <p className="text-2xl font-semibold text-orange-600">
                {Math.round(mockData.totalAmount / mockData.totalTransactions)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 日期篩選 */}
      <div className="flex space-x-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">開始日期</label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">結束日期</label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          查詢
        </button>
        <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
          匯出 Excel
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 熱門店家 */}
        <div className="bg-white border rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">熱門店家排行</h4>
          <div className="space-y-4">
            {mockData.topStores.map((store, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{store.name}</p>
                    <p className="text-sm text-gray-500">{store.transactions} 筆交易</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{store.amount.toLocaleString()} 點</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 最近交易 */}
        <div className="bg-white border rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">最近交易紀錄</h4>
          <div className="space-y-3">
            {mockData.recentTransactions.map((transaction) => (
              <div key={transaction.id} className="border-l-4 border-blue-400 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{transaction.item}</p>
                    <p className="text-sm text-gray-500">{transaction.store}</p>
                    <p className="text-xs text-gray-400">{transaction.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">{transaction.points} 點</p>
                    <p className="text-xs text-gray-500">{transaction.user}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 詳細交易記錄表格 */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">商圈捐款花費明細</h4>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                日期時間
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                兌換商品
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                兌換點數
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                兌換店家
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                兌換者
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockData.recentTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.item}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                  {transaction.points}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.store}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.user}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PartnerStores = () => {
  const stores = [
    { id: 1, name: 'ABC餐廳', category: '餐飲', address: '台北市中正區', phone: '02-1234-5678', status: 'active' },
    { id: 2, name: '小明洗衣店', category: '服務', address: '台北市萬華區', phone: '02-2345-6789', status: 'active' },
    { id: 3, name: '溫暖理髮店', category: '服務', address: '台北市大同區', phone: '02-3456-7890', status: 'active' },
    { id: 4, name: 'DEF便利商店', category: '零售', address: '台北市中山區', phone: '02-4567-8901', status: 'inactive' }
  ];

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getStatusText = (status) => {
    return status === 'active' ? '營業中' : '暫停合作';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">合作店家管理</h3>
          <p className="text-sm text-gray-600">目前有 {stores.filter(s => s.status === 'active').length} 家店家合作中</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <div key={store.id} className="bg-white rounded-lg shadow-md border">
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-lg font-medium text-gray-900">{store.name}</h4>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(store.status)}`}>
                  {getStatusText(store.status)}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {store.category}
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {store.address}
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {store.phone}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AccountManagement = () => {
  const accounts = [
    { id: 1, username: 'partner001', name: '王小美', role: '協會夥伴', status: 'active', lastLogin: '2025-10-02 09:30' },
    { id: 2, username: 'partner002', name: '李大明', role: '協會夥伴', status: 'active', lastLogin: '2025-10-01 16:45' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">協會夥伴帳號管理</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          新增夥伴帳號
        </button>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                使用者資訊
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                角色
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                最後登入
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                狀態
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {accounts.map((account) => (
              <tr key={account.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{account.name}</div>
                    <div className="text-sm text-gray-500">{account.username}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {account.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {account.lastLogin}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    啟用
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-4">
                    編輯
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    停用
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssociationDashboard;