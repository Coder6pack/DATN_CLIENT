'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function CartBottomSection() {
  // Dummy data for demonstration
  const subtotal = 199000;
  const shipping = 30000;
  const total = subtotal + shipping;

  return (
    <div className="mt-8">
      {/* Return Policy Info */}
      <div className="bg-gray-100 p-4 text-sm text-black rounded-lg text-center">
        Nếu bạn không hài lòng với sản phẩm của chúng tôi? Bạn hoàn toàn có thể trả lại sản phẩm. <Link href="#" className="text-blue-600 hover:underline">Tìm hiểu thêm tại đây.</Link>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Payment Method - COD */}
        <div className="bg-blue-100 p-6 rounded-lg flex items-center gap-4">
           <Image
            src="/images/cod-icon.svg"
            alt="COD Icon"
            width={40}
            height={40}
           />
          <div className="text-black">
            <p className="font-semibold">COD</p>
            <p className="text-sm">Thanh toán khi nhận hàng</p>
          </div>
        </div>

        {/* Order Summary and Button */}
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
           <div className="flex justify-between text-sm text-black">
            <span>Tạm tính</span>
            <span>{subtotal.toLocaleString('vi-VN')}đ</span>
          </div>

          <div className="flex justify-between text-sm text-black">
            <span>Phí vận chuyển</span>
            <span>Miễn phí</span> {/* Assuming free shipping based on template */}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between font-semibold text-black text-lg">
              <span>Thành tiền</span>
              <span>{total.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>

           <button className="w-full bg-gray-400 text-white py-3 rounded-lg font-medium cursor-not-allowed" disabled>
            ĐẶT HÀNG
          </button>
        </div>
      </div>
    </div>
  );
} 