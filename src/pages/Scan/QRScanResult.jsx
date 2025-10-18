import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { homelessService, transactionService } from '../../services/auth';

const QRScanResult = () => {
  const { qrCode } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [homelessData, setHomelessData] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [transactionResult, setTransactionResult] = useState(null);

  // 店家的商品（應該從登入的店家資料中取得）
  const storeProducts = user?.role === 'store' ? [
    { id: 1, name: '午餐套餐', points: 80, description: '主菜+湯+飲料' },
    { id: 2, name: '早餐組合', points: 50, description: '三明治+咖啡' },
    { id: 3, name: '晚餐套餐', points: 100, description: '雙主菜+湯+飲料+甜點' },
    { id: 4, name: '單點飲料', points: 20, description: '任選一杯飲料' }
  ] : [];

  useEffect(() => {
    fetchHomelessData();
  }, [qrCode]);

  const fetchHomelessData = async () => {
    try {
      setIsLoading(true);
      const response = await homelessService.getByQrCode(qrCode);

      if (response.success) {
        setHomelessData(response.data);
      } else {
        setError('找不到該街友資訊');
      }
    } catch (err) {
      console.error('Get homeless error:', err);
      setError('載入資料失敗，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransaction = async () => {
    if (!selectedProduct && !customAmount) {
      alert('請選擇商品或輸入金額');
      return;
    }

    const selectedProductData = storeProducts.find(p => p.id === parseInt(selectedProduct));
    const amount = selectedProduct ? selectedProductData?.points : parseInt(customAmount);
    const productName = selectedProduct ? selectedProductData?.name : '自訂消費';

    if (amount > homelessData.balance) {
      setTransactionResult({
        success: false,
        message: '餘額不足',
        details: {
          required: amount,
          current: homelessData.balance,
          shortage: amount - homelessData.balance
        }
      });
      return;
    }

    setIsProcessing(true);

    try {
      const response = await transactionService.create({
        homelessQrCode: qrCode,
        storeQrCode: user?.qrCode || 'STORE_QR_001',
        amount,
        productName
      });

      if (response.success) {
        setTransactionResult({
          success: true,
          message: '交易成功',
          amount,
          productName,
          newBalance: response.data.newBalance
        });

        // 更新本地街友餘額
        setHomelessData(prev => ({
          ...prev,
          balance: response.data.newBalance
        }));
      } else {
        setTransactionResult({
          success: false,
          message: response.message || '交易失敗'
        });
      }
    } catch (err) {
      console.error('Transaction error:', err);
      setTransactionResult({
        success: false,
        message: err.response?.data?.message || '交易失敗，請稍後再試'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewTransaction = () => {
    setTransactionResult(null);
    setSelectedProduct('');
    setCustomAmount('');
  };

  // 載入中
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

  // 錯誤頁面
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

  // 未登入提示
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-yellow-500 text-6xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">需要登入</h2>
          <p className="text-gray-600 mb-6">請使用店家或 NGO 帳號登入後掃描</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            前往登入
          </button>
        </div>
      </div>
    );
  }

  // 交易結果頁面（參考 LINE Pay）
  if (transactionResult) {
    if (transactionResult.success) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">交易成功</h2>
            <p className="text-gray-600 mb-6">{transactionResult.productName}</p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">已扣除</span>
                <span className="text-2xl font-bold text-red-600">-{transactionResult.amount} 點</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">剩餘餘額</span>
                  <span className="text-xl font-bold text-green-600">{transactionResult.newBalance} 點</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleNewTransaction}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                繼續交易
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                完成
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">交易失敗</h2>
            <p className="text-lg text-red-600 font-semibold mb-4">{transactionResult.message}</p>

            {transactionResult.details && (
              <div className="bg-red-50 rounded-lg p-4 mb-6 text-left">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">需要點數：</span>
                  <span className="font-semibold text-gray-900">{transactionResult.details.required} 點</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">目前餘額：</span>
                  <span className="font-semibold text-gray-900">{transactionResult.details.current} 點</span>
                </div>
                <div className="flex justify-between border-t border-red-200 pt-2 mt-2">
                  <span className="text-gray-700">不足：</span>
                  <span className="font-semibold text-red-600">{transactionResult.details.shortage} 點</span>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleNewTransaction}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                返回
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                完成
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  // 店家掃描街友 QR Code - 顯示扣點介面
  if (user?.role === 'store') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
        <div className="max-w-2xl mx-auto py-8">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">街友資訊</h1>
              <button
                onClick={() => navigate('/')}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 街友資訊卡片 */}
            <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-6 text-white mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-green-100 text-sm">姓名</p>
                  <p className="text-2xl font-semibold">{homelessData.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-100 text-sm">可用餘額</p>
                  <p className="text-3xl font-bold">{homelessData.balance} 點</p>
                </div>
              </div>
            </div>

            {/* 商品選擇 */}
            <h3 className="text-xl font-semibold text-gray-900 mb-4">選擇商品/服務</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {storeProducts.map((product) => (
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
                max={homelessData.balance}
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
      </div>
    );
  }

  // NGO 管理員掃描街友 QR Code - 顯示完整資訊
  if (user?.role === 'ngo_admin' || user?.role === 'ngo_partner') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto py-8">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-green-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xl">👤</span>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">街友資訊查詢</h1>
                  <p className="text-sm text-gray-600">{homelessData.name}</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/')}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* 餘額卡片 */}
          <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-6 text-white shadow-lg mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-green-100 text-sm">目前餘額</p>
                <p className="text-3xl font-bold">{homelessData.balance} 點</p>
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

          {/* 個人資訊 */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">📋</span>
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
              {homelessData.phone && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">聯絡電話</span>
                  <span className="font-medium">{homelessData.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* 返回按鈕 */}
          <div className="text-center">
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              返回首頁
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 其他角色無權限
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="text-red-500 text-6xl mb-4">🚫</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">無權限</h2>
        <p className="text-gray-600 mb-6">您的角色無法執行此操作</p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          返回首頁
        </button>
      </div>
    </div>
  );
};

export default QRScanResult;
