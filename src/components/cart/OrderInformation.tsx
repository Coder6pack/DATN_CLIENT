'use client';

import { useState } from 'react';

export default function OrderInformation() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [note, setNote] = useState('');
  const [callReceiver, setCallReceiver] = useState(false);
  const [title, setTitle] = useState('Anh/Chị');

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg text-black font-semibold mb-4">Thông tin đặt hàng</h2>
      
      <div className="space-y-4">
        {/* Họ và tên */}
        <div>
          <label className="block text-sm font-medium text-black mb-1">Họ và tên</label>
          <div className="flex gap-2">
            <select
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded px-3 py-2 text-sm text-black"
            >
              <option value="Anh/Chị">Anh/Chị</option>
              {/* Add more titles if needed */}
            </select>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 border rounded px-3 py-2 text-sm text-black"
              placeholder="Nhập họ tên của bạn"
            />
          </div>
        </div>

        {/* Số điện thoại */}
        <div>
          <label className="block text-sm font-medium text-black mb-1">Số điện thoại</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm text-black"
            placeholder="Nhập số điện thoại của bạn"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-black mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm text-black"
            placeholder="Theo dõi đơn hàng sẽ được gửi qua Email và ZNS"
          />
        </div>

        {/* Địa chỉ */}
        <div>
          <label className="block text-sm font-medium text-black mb-1">Địa chỉ</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm text-black mb-2"
            placeholder="Địa chỉ (ví dụ: 103 Vạn Phúc, phường Vạn Phúc)"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="border rounded px-3 py-2 text-sm text-black"
            >
              <option value="">Hồ Chí Minh</option>
              {/* Add options for provinces */}
            </select>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="border rounded px-3 py-2 text-sm text-black"
            >
              <option value="">Chọn Quận/Huyện</option>
              {/* Add options for districts */}
            </select>
            <select
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              className="border rounded px-3 py-2 text-sm text-black"
            >
              <option value="">Chọn Phường/Xã</option>
              {/* Add options for wards */}
            </select>
          </div>
        </div>

        {/* Ghi chú */}
        <div>
          <label className="block text-sm font-medium text-black mb-1">Ghi chú</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm text-black"
            placeholder="Ghi chú thêm (Ví dụ: Giao hàng giờ hành chính)"
            rows={2}
          ></textarea>
        </div>

        {/* Gọi cho người khác nhận hàng */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="callReceiver"
            checked={callReceiver}
            onChange={(e) => setCallReceiver(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="callReceiver" className="text-sm text-black">Gọi cho người khác nhận hàng(nếu có)</label>
        </div>

      </div>
    </div>
  );
} 