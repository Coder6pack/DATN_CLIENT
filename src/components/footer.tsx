import Link from "next/link";

interface FooterProps {
  companyName?: string;
  description?: string;
  links?: {
    title: string;
    items: { label: string; href: string }[];
  }[];
  contactInfo?: {
    email: string;
    phone: string;
    address: string;
  };
}

export default function Footer({
  companyName = "FashionStore",
  description = "Cửa hàng thời trang hàng đầu với những sản phẩm chất lượng cao.",
  links = [
    {
      title: "Liên Kết",
      items: [
        { label: "Về Chúng Tôi", href: "#" },
        { label: "Sản Phẩm", href: "#" },
        { label: "Liên Hệ", href: "#" },
      ],
    },
    {
      title: "Hỗ Trợ",
      items: [
        { label: "Chính Sách Đổi Trả", href: "#" },
        { label: "Hướng Dẫn Mua Hàng", href: "#" },
        { label: "FAQ", href: "#" },
      ],
    },
  ],
  contactInfo = {
    email: "info@fashionstore.com",
    phone: "0123 456 789",
    address: "123 Đường ABC, TP.HCM",
  },
}: FooterProps) {
  return (
    <footer className="bg-card border-t border-border transition-colors duration-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              {companyName}
            </h3>
            <p className="text-muted-foreground">{description}</p>
          </div>

          {links.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4 text-foreground">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Liên Hệ</h4>
            <div className="space-y-2 text-muted-foreground">
              <p>
                Email: <span className="text-primary">{contactInfo.email}</span>
              </p>
              <p>
                Điện thoại:{" "}
                <span className="text-primary">{contactInfo.phone}</span>
              </p>
              <p>Địa chỉ: {contactInfo.address}</p>
            </div>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground">
            &copy; 2024{" "}
            <span className="text-primary font-medium">{companyName}</span>. Tất
            cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}
