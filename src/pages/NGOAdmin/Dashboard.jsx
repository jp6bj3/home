import React, { useState } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import TabNavigation from '../../components/Layout/TabNavigation';
import HomelessForm from '../../components/Forms/HomelessForm';
import QRCodeModal from '../../components/QRCode/QRCodeModal';

const NGOAdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('homeless');

  const tabs = [
    { id: 'homeless', name: '遊民管理', icon: '👥' },
    { id: 'donations', name: '捐款管理', icon: '💰' },
    { id: 'reports', name: '報表查詢', icon: '📊' },
    { id: 'accounts', name: '帳號管理', icon: '⚙️' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'homeless':
        return <HomelessManagement />;
      case 'donations':
        return <DonationManagement />;
      case 'reports':
        return <ReportsView />;
      case 'accounts':
        return <AccountManagement />;
      default:
        return <HomelessManagement />;
    }
  };

  return (
    <MainLayout title="NGO 管理員控制台" user={user} onLogout={onLogout}>
      <div className="bg-white shadow rounded-lg">
        <TabNavigation 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="px-6"
        />
        <div className="p-4 sm:p-6">
          {renderTabContent()}
        </div>
      </div>
    </MainLayout>
  );
};

const HomelessManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [showQRCode, setShowQRCode] = useState(null);
  const [homelessList, setHomelessList] = useState([
    {
      id: 1,
      name: '張小明',
      idNumber: 'A123456789',
      phone: '0912345678',
      address: '台北車站',
      balance: 150,
      qrCode: 'QR_001',
      status: 'active',
      emergencyContact: '張大明',
      emergencyPhone: '0987654321',
      notes: '需要定期醫療照護',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: '李小華',
      idNumber: 'B987654321',
      phone: '0923456789',
      address: '萬華區',
      balance: 80,
      qrCode: 'QR_002',
      status: 'active',
      emergencyContact: '李大華',
      emergencyPhone: '0976543210',
      notes: '',
      createdAt: '2024-02-20'
    }
  ]);

  const filteredList = homelessList.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.idNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (personData) => {
    if (editingPerson) {
      setHomelessList(list => list.map(person => 
        person.id === editingPerson.id ? personData : person
      ));
    } else {
      setHomelessList(list => [...list, personData]);
    }
    setShowAddForm(false);
    setEditingPerson(null);
  };

  const handleEdit = (person) => {
    setEditingPerson(person);
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingPerson(null);
  };

  const handleReissueQR = (person) => {
    const newQRCode = `QR_${Date.now()}`;
    setHomelessList(list => list.map(p => 
      p.id === person.id ? {...p, qrCode: newQRCode} : p
    ));
    alert(`已為 ${person.name} 重新生成 QR Code: ${newQRCode}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return '啟用';
      case 'inactive': return '停用';
      case 'suspended': return '暫停';
      default: return status;
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">遊民資料管理</h3>
            <p className="text-sm text-gray-600">目前管理 {homelessList.length} 位遊民</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            新增遊民資料
          </button>
        </div>

        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="搜尋姓名或身分證字號..."
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
            <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            搜尋
          </button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  基本資料
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  聯絡方式
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  餘額
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
              {filteredList.map((person) => (
                <tr key={person.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {person.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {person.idNumber}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{person.phone || '未提供'}</div>
                    <div className="text-sm text-gray-500">{person.address || '未提供'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-lg font-semibold text-green-600">
                      {person.balance} 點
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(person.status)}`}>
                      {getStatusText(person.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => setShowQRCode(person)}
                      className="text-green-600 hover:text-green-900"
                      title="查看 QR Code"
                    >
                      <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleEdit(person)}
                      className="text-blue-600 hover:text-blue-900"
                      title="編輯"
                    >
                      <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleReissueQR(person)}
                      className="text-orange-600 hover:text-orange-900"
                      title="補發 QR Code"
                    >
                      <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {filteredList.map((person) => (
            <div key={person.id} className="bg-white rounded-lg shadow border p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{person.name}</h4>
                  <p className="text-sm text-gray-500">{person.idNumber}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(person.status)}`}>
                  {getStatusText(person.status)}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">手機：</span>
                  <span className="text-sm text-gray-900">{person.phone || '未提供'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">地址：</span>
                  <span className="text-sm text-gray-900 truncate ml-2">{person.address || '未提供'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">餘額：</span>
                  <span className="text-lg font-semibold text-green-600">{person.balance} 點</span>
                </div>
              </div>
              
              <div className="flex justify-between space-x-2">
                <button
                  onClick={() => setShowQRCode(person)}
                  className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-green-200 transition-colors"
                >
                  查看 QR
                </button>
                <button
                  onClick={() => handleEdit(person)}
                  className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors"
                >
                  編輯
                </button>
                <button
                  onClick={() => handleReissueQR(person)}
                  className="flex-1 bg-orange-100 text-orange-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-orange-200 transition-colors"
                >
                  補發 QR
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredList.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? '找不到符合條件的資料' : '尚無遊民資料'}
          </div>
        )}
      </div>

      <HomelessForm
        person={editingPerson}
        onSave={handleSave}
        onCancel={handleCancel}
        isOpen={showAddForm}
      />
      
      <QRCodeModal
        person={showQRCode}
        isOpen={!!showQRCode}
        onClose={() => setShowQRCode(null)}
      />
    </>
  );
};

const DonationManagement = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h4 className="text-lg font-medium text-blue-900">總捐款餘額</h4>
          <p className="text-3xl font-bold text-blue-600 mt-2">NT$ 45,000</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h4 className="text-lg font-medium text-green-900">已分配金額</h4>
          <p className="text-3xl font-bold text-green-600 mt-2">NT$ 32,000</p>
        </div>
        <div className="bg-yellow-50 p-6 rounded-lg">
          <h4 className="text-lg font-medium text-yellow-900">待分配金額</h4>
          <p className="text-3xl font-bold text-yellow-600 mt-2">NT$ 13,000</p>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">分配捐款</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              選擇遊民
            </label>
            <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
              <option>掃描 QR Code 或手動選擇</option>
              <option>張小明 (A123456789)</option>
              <option>李小華 (B987654321)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              分配金額/點數
            </label>
            <input
              type="number"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="輸入金額或點數"
            />
          </div>
        </div>
        <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700">
          確認分配
        </button>
      </div>
    </div>
  );
};

const ReportsView = () => {
  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <input
          type="date"
          className="border border-gray-300 rounded-md px-3 py-2"
        />
        <span className="self-center">至</span>
        <input
          type="date"
          className="border border-gray-300 rounded-md px-3 py-2"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          查詢
        </button>
        <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
          匯出 Excel
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
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                2025-10-02 15:20
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                洗衣券
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                50
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                XX洗衣店
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                張小明
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AccountManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">NGO 夥伴帳號管理</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          新增夥伴帳號
        </button>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                使用者名稱
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                姓名
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                權限
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
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                partner001
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                王小美
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                查詢/分配
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
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NGOAdminDashboard;