'use client';

import React from 'react';
import Image from 'next/image';
import { CartItem as CartItemType, useCart } from '@/context/CartContext';

interface CartItemProps {
  item: CartItemType;
  isSelected: boolean;
  onSelect: (itemKey: string, isChecked: boolean) => void;
}

export default function CartItem({ item, isSelected, onSelect }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  const uniqueKey = `${item.id}-${item.color || 'no-color'}-${item.size || 'no-size'}`;

  return (
    <div key={uniqueKey} className="flex items-center justify-between py-4 border-b">
      <div className="flex items-center gap-4 w-2/5">
        <input 
          type="checkbox" 
          className="form-checkbox h-5 w-5 text-red-600 rounded" 
          checked={isSelected}
          onChange={(e) => onSelect(uniqueKey, e.target.checked)}
        />
        <div className="relative w-20 h-20 flex-shrink-0">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div className="flex-grow">
          <h3 className="font-medium text-base">{item.name}</h3>
          {item.color && <p className="text-sm text-gray-600">Màu: {item.color}</p>}
          {item.size && <p className="text-sm text-gray-600">Size: {item.size}</p>}
        </div>
      </div>

      <div className="w-1/5 text-center">
        {item.originalPrice && (
          <p className="text-sm text-gray-500 line-through mb-1">
            {item.originalPrice.toLocaleString('vi-VN')}đ
          </p>
        )}
        <p className="font-medium text-base">{item.price.toLocaleString('vi-VN')}đ</p>
      </div>

      <div className="w-1/5 text-center">
        <div className="flex items-center justify-center border rounded-lg w-28 mx-auto">
          <button
            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.color, item.size)}
            className="px-3 py-1 hover:bg-gray-100 rounded-l-lg"
          >
            -
          </button>
          <span className="px-3 py-1 text-base">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1, item.color, item.size)}
            className="px-3 py-1 hover:bg-gray-100 rounded-r-lg"
          >
            +
          </button>
        </div>
      </div>

      <div className="w-1/5 text-right">
        <p className="font-semibold text-red-600 text-base">
          {(item.price * item.quantity).toLocaleString('vi-VN')}đ
        </p>
      </div>

      <div className="w-1/5 text-center">
        <button
          onClick={() => removeFromCart(item.id, item.color, item.size)}
          className="text-gray-500 hover:text-red-600"
        >
          Xóa
        </button>
      </div>
    </div>
  );
} 