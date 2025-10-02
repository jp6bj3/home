import React, { useState, useEffect } from 'react';

const ProductForm = ({ product, onSave, onCancel, isOpen }) => {
  const [formData, setFormData] = useState({
    name: '',
    points: '',
    category: '',
    description: '',
    status: 'active',
    image: null
  });
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        points: product.points || '',
        category: product.category || '',
        description: product.description || '',
        status: product.status || 'active',
        image: product.image || null
      });
    } else {
      setFormData({
        name: '',
        points: '',
        category: '',
        description: '',
        status: 'active',
        image: null
      });
    }
  }, [product]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '請輸入商品名稱';
    }
    
    if (!formData.points || formData.points <= 0) {
      newErrors.points = '請輸入有效的點數';
    }
    
    if (!formData.category) {
      newErrors.category = '請選擇分類';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const saveData = {
      ...formData,
      id: product?.id || Date.now(),
      points: parseInt(formData.points),
      createdAt: product?.createdAt || new Date().toISOString()
    };
    
    onSave(saveData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      
      // 模擬 OCR 處理
      const reader = new FileReader();
      reader.onload = () => {
        setTimeout(() => {
          // 模擬 OCR 識別結果
          const mockOCRResults = [
            { name: '牛肉麵', points: 80, category: '餐點' },
            { name: '雞腿便當', points: 75, category: '餐點' },
            { name: '洗衣服務', points: 50, category: '服務' },
            { name: '理髮', points: 100, category: '服務' }
          ];
          
          const randomResult = mockOCRResults[Math.floor(Math.random() * mockOCRResults.length)];
          
          setFormData({
            ...formData,
            name: randomResult.name,
            points: randomResult.points,
            category: randomResult.category,
            description: `由 OCR 自動識別：${randomResult.name}`,
            image: reader.result
          });
          
          setIsUploading(false);
          alert('OCR 識別完成！已自動填入商品資訊，請確認後儲存。');
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {product ? '編輯商品' : '新增商品'}
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <span className="sr-only">關閉</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* OCR 上傳區域 */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border-2 border-dashed border-blue-300">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-blue-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="mt-2">
                <label htmlFor="menu-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-blue-600">
                    {isUploading ? '正在處理 OCR...' : '上傳 Menu 照片 (OCR 自動識別)'}
                  </span>
                  <input
                    id="menu-upload"
                    name="menu-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  支援 JPG, PNG 格式，系統將自動識別商品名稱和價格
                </p>
              </div>
              {isUploading && (
                <div className="mt-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-blue-600 mt-1">AI 正在識別中...</p>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {formData.image && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  上傳的圖片預覽
                </label>
                <img 
                  src={formData.image} 
                  alt="商品圖片" 
                  className="w-32 h-32 object-cover rounded-lg border"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  商品名稱 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full border rounded-md px-3 py-2 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="輸入商品名稱"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  所需點數 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="points"
                  value={formData.points}
                  onChange={handleChange}
                  min="1"
                  className={`block w-full border rounded-md px-3 py-2 ${
                    errors.points ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="輸入點數"
                />
                {errors.points && (
                  <p className="mt-1 text-sm text-red-600">{errors.points}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  分類 <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`block w-full border rounded-md px-3 py-2 ${
                    errors.category ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">請選擇分類</option>
                  <option value="餐點">餐點</option>
                  <option value="服務">服務</option>
                  <option value="生活用品">生活用品</option>
                  <option value="醫療">醫療</option>
                  <option value="其他">其他</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  狀態
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">上架</option>
                  <option value="inactive">下架</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                商品描述
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="輸入商品描述..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {product ? '更新' : '新增'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;