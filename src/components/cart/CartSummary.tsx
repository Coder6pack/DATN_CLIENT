'use client';

import React from 'react';
// import { useCart } from '@/context/CartContext'; // No longer needed as props are passed down

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  total: number;
  totalQuantitySelected: number;
  totalSavings: number;
  handleCheckout: () => void;
}

export default function CartSummary({
  subtotal,
  shipping,
  total,
  totalQuantitySelected,
  totalSavings,
  handleCheckout,
}: CartSummaryProps) {
  // const { cart } = useCart(); // No longer needed as props are passed down

  // Calculate totals - now passed as props
  // const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  // const shipping = subtotal > 0 ? 30000 : 0; // Free shipping for orders over 0đ
  // const total = subtotal + shipping;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Tổng đơn hàng</h2>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Tạm tính</span>
          <span>{subtotal.toLocaleString('vi-VN')}đ</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Phí vận chuyển</span>
          <span>{shipping.toLocaleString('vi-VN')}đ</span>
        </div>
        
        <div className="border-t pt-3">
          <div className="flex justify-between font-semibold">
            <span>Tổng cộng</span>
            <span className="text-red-600">{total.toLocaleString('vi-VN')}đ</span>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>Miễn phí vận chuyển cho đơn hàng từ 0đ</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>Bảo hành chính hãng 100%</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>Đổi trả trong 30 ngày</span>
        </div>
      </div>
      <button
        onClick={handleCheckout}
        className="w-full mt-6 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={totalQuantitySelected === 0}
      >
        MUA HÀNG
      </button>
    </div>
  );
} 