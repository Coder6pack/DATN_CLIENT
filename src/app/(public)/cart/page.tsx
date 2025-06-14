'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CartContent from '@/components/cart/CartContent';
import CartSummary from '@/components/cart/CartSummary';
import React, { useState, useEffect } from 'react';

export default function CartPage() {
  const { cart, removeFromCart, removeMultipleFromCart } = useCart();
  const router = useRouter();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  // allSelected will now be a derived value, not a state
  // const [allSelected, setAllSelected] = useState(false);

  // Main useEffect for synchronizing selection with cart changes
  useEffect(() => {
    // If cart becomes empty, clear selected items
    if (cart.length === 0) {
      if (selectedItems.length > 0) { // Only update if it's actually changing
        setSelectedItems([]);
      }
    } else {
      const currentCartItemKeys = new Set(cart.map(item => `${item.id}-${item.color || 'no-color'}-${item.size || 'no-size'}`));
      
      // Filter selectedItems to only include items still present in the cart
      const newFilteredSelectedItems = selectedItems.filter(key => currentCartItemKeys.has(key));

      // Check if the filtered selected items are different from the current selectedItems state
      const areFilteredItemsDifferent = 
        newFilteredSelectedItems.length !== selectedItems.length ||
        newFilteredSelectedItems.some((item, index) => item !== selectedItems[index]);

      if (areFilteredItemsDifferent) {
        setSelectedItems(newFilteredSelectedItems);
      }
      // We no longer set allSelected here
    }
  }, [cart]); // This effect only depends on 'cart'

  // Derived value for allSelected
  const allSelected = cart.length > 0 && selectedItems.length === cart.length;

  const handleSelectAll = (isChecked: boolean) => {
    // setAllSelected(isChecked); // No longer a state
    if (isChecked) {
      const allItemKeys = cart.map(item => `${item.id}-${item.color || 'no-color'}-${item.size || 'no-size'}`);
      setSelectedItems(allItemKeys);
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemKey: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedItems(prev => [...prev, itemKey]);
    } else {
      setSelectedItems(prev => prev.filter(key => key !== itemKey));
    }
  };

  const handleDeleteSelected = () => {
    const itemsToDelete = [...selectedItems]; // Capture selected items before clearing
    setSelectedItems([]); // Clear selected items immediately
    removeMultipleFromCart(itemsToDelete); // Then remove from cart
  };

  const selectedCartItems = cart.filter(item => 
    selectedItems.includes(`${item.id}-${item.color || 'no-color'}-${item.size || 'no-size'}`)
  );

  const subtotal = selectedCartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 30000 : 0; // Free shipping for orders over 0đ
  const total = subtotal + shipping;
  const totalSavings = selectedCartItems.reduce((total, item) => total + ((item.originalPrice || item.price) - item.price) * item.quantity, 0);

  const handleCheckout = () => {
    if (selectedCartItems.length > 0) {
      router.push('/payment');
    } else {
      alert('Vui lòng chọn sản phẩm để thanh toán.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Giỏ hàng của bạn</h1>

      {cart.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Giỏ hàng của bạn đang trống.</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <CartContent 
              cart={cart}
              selectedItems={selectedItems}
              allSelected={allSelected}
              handleSelectAll={handleSelectAll}
              handleSelectItem={handleSelectItem}
              handleDeleteSelected={handleDeleteSelected}
            />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <CartSummary 
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              totalQuantitySelected={selectedItems.length}
              totalSavings={totalSavings}
              handleCheckout={handleCheckout}
            />
          </div>
        </div>
      )}
    </div>
  );
} 