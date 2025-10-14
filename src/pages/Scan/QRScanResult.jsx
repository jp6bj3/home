import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const QRScanResult = () => {
  const { qrCode } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [homelessData, setHomelessData] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // 模擬商品資料
  const products = [
    { id: 1, name: '午餐套餐', points: 80 },
    { id: 2, name: '洗衣券', points: 50 },
    { id: 3, name: '理髮服務', points: 100 }
  ];

  useEffect(() => {
    // 模擬從後端獲取街友資料
    const fetchHomelessData = async () => {
      try {
        setIsLoading(true);
        // TODO: 實際應該呼叫 API: await fetch(`/api/homeless/${qrCode}`)
        // 暫時使用模擬資料
        await new Promise(resolve => setTimeout(resolve, 500));

        if (qrCode === 'QR_001') {
          setHomelessData({
            name: '張小明',
            id: 'A123456789',
            qrCode: 'QR_001',
            balance: 150
          });
        } else {
          setError('無效的 QR Code');
        }
      } catch (err) {
        setError('載入資料失敗，請稍後再試');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomelessData();
  }, [qrCode]);

  const handleTransaction = async () => {
    if (!selectedProduct && !customAmount) {
      alert('請選擇商品或輸入金額');
      return;
    }

    const amount = selectedProduct
      ? products.find(p => p.id === parseInt(selectedProduct))?.points
      : parseInt(customAmount);

    if (amount > homelessData.balance) {
      alert('餘額不足，無法完成交易');
      return;
    }

    setIsProcessing(true);

    try {
      // TODO: 實際應該呼叫 API 進行扣點
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      alert('交易失敗，請稍後再試');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
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
          <p className="text-sm text-gray-500">即將返回首頁...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-2xl mx-auto py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">掃描結果</h1>
            <button
              onClick={() => navigate('/')}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 街友資訊 */}
          <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-6 text-white mb-6">
            <h3 className="text-lg font-semibold mb-4">街友資訊</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-green-100 text-sm">姓名</p>
                <p className="text-xl font-semibold">{homelessData.name}</p>
              </div>
              <div>
                <p className="text-green-100 text-sm">身分證號</p>
                <p className="text-xl font-semibold">{homelessData.id}</p>
              </div>
              <div className="col-span-2">
                <p className="text-green-100 text-sm">目前餘額</p>
                <p className="text-3xl font-bold">{homelessData.balance} 點</p>
              </div>
            </div>
          </div>

          {/* 交易表單 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                選擇商品/服務
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => {
                  setSelectedProduct(e.target.value);
                  setCustomAmount('');
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">請選擇...</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {product.points} 點
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="text-sm text-gray-500">或</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                輸入自訂金額（點數）
              </label>
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
                max={homelessData.balance}
              />
            </div>

            {/* 按鈕 */}
            <div className="flex space-x-3 pt-4">
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
                  '確認扣點'
                )}
              </button>
              <button
                onClick={() => navigate('/')}
                disabled={isProcessing}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>

        {/* 使用說明 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 font-medium mb-2">📱 使用說明</p>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 請確認街友資訊無誤</li>
            <li>• 選擇商品或輸入自訂金額</li>
            <li>• 確認餘額足夠後點擊「確認扣點」</li>
            <li>• 交易完成後會自動返回首頁</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QRScanResult;
