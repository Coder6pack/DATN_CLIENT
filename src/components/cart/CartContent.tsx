'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCart, CartItem as CartItemType } from '@/context/CartContext';
import CartItem from './CartItem';

interface CartContentProps {
  cart: CartItemType[];
  selectedItems: string[];
  allSelected: boolean;
  handleSelectAll: (isChecked: boolean) => void;
  handleSelectItem: (itemKey: string, isChecked: boolean) => void;
  handleDeleteSelected: () => void;
}

export default function CartContent({
  cart,
  selectedItems,
  allSelected,
  handleSelectAll,
  handleSelectItem,
  handleDeleteSelected,
}: CartContentProps) {
  const { updateQuantity, removeFromCart } = useCart(); // Keep removeFromCart and updateQuantity as they are used in CartItem

  if (cart.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-4">Giỏ hàng trống</h2>
        <p className="text-gray-600">Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Giỏ hàng của bạn ({cart.length} sản phẩm)</h2>
      </div>

      <div className="p-4 bg-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-red-600 rounded"
            checked={allSelected}
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
          <span className="text-gray-700 font-medium">Sản Phẩm</span>
        </div>
        <div className="flex items-center gap-8">
          <span className="text-gray-700 font-medium w-32 text-center">Đơn Giá</span>
          <span className="text-gray-700 font-medium w-24 text-center">Số Lượng</span>
          <span className="text-gray-700 font-medium w-32 text-right">Số Tiền</span>
          <span className="text-gray-700 font-medium w-24 text-center">Thao Tác</span>
        </div>
      </div>
      
      <div className="divide-y">
        {cart.map(item => {
          const itemKey = `${item.id}-${item.color || 'no-color'}-${item.size || 'no-size'}`;
          return (
            <CartItem 
              key={itemKey} 
              item={item} 
              isSelected={selectedItems.includes(itemKey)}
              onSelect={handleSelectItem}
            />
          );
        })}
      </div>

      <div className="p-4 border-t flex justify-between items-center bg-gray-50">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-red-600 rounded"
            checked={allSelected}
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
          <span className="text-gray-700 font-medium">Chọn tất cả ({selectedItems.length}) sản phẩm</span>
          {selectedItems.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="ml-4 text-red-600 hover:text-red-700 font-medium"
            >
              Xóa
            </button>
          )}
        </div>
        {/* The total calculation is now handled in page.tsx and passed to CartSummary */}
        <div className="text-right">
          {/* These elements are moved to CartSummary */}
        </div>
      </div>
    </div>
  );
} 