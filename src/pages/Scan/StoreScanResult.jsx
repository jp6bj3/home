import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const StoreScanResult = () => {
  const { storeQrCode } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [storeData, setStoreData] = useState(null);
  const [homelessInfo, setHomelessInfo] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showHomelessInput, setShowHomelessInput] = useState(false);
  const [homelessQrCode, setHomelessQrCode] = useState('');

  useEffect(() => {
    // 模擬從後端獲取店家資料
    const fetchStoreData = async () => {
      try {
        setIsLoading(true);
        // TODO: 實際應該呼叫 API: await fetch(`/api/store/${storeQrCode}`)
        await new Promise(resolve => setTimeout(resolve, 500));

        if (storeQrCode === 'STORE_QR_001') {
          setStoreData({
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
          });
        } else {
          setError('無效的店家 QR Code');
        }
      } catch (err) {
        setError('載入店家資料失敗，請稍後再試');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreData();
  }, [storeQrCode]);

  const handleHomelessLogin = async () => {
    if (!homelessQrCode.trim()) {
      alert('請輸入您的街友 QR Code');
      return;
    }

    try {
      setIsLoading(true);
      // TODO: 實際應該呼叫 API 驗證街友身份
      await new Promise(resolve => setTimeout(resolve, 500));

      // 模擬街友資料
      if (homelessQrCode === 'QR_001') {
        setHomelessInfo({
          name: '張小明',
          id: 'A123456789',
          qrCode: 'QR_001',
          balance: 150
        });
        setShowHomelessInput(false);
      } else {
        alert('無效的街友 QR Code，請重新輸入');
      }
    } catch (err) {
      alert('驗證失敗，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransaction = async () => {
    if (!selectedProduct && !customAmount) {
      alert('請選擇商品或輸入金額');
      return;
    }

    const amount = selectedProduct
      ? storeData.products.find(p => p.id === parseInt(selectedProduct))?.points
      : parseInt(customAmount);

    if (amount > homelessInfo.balance) {
      alert('餘額不足，無法完成交易');
      return;
    }

    setIsProcessing(true);

    try {
      // TODO: 實際應該呼叫 API 進行扣點
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess(true);
      setTimeout(() => {
        // 重置表單，允許下一筆交易
        setSelectedProduct('');
        setCustomAmount('');
        setHomelessInfo(null);
        setSuccess(false);
        setShowHomelessInput(true);
      }, 2000);
    } catch (err) {
      alert('交易失敗，請稍後再試');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading && !storeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">發生錯誤</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回首頁
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">交易成功！</h2>
          <p className="text-gray-600 mb-4">點數已扣除</p>
          <p className="text-sm text-gray-500">準備下一筆交易...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-2xl mx-auto py-8">
        {/* 店家資訊卡片 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">🏪 {storeData.name}</h1>
            <button
              onClick={() => navigate('/')}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">📍</span>
                <span className="text-gray-800">{storeData.address}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">📞</span>
                <span className="text-gray-800">{storeData.phone}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">🔖</span>
                <span className="text-gray-800">店家編號：{storeData.qrCode}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 街友身份驗證 */}
        {!homelessInfo && !showHomelessInput && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 text-center">
            <div className="text-6xl mb-4">👤</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">歡迎光臨</h3>
            <p className="text-gray-600 mb-6">請先輸入您的街友 QR Code 以開始消費</p>
            <button
              onClick={() => setShowHomelessInput(true)}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              開始消費
            </button>
          </div>
        )}

        {showHomelessInput && !homelessInfo && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">請輸入您的 QR Code</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={homelessQrCode}
                onChange={(e) => setHomelessQrCode(e.target.value)}
                placeholder="例如：QR_001"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleHomelessLogin()}
              />
              <div className="flex space-x-3">
                <button
                  onClick={handleHomelessLogin}
                  disabled={isLoading}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 transition-colors"
                >
                  {isLoading ? '驗證中...' : '確認'}
                </button>
                <button
                  onClick={() => {
                    setShowHomelessInput(false);
                    setHomelessQrCode('');
                  }}
                  disabled={isLoading}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 測試用 QR Code：QR_001
              </p>
            </div>
          </div>
        )}

        {/* 街友資訊與商品選擇 */}
        {homelessInfo && (
          <>
            <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-6 text-white mb-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">消費者資訊</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-green-100 text-sm">姓名</p>
                  <p className="text-xl font-semibold">{homelessInfo.name}</p>
                </div>
                <div>
                  <p className="text-green-100 text-sm">身分證號</p>
                  <p className="text-xl font-semibold">{homelessInfo.id}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-green-100 text-sm">目前餘額</p>
                  <p className="text-3xl font-bold">{homelessInfo.balance} 點</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">選擇商品/服務</h3>

              {/* 商品列表 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {storeData.products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      setSelectedProduct(product.id.toString());
                      setCustomAmount('');
                    }}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedProduct === product.id.toString()
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{product.name}</h4>
                      <span className="text-blue-600 font-bold">{product.points} 點</span>
                    </div>
                    <p className="text-sm text-gray-600">{product.description}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="text-sm text-gray-500">或輸入自訂金額</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              <div className="mb-6">
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedProduct('');
                  }}
                  placeholder="請輸入點數"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max={homelessInfo.balance}
                />
              </div>

              {/* 按鈕 */}
              <div className="flex space-x-3">
                <button
                  onClick={handleTransaction}
                  disabled={(!selectedProduct && !customAmount) || isProcessing}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      處理中...
                    </span>
                  ) : (
                    '確認消費'
                  )}
                </button>
                <button
                  onClick={() => {
                    setHomelessInfo(null);
                    setSelectedProduct('');
                    setCustomAmount('');
                    setHomelessQrCode('');
                  }}
                  disabled={isProcessing}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  重新開始
                </button>
              </div>
            </div>
          </>
        )}

        {/* 使用說明 */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800 font-medium mb-2">💡 使用說明</p>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• 請先輸入您的街友 QR Code 以驗證身份</li>
            <li>• 選擇想要購買的商品或輸入自訂金額</li>
            <li>• 確認餘額足夠後點擊「確認消費」</li>
            <li>• 交易完成後系統會自動扣除點數</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StoreScanResult;
