'use client';

import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';

interface PaymentSectionProps {
  selectedMethod: string;
  onMethodSelect: Dispatch<SetStateAction<string>>;
}

export default function PaymentSection({ selectedMethod, onMethodSelect }: PaymentSectionProps) {
  const paymentMethods = [
    {
      id: 'cod',
      name: 'Thanh toán khi nhận hàng',
      icon: '/images/cod.png',
      description: null,
    },
    {
      id: 'momo',
      name: 'Ví MoMo',
      icon: '/images/momo.png',
      description: null,
    },
    {
      id: 'vnpay',
      name: 'Ví điện tử VNPAY',
      icon: '/images/vnpay.jpg',
      description: 'Quét QR để thanh toán',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-black mb-4">Hình thức thanh toán</h2>

      <div className="space-y-4">
        {paymentMethods.map(method => (
          <label
            key={method.id}
            className={`flex items-center p-4 border rounded-lg cursor-pointer ${
              selectedMethod === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={selectedMethod === method.id}
              onChange={() => onMethodSelect(method.id)}
              className="mr-4 focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
            />
             {method.icon && (
              <Image src={method.icon} alt={`${method.name} icon`} width={40} height={40} className="mr-4" />
            )}
            <div className="flex-1 text-black">
              <p className="font-medium">{method.name}</p>
              {method.description && (
                <p className="text-sm text-gray-600 mt-1">{method.description}</p>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
} 