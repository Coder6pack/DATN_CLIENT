"use client";

import { useAppContext } from "@/components/app-provider";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useTheme } from "next-themes";

const menuItems = [
  {
    title: "Trang chủ",
    href: "/",
  },
  {
    title: "Đơn hàng",
    href: "/orders",
    authRequired: true,
  },
  {
    title: "Đăng nhập",
    href: "/login",
    authRequired: false,
  },
  {
    title: "Quản lý",
    href: "/manage/dashboard",
    authRequired: true,
  },
];

export default function NavItems({ className }: { className?: string }) {
  const { isAuth } = useAppContext();
  const [isCartPopupVisible, setIsCartPopupVisible] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);
  const { cart, removeFromCart, updateQuantity } = useCart();
  const { theme, setTheme } = useTheme();

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartPopupVisible(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [cartRef]);

  const handleCartIconClick = () => {
    setIsCartPopupVisible(!isCartPopupVisible);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="flex items-center space-x-6">
      {menuItems.map((item) => {
        if (
          (item.authRequired === false && isAuth) ||
          (item.authRequired === true && !isAuth)
        )
          return null;
        return (
          <Link href={item.href} key={item.href} className={`${className} text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors`}>
            {item.title}
          </Link>
        );
      })}

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          className="w-64 px-4 py-2 pr-10 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
        />
        <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <Image
            src="/images/timkiem.jpg"
            alt="Search"
            width={20}
            height={20}
            className="opacity-60 hover:opacity-100 dark:invert"
          />
        </button>
      </div>

      {/* Cart Icon */}
      <div className="relative" ref={cartRef}>
        <button onClick={handleCartIconClick} className="p-2 relative">
          <Image
            src="/images/icon-cart-new-v2.svg"
            alt="Cart"
            width={24}
            height={24}
            className="hover:opacity-80 dark:invert"
          />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>

        {/* Cart Popup */}
        {isCartPopupVisible && (
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-50 border border-gray-200 dark:border-gray-700">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Tạm tính: <span className="text-red-600 dark:text-red-400">{totalAmount.toLocaleString('vi-VN')}đ</span> ({totalItems} sản phẩm)
                </span>
              </div>
              <div className="space-y-4 max-h-60 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-600 dark:text-gray-400">Giỏ hàng trống</p>
                  </div>
                ) : (
                  cart.map(item => {
                    const uniqueKey = `${item.id}-${item.color || 'no-color'}-${item.size || 'no-size'}`;
                    
                    return (
                      <div key={uniqueKey} className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 relative flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">{item.name}</h4>
                            {item.color && <p className="text-sm text-gray-600 dark:text-gray-400">Màu: {item.color}</p>}
                            {item.size && <p className="text-sm text-gray-600 dark:text-gray-400">Size: {item.size}</p>}
                            <div className="flex items-center gap-2 mt-1">
                              <button
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.color, item.size)}
                                className="px-2 py-0.5 border rounded-l-md hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-200"
                              >
                                -
                              </button>
                              <span className="px-2 text-gray-900 dark:text-gray-100">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1, item.color, item.size)}
                                className="px-2 py-0.5 border rounded-r-md hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-200"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                          </p>
                          {item.originalPrice && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-through">
                              {(item.originalPrice * item.quantity).toLocaleString('vi-VN')}đ
                            </p>
                          )}
                          <button
                            onClick={() => removeFromCart(item.id, item.color, item.size)}
                            className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 mt-1"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              {cart.length > 0 && (
                <div className="mt-4">
                  <Link href="/cart" className="block w-full bg-red-500 text-white text-center py-2 rounded-md hover:bg-red-600 transition duration-200" onClick={() => setIsCartPopupVisible(false)}>
                    Xem giỏ hàng
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
