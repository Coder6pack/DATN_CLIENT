'use client';

import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentPage() {
  const { cart, clearCart } = useCart();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    note: '',
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('vnpay'); // Default to VNPAY
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    clearCart();
    setTimeout(() => {
      setShowSuccess(false);
      router.push('/');
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPaymentMethod(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {showSuccess && (
        <div className="fixed top-0 left-0 w-full flex justify-center z-50">
          <div className="bg-green-500 text-white px-8 py-4 mt-4 rounded-lg shadow-lg text-lg font-semibold animate-fade-in">
            Đặt hàng thành công! Cảm ơn bạn đã mua hàng tại <span className="font-bold text-yellow-200">Coolmate</span>.
          </div>
        </div>
      )}
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8 text-center">Thanh toán</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Thông tin giao hàng</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phường/Xã</label>
                  <input
                    type="text"
                    name="ward"
                    value={formData.ward}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Payment Methods */}
              <div className="space-y-4 mt-8">
                <h2 className="text-xl font-semibold mb-4">Hình thức thanh toán</h2>

                {/* VNPAY */}
                <label className="flex items-center space-x-3 p-4 border rounded-md cursor-pointer has-[:checked]:ring-2 has-[:checked]:ring-red-500 has-[:checked]:border-transparent">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="vnpay"
                    checked={selectedPaymentMethod === 'vnpay'}
                    onChange={handlePaymentMethodChange}
                    className="form-radio text-red-500"
                  />
                  <div className="flex items-center space-x-4">
                    {/* Placeholder for VNPAY logo */}
                    <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center text-gray-600 font-bold">VN</div>
                    <div>
                      <span className="block text-sm font-medium text-gray-900">Ví điện tử VNPAY</span>
                      <span className="block text-xs text-gray-500">Quét QR để thanh toán</span>
                    </div>
                  </div>
                </label>

                {/* COD */}
                <label className="flex items-center space-x-3 p-4 border rounded-md cursor-pointer has-[:checked]:ring-2 has-[:checked]:ring-red-500 has-[:checked]:border-transparent">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={selectedPaymentMethod === 'cod'}
                    onChange={handlePaymentMethodChange}
                    className="form-radio text-red-500"
                  />
                  <div className="flex items-center space-x-4">
                    {/* Placeholder for COD icon */}
                    <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center text-gray-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l6-3 6 3 6-3V7a1 1 0 01-1 1H4a1 1 0 01-1-1V7z"></path></svg></div>
                    <div>
                      <span className="block text-sm font-medium text-gray-900">Thanh toán khi nhận hàng</span>
                    </div>
                  </div>
                </label>

                {/* MoMo */}
                <label className="flex items-center space-x-3 p-4 border rounded-md cursor-pointer has-[:checked]:ring-2 has-[:checked]:ring-red-500 has-[:checked]:border-transparent">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="momo"
                    checked={selectedPaymentMethod === 'momo'}
                    onChange={handlePaymentMethodChange}
                    className="form-radio text-red-500"
                  />
                  <div className="flex items-center space-x-4">
                     {/* Placeholder for MoMo logo */}
                    <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center text-gray-600 font-bold">MM</div>
                    <div>
                      <span className="block text-sm font-medium text-gray-900">Ví MoMo</span>
                    </div>
                  </div>
                </label>

                 {/* ZaloPay */}
                <label className="flex items-center space-x-3 p-4 border rounded-md cursor-pointer has-[:checked]:ring-2 has-[:checked]:ring-red-500 has-[:checked]:border-transparent">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="zalopay"
                    checked={selectedPaymentMethod === 'zalopay'}
                    onChange={handlePaymentMethodChange}
                    className="form-radio text-red-500"
                  />
                  <div className="flex items-center space-x-4">
                     {/* Placeholder for ZaloPay logo */}
                    <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center text-gray-600 font-bold">ZL</div>
                    <div>
                      <span className="block text-sm font-medium text-gray-900">Thanh toán qua ZaloPay</span>
                       <span className="block text-xs text-gray-500">Hỗ trợ mọi hình thức thanh toán: Napas, VIETQR, VISA, Mastercard, JCB, Apple Pay</span>
                    </div>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-red-500 text-white py-3 px-4 rounded-md hover:bg-red-600 transition duration-200"
              >
                Thanh toán {totalAmount.toLocaleString('vi-VN')}đ
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Đơn hàng của bạn</h2>
            <div className="space-y-4">
              {cart.map((item) => {
                // Create a unique key by combining id, color, and size
                const uniqueKey = `${item.id}-${item.color || 'no-color'}-${item.size || 'no-size'}`;
                
                return (
                  <div key={uniqueKey} className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                        {item.color && <p className="text-sm text-gray-500">Màu: {item.color}</p>}
                        {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</p>
                      {item.originalPrice && (
                        <p className="text-sm text-gray-500 line-through">
                          {(item.originalPrice * item.quantity).toLocaleString('vi-VN')}đ
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính:</span>
                <span>{totalAmount.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển:</span>
                <span>Miễn phí</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Tổng cộng:</span>
                <span className="text-red-600">{totalAmount.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 