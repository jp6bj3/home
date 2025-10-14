import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

const HomelessDashboard = ({ user, onLogout }) => {
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // 模擬無家者資料
  const homelessData = {
    name: '張小明',
    idNumber: 'A123456789',
    qrCode: 'QR_001',
    balance: 150,
    recentTransactions: [
      { id: 1, date: '2025-10-02', store: 'ABC餐廳', item: '午餐套餐', points: -80, type: 'expense' },
      { id: 2, date: '2025-10-01', store: 'NGO分配', item: '捐款分配', points: +100, type: 'income' },
      { id: 3, date: '2025-09-30', store: '洗衣店', item: '洗衣服務', points: -50, type: 'expense' },
      { id: 4, date: '2025-09-29', store: 'NGO分配', item: '捐款分配', points: +80, type: 'income' }
    ],
    emergencyContacts: [
      { name: 'NGO 辦公室', phone: '02-1234-5678' },
      { name: '社工師 王小美', phone: '0987-654-321' }
    ]
  };

  // 生成 QR Code
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        setIsLoading(true);
        // 生成掃描 URL
        const scanUrl = `${window.location.origin}/scan/${homelessData.qrCode}`;

        const dataURL = await QRCode.toDataURL(scanUrl, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff'
          },
          errorCorrectionLevel: 'H'
        });

        setQrCodeDataURL(dataURL);
      } catch (error) {
        console.error('QR Code generation failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    generateQRCode();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-green-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-xl">🏠</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">我的帳戶</h1>
                <p className="text-sm text-gray-600">歡迎，{homelessData.name}</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md transition-colors"
            >
              登出
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* 餘額卡片 */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-green-100 text-sm">目前餘額</p>
              <p className="text-3xl font-bold">{homelessData.balance} 點</p>
              <p className="text-green-100 text-sm mt-1">可用於合作店家消費</p>
            </div>
            <div className="text-right">
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* QR Code 卡片 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">📱</span>
              我的 QR Code
            </h3>
            
            <div className="text-center">
              {isLoading ? (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <img 
                        src={qrCodeDataURL} 
                        alt="我的 QR Code" 
                        className="w-48 h-48"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium">使用說明：</p>
                    <p className="text-sm text-blue-700 mt-1">
                      • 在合作店家出示此 QR Code<br/>
                      • 店家掃描後即可扣除相應點數<br/>
                      • 如果 QR Code 遺失請聯繫 NGO
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 個人資訊 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">👤</span>
              個人資訊
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">姓名</span>
                <span className="font-medium">{homelessData.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">身分證號</span>
                <span className="font-medium">{homelessData.idNumber}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">QR Code 編號</span>
                <span className="font-medium">{homelessData.qrCode}</span>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">緊急聯絡人</h4>
                {homelessData.emergencyContacts.map((contact, index) => (
                  <div key={index} className="flex justify-between items-center py-2 bg-gray-50 rounded-lg px-3 mb-2">
                    <span className="text-sm text-gray-700">{contact.name}</span>
                    <a 
                      href={`tel:${contact.phone}`}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {contact.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 消費記錄 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">📊</span>
            最近消費記錄
          </h3>
          
          <div className="space-y-3">
            {homelessData.recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                    transaction.type === 'income' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '💰' : '🛍️'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.item}</p>
                    <p className="text-sm text-gray-600">{transaction.store}</p>
                    <p className="text-xs text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <div className={`text-right ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <p className="font-semibold">
                    {transaction.type === 'income' ? '+' : ''}{transaction.points} 點
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-center">
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              查看更多記錄
            </button>
          </div>
        </div>

        {/* 使用須知 */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-amber-800 mb-3 flex items-center">
            <span className="mr-2">⚠️</span>
            重要須知
          </h3>
          <div className="space-y-2 text-sm text-amber-700">
            <p>• 請妥善保管您的 QR Code，不要與他人分享</p>
            <p>• 消費前請確認餘額是否足夠</p>
            <p>• 如有任何問題請聯繫緊急聯絡人</p>
            <p>• QR Code 如有遺失請立即通知 NGO 重新補發</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomelessDashboard;