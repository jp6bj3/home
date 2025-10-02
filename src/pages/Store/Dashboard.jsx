import React, { useState } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import ProductForm from '../../components/Forms/ProductForm';

const StoreDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('products');

  const tabs = [
    { id: 'products', name: '商品管理', icon: '🛍️' },
    { id: 'scanner', name: '掃描扣點', icon: '📱' },
    { id: 'reports', name: '收入報表', icon: '💰' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'products':
        return <ProductManagement />;
      case 'scanner':
        return <QRScanner />;
      case 'reports':
        return <IncomeReports />;
      default:
        return <ProductManagement />;
    }
  };

  return (
    <MainLayout title="店家控制台" user={user} onLogout={onLogout}>
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

const ProductManagement = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState([
    { 
      id: 1, 
      name: '午餐套餐', 
      points: 80, 
      category: '餐點', 
      status: 'active',
      description: '豐盛的午餐套餐，包含主菜、湯品和小菜',
      createdAt: '2024-01-15'
    },
    { 
      id: 2, 
      name: '洗衣券', 
      points: 50, 
      category: '服務', 
      status: 'active',
      description: '可在合作洗衣店使用的洗衣服務券',
      createdAt: '2024-01-20'
    },
    { 
      id: 3, 
      name: '理髮服務', 
      points: 100, 
      category: '服務', 
      status: 'active',
      description: '專業理髮師提供的理髮服務',
      createdAt: '2024-02-01'
    }
  ]);

  const handleSave = (productData) => {
    if (editingProduct) {
      setProducts(list => list.map(product => 
        product.id === editingProduct.id ? productData : product
      ));
    } else {
      setProducts(list => [...list, productData]);
    }
    setShowAddForm(false);
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingProduct(null);
  };

  const handleDelete = (productId) => {
    if (confirm('確定要刪除這個商品嗎？')) {
      setProducts(list => list.filter(product => product.id !== productId));
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getStatusText = (status) => {
    return status === 'active' ? '上架' : '下架';
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">商品與服務管理</h3>
            <p className="text-sm text-gray-600">目前有 {products.length} 項商品/服務</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            新增商品
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-lg font-medium text-gray-900">{product.name}</h4>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                    {getStatusText(product.status)}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">所需點數：</span>
                    <span className="text-lg font-semibold text-blue-600">{product.points} 點</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">分類：</span>
                    <span className="text-sm font-medium">{product.category}</span>
                  </div>
                </div>
                
                {product.description && (
                  <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                )}
                
                <div className="flex justify-between">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                  >
                    編輯
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                  >
                    刪除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">尚無商品</h3>
            <p className="mt-1 text-sm text-gray-500">開始建立您的第一個商品或服務</p>
            <div className="mt-6">
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                新增商品
              </button>
            </div>
          </div>
        )}
      </div>

      <ProductForm
        product={editingProduct}
        onSave={handleSave}
        onCancel={handleCancel}
        isOpen={showAddForm}
      />
    </>
  );
};

const QRScanner = () => {
  const [scannedUser, setScannedUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [customAmount, setCustomAmount] = useState('');

  const mockUser = {
    name: '張小明',
    id: 'A123456789',
    balance: 150
  };

  const products = [
    { id: 1, name: '午餐套餐', points: 80 },
    { id: 2, name: '洗衣券', points: 50 },
    { id: 3, name: '理髮服務', points: 100 }
  ];

  const handleScan = () => {
    setScannedUser(mockUser);
  };

  const handleTransaction = () => {
    alert('交易完成！');
    setScannedUser(null);
    setSelectedProduct('');
    setCustomAmount('');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-4">掃描街友 QR Code</h3>
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-12">
          <div className="text-center">
            <div className="text-6xl mb-4">📱</div>
            <p className="text-gray-600 mb-4">請掃描街友的 QR Code</p>
            <button
              onClick={handleScan}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 text-lg"
            >
              模擬掃描
            </button>
          </div>
        </div>
      </div>

      {scannedUser && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-green-900 mb-4">掃描成功！</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">姓名</label>
              <p className="text-lg font-semibold">{scannedUser.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">身分證字號</label>
              <p className="text-lg font-semibold">{scannedUser.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">可用餘額</label>
              <p className="text-lg font-semibold text-green-600">{scannedUser.balance} 點</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">選擇商品</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">請選擇商品...</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {product.points} 點
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">或輸入自訂金額</label>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="輸入扣除點數"
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleTransaction}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                disabled={!selectedProduct && !customAmount}
              >
                確認扣點
              </button>
              <button
                onClick={() => setScannedUser(null)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const IncomeReports = () => {
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  const mockTransactions = [
    { id: 1, date: '2025-10-02 12:30', product: '午餐套餐', amount: 80 },
    { id: 2, date: '2025-10-02 14:15', product: '洗衣券', amount: 50 },
    { id: 3, date: '2025-10-01 11:45', product: '理髮服務', amount: 100 }
  ];

  const totalIncome = mockTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-6 rounded-lg">
        <h4 className="text-lg font-medium text-blue-900">今日收入統計</h4>
        <p className="text-3xl font-bold text-blue-600 mt-2">{totalIncome} 點</p>
        <p className="text-sm text-blue-700">共 {mockTransactions.length} 筆交易</p>
      </div>

      <div className="flex space-x-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700">開始日期</label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
            className="mt-1 border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">結束日期</label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
            className="mt-1 border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          查詢
        </button>
        <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
          匯出報表
        </button>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                日期時間
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                購買商品
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                售價 (點數)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.product}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoreDashboard;