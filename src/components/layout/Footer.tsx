import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-10 pb-6">
      {/* Phần trên: Thông điệp, hotline, email, icon, nút đóng góp */}
      <div className="w-full px-8">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8 border-b border-white/20 pb-8">
          {/* Thông điệp và nút góp ý */}
          <div className="w-full lg:w-[40%] min-w-[320px]">
            <h2 className="text-2xl font-bold mb-2">COOLMATE lắng nghe bạn!</h2>
            <p className="max-w-lg mb-6 text-white/80">Chúng tôi luôn trân trọng và mong đợi nhận được mọi ý kiến đóng góp từ khách hàng để có thể nâng cấp trải nghiệm dịch vụ và sản phẩm tốt hơn nữa.</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full flex items-center gap-2 text-lg transition-colors">
              ĐÓNG GÓP Ý KIẾN
              <span className="ml-2">→</span>
            </button>
          </div>
          {/* Hotline và email */}
          <div className="w-full lg:w-[30%] flex flex-col items-start justify-start min-w-[260px] gap-4">
            <div className="flex items-center gap-3">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92V19a2 2 0 01-2 2A18 18 0 013 5a2 2 0 012-2h2.09a2 2 0 012 1.72c.13.81.36 1.6.7 2.34a2 2 0 01-.45 2.11l-.27.27a16 16 0 006.29 6.29l.27-.27a2 2 0 012.11-.45c.74.34 1.53.57 2.34.7A2 2 0 0122 16.92z" /></svg>
              <div>
                <div className="font-bold">Hotline</div>
                <div className="font-bold text-lg">1900.272737 - 028.7777.2737</div>
                <div className="text-white/80">(8:30 - 22:00)</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <div>
                <div className="font-bold">Email</div>
                <div className="font-bold text-lg">Cool@coolmate.me</div>
              </div>
            </div>
          </div>
          {/* Icon mạng xã hội */}
          <div className="w-full lg:w-[30%] flex items-start justify-end gap-8 min-w-[320px] mt-8 lg:mt-0">
            <a href="#" className="block"><img src="/images/facebook.png" alt="Facebook" className="w-12 h-12 object-contain" /></a>
            <a href="#" className="block"><img src="/images/zalo.png" alt="Zalo" className="w-12 h-12 object-contain" /></a>
            <a href="#" className="block"><img src="/images/tiktok.png" alt="Tiktok" className="w-12 h-12 object-contain" /></a>
            <a href="#" className="block"><img src="/images/icon-instar.svg" alt="Instagram" className="w-12 h-12 object-contain" /></a>
            <a href="#" className="block"><img src="/images/icon-youtube.svg" alt="Youtube" className="w-12 h-12 object-contain" /></a>
          </div>
        </div>

        {/* Phần dưới: Grid nhiều cột */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mt-10 text-sm">
          <div>
            <div className="font-bold mb-2">COOLCLUB</div>
            <div className="mb-1">Đăng kí thành viên</div>
            <div className="mb-1">Ưu đãi & Đặc quyền</div>
            <div className="font-bold mt-4 mb-1">TÀI LIỆU - TUYỂN DỤNG</div>
            <div className="mb-1">Tuyển dụng</div>
            <div className="mb-1">Đăng ký bản quyền</div>
          </div>
          <div>
            <div className="font-bold mb-2">CHÍNH SÁCH</div>
            <div className="mb-1">Chính sách đổi trả 60 ngày</div>
            <div className="mb-1">Chính sách khuyến mãi</div>
            <div className="mb-1">Chính sách bảo mật</div>
            <div className="mb-1">Chính sách giao hàng</div>
          </div>
          <div>
            <div className="font-bold mb-2">CHĂM SÓC KHÁCH HÀNG</div>
            <div className="mb-1">Trải nghiệm mua sắm 100% hài lòng</div>
            <div className="mb-1">Hỏi đáp - FAQs</div>
          </div>
          <div>
            <div className="font-bold mb-2">KIẾN THỨC MẶC ĐẸP</div>
            <div className="mb-1">Hướng dẫn chọn size đồ nam</div>
            <div className="mb-1">Hướng dẫn chọn size đồ nữ</div>
            <div className="mb-1">Blog</div>
          </div>
          <div>
            <div className="font-bold mb-2">VỀ COOLMATE</div>
            <div className="mb-1">Quy tắc ứng xử của Coolmate</div>
            <div className="mb-1">Coolmate 101</div>
            <div className="mb-1">DVKH xuất sắc</div>
            <div className="mb-1">Câu chuyện về Coolmate</div>
            <div className="mb-1">Nhà máy</div>
            <div className="mb-1">Care & Share</div>
            <div className="mb-1">Cam kết bền vững</div>
            <div className="mb-1">Tầm nhìn 2030</div>
          </div>
        </div>
        <div className="mt-10 text-center text-white/60 text-sm">© 2024 Coolmate Clone. All rights reserved.</div>
      </div>
    </footer>
  );
};

export default Footer; 