import type {
  ProductDetail,
  Review,
  Product,
  Slide,
  Brand,
  Category,
} from "@/types";

// Mock slides data for homepage
export const mockSlides: Slide[] = [
  {
    id: 1,
    title: "Bộ Sưu Tập Mùa Hè 2024",
    subtitle: "Khám phá phong cách thời trang mới nhất",
    image: "/placeholder.svg?height=600&width=1200&text=Summer+Collection+2024",
    cta: "Mua Ngay",
  },
  {
    id: 2,
    title: "Thời Trang Công Sở",
    subtitle: "Lịch lãm và chuyên nghiệp",
    image: "/placeholder.svg?height=600&width=1200&text=Office+Fashion",
    cta: "Khám Phá",
  },
  {
    id: 3,
    title: "Phong Cách Casual",
    subtitle: "Thoải mái cho mọi hoạt động",
    image: "/placeholder.svg?height=600&width=1200&text=Casual+Style",
    cta: "Xem Thêm",
  },
];

// Mock brands data
export const mockBrands: Brand[] = [
  { name: "Zara", logo: "/placeholder.svg?height=80&width=120&text=ZARA" },
  { name: "H&M", logo: "/placeholder.svg?height=80&width=120&text=H%26M" },
  { name: "Uniqlo", logo: "/placeholder.svg?height=80&width=120&text=UNIQLO" },
  { name: "Nike", logo: "/placeholder.svg?height=80&width=120&text=NIKE" },
  { name: "Adidas", logo: "/placeholder.svg?height=80&width=120&text=ADIDAS" },
  { name: "Gucci", logo: "/placeholder.svg?height=80&width=120&text=GUCCI" },
  {
    name: "Louis Vuitton",
    logo: "/placeholder.svg?height=80&width=120&text=LV",
  },
  { name: "Chanel", logo: "/placeholder.svg?height=80&width=120&text=CHANEL" },
  { name: "Puma", logo: "/placeholder.svg?height=80&width=120&text=CHANEL" },
];

// Mock categories data
export const mockCategories: Category[] = [
  {
    name: "Áo Sơ Mi",
    image: "/placeholder.svg?height=300&width=250&text=Áo+Sơ+Mi",
    count: "120+ sản phẩm",
  },
  {
    name: "Quần Jeans",
    image: "/placeholder.svg?height=300&width=250&text=Quần+Jeans",
    count: "85+ sản phẩm",
  },
  {
    name: "Váy Đầm",
    image: "/placeholder.svg?height=300&width=250&text=Váy+Đầm",
    count: "95+ sản phẩm",
  },
  {
    name: "Áo Khoác",
    image: "/placeholder.svg?height=300&width=250&text=Áo+Khoác",
    count: "60+ sản phẩm",
  },
  {
    name: "Giày Dép",
    image: "/placeholder.svg?height=300&width=250&text=Giày+Dép",
    count: "150+ sản phẩm",
  },
  {
    name: "Phụ Kiện",
    image: "/placeholder.svg?height=300&width=250&text=Phụ+Kiện",
    count: "200+ sản phẩm",
  },
];

// Mock products data for homepage
export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Áo Sơ Mi Trắng Classic",
    price: "599,000",
    originalPrice: "799,000",
    image: "/placeholder.svg?height=400&width=300&text=Áo+Sơ+Mi+Trắng",
    rating: 4.8,
    reviews: 124,
    category: "Áo Sơ Mi",
  },
  {
    id: 2,
    name: "Quần Jeans Skinny Fit",
    price: "899,000",
    originalPrice: "1,199,000",
    image: "/placeholder.svg?height=400&width=300&text=Quần+Jeans+Skinny",
    rating: 4.6,
    reviews: 89,
    category: "Quần Jeans",
  },
  {
    id: 3,
    name: "Váy Maxi Hoa Nhí",
    price: "1,299,000",
    originalPrice: null,
    image: "/placeholder.svg?height=400&width=300&text=Váy+Maxi+Hoa",
    rating: 4.9,
    reviews: 156,
    category: "Váy Đầm",
  },
  {
    id: 4,
    name: "Áo Khoác Blazer",
    price: "1,599,000",
    originalPrice: "1,999,000",
    image: "/placeholder.svg?height=400&width=300&text=Áo+Khoác+Blazer",
    rating: 4.7,
    reviews: 67,
    category: "Áo Khoác",
  },
  {
    id: 5,
    name: "Giày Sneaker Trắng",
    price: "1,899,000",
    originalPrice: null,
    image: "/placeholder.svg?height=400&width=300&text=Giày+Sneaker",
    rating: 4.8,
    reviews: 203,
    category: "Giày Dép",
  },
  {
    id: 6,
    name: "Túi Xách Tote",
    price: "799,000",
    originalPrice: "999,000",
    image: "/placeholder.svg?height=400&width=300&text=Túi+Xách+Tote",
    rating: 4.5,
    reviews: 91,
    category: "Phụ Kiện",
  },
];

// Mock product detail data
export const mockProductDetail: ProductDetail = {
  id: 1,
  name: "Áo Sơ Mi Premium Luxury Collection",
  price: "1,299,000",
  originalPrice: "1,899,000",
  image: "/placeholder.svg?height=800&width=600&text=Main+Product+Image",
  images: [
    "/placeholder.svg?height=800&width=600&text=Main+View",
    "/placeholder.svg?height=800&width=600&text=Front+Detail",
    "/placeholder.svg?height=800&width=600&text=Back+View",
    "/placeholder.svg?height=800&width=600&text=Side+Profile",
    "/placeholder.svg?height=800&width=600&text=Fabric+Close-up",
    "/placeholder.svg?height=800&width=600&text=Model+Wearing",
  ],
  rating: 4.9,
  reviews: 247,
  category: "Áo Sơ Mi",
  description:
    "Áo sơ mi cao cấp từ bộ sưu tập Luxury Collection, được chế tác từ chất liệu cotton Pima 100% nhập khẩu từ Peru. Thiết kế tinh tế với đường cắt may hoàn hảo, mang đến vẻ ngoài lịch lãm và sang trọng cho phái mạnh hiện đại.",
  features: [
    "Chất liệu Cotton Pima 100% cao cấp từ Peru",
    "Thiết kế Slim Fit ôm dáng hoàn hảo",
    "Công nghệ kháng khuẩn và khử mùi tự nhiên",
    "Xử lý chống nhăn và dễ dàng bảo quản",
    "Đường may tinh xảo với chỉ may cao cấp",
    "Cúc áo được làm từ trai biển tự nhiên",
  ],
  sizes: ["S", "M", "L", "XL", "XXL"],
  colors: [
    { name: "Trắng Tinh Khiết", value: "#FFFFFF" },
    { name: "Xanh Navy Cổ Điển", value: "#1e3a8a" },
    { name: "Hồng Pastel Nhẹ Nhàng", value: "#fce7f3" },
    { name: "Xám Charcoal Sang Trọng", value: "#374151" },
  ],
  stock: 28,
  sku: "LUX-ASM-001-2024",
  brand: "FashionStore Luxury",
  material: "100% Cotton Pima Peru",
  careInstructions: [
    "Giặt máy ở nhiệt độ không quá 30°C",
    "Sử dụng chế độ giặt nhẹ cho vải cao cấp",
    "Không sử dụng chất tẩy có chứa clo",
    "Ủi ở nhiệt độ trung bình với hơi nước",
    "Không giặt khô bằng hóa chất mạnh",
    "Phơi nơi thoáng mát, tránh ánh nắng trực tiếp",
  ],
};

// Mock reviews data
export const mockReviews: Review[] = [
  {
    id: 1,
    user: "Nguyễn Minh Hoàng",
    avatar: "/placeholder.svg?height=50&width=50&text=NH",
    rating: 5,
    comment:
      "Chất lượng áo thực sự xuất sắc! Vải cotton Pima mềm mại, thoáng khí và r���t thoải mái khi mặc. Thiết kế slim fit ôm vừa vặn, không quá chật. Đặc biệt là màu trắng rất đẹp, không bị ố sau nhiều lần giặt. Rất đáng đồng tiền bát gạo!",
    date: "2024-01-20",
    helpful: 24,
  },
  {
    id: 2,
    user: "Trần Thị Lan Anh",
    avatar: "/placeholder.svg?height=50&width=50&text=LA",
    rating: 5,
    comment:
      "Mua tặng chồng và anh ấy rất thích. Áo có form dáng đẹp, chất liệu cao cấp. Giao hàng nhanh, đóng gói cẩn thận. Sẽ ủng hộ shop tiếp!",
    date: "2024-01-18",
    helpful: 18,
  },
  {
    id: 3,
    user: "Lê Văn Đức",
    avatar: "/placeholder.svg?height=50&width=50&text=LD",
    rating: 4,
    comment:
      "Áo đẹp, chất lượng tốt. Tuy nhiên giá hơi cao so với mặt bằng chung. Nhưng xét về chất lượng thì xứng đáng. Màu xanh navy rất sang trọng.",
    date: "2024-01-15",
    helpful: 12,
  },
  {
    id: 4,
    user: "Phạm Thị Mai",
    avatar: "/placeholder.svg?height=50&width=50&text=PM",
    rating: 5,
    comment:
      "Lần đầu mua hàng ở shop, chất lượng vượt mong đợi. Áo có độ hoàn thiện cao, đường may chắc chắn. Nhân viên tư vấn nhiệt tình. Sẽ giới thiệu cho bạn bè!",
    date: "2024-01-12",
    helpful: 31,
  },
  {
    id: 5,
    user: "Hoàng Văn Nam",
    avatar: "/placeholder.svg?height=50&width=50&text=HN",
    rating: 5,
    comment:
      "Áo sơ mi chất lượng premium thật sự. Mặc lên rất lịch lãm, phù hợp đi làm và dự tiệc. Cotton Pima mềm mại, không bị nhăn. Highly recommended!",
    date: "2024-01-08",
    helpful: 19,
  },
  {
    id: 6,
    user: "Vũ Thị Hương",
    avatar: "/placeholder.svg?height=50&width=50&text=VH",
    rating: 4,
    comment:
      "Mua cho bố và ông rất hài lòng. Chất liệu tốt, thiết kế đẹp. Chỉ có điều size hơi to so với bảng size. Nên tham khảo kỹ trước khi đặt hàng.",
    date: "2024-01-05",
    helpful: 8,
  },
];

// Mock related products
export const mockRelatedProducts: Product[] = [
  {
    id: 2,
    name: "Áo Sơ Mi Kẻ Sọc Vintage",
    price: "999,000",
    originalPrice: "1,299,000",
    image: "/placeholder.svg?height=400&width=300&text=Áo+Kẻ+Sọc",
    rating: 4.7,
    reviews: 156,
    category: "Áo Sơ Mi",
  },
  {
    id: 3,
    name: "Áo Sơ Mi Linen Mùa Hè",
    price: "1,199,000",
    originalPrice: null,
    image: "/placeholder.svg?height=400&width=300&text=Áo+Linen",
    rating: 4.8,
    reviews: 203,
    category: "Áo Sơ Mi",
  },
  {
    id: 4,
    name: "Áo Sơ Mi Denim Cao Cấp",
    price: "1,499,000",
    originalPrice: "1,799,000",
    image: "/placeholder.svg?height=400&width=300&text=Áo+Denim",
    rating: 4.6,
    reviews: 134,
    category: "Áo Sơ Mi",
  },
  {
    id: 5,
    name: "Áo Sơ Mi Oxford Classic",
    price: "1,399,000",
    originalPrice: null,
    image: "/placeholder.svg?height=400&width=300&text=Áo+Oxford",
    rating: 4.9,
    reviews: 189,
    category: "Áo Sơ Mi",
  },
  {
    id: 6,
    name: "Áo Sơ Mi Flannel Ấm Áp",
    price: "1,099,000",
    originalPrice: "1,399,000",
    image: "/placeholder.svg?height=400&width=300&text=Áo+Flannel",
    rating: 4.5,
    reviews: 98,
    category: "Áo Sơ Mi",
  },
  {
    id: 7,
    name: "Áo Sơ Mi Bamboo Eco",
    price: "899,000",
    originalPrice: null,
    image: "/placeholder.svg?height=400&width=300&text=Áo+Bamboo",
    rating: 4.7,
    reviews: 167,
    category: "Áo Sơ Mi",
  },
];

// Additional mock products for variety
export const mockAllProducts: Product[] = [
  ...mockProducts,
  {
    id: 7,
    name: "Quần Tây Công Sở",
    price: "1,199,000",
    originalPrice: "1,499,000",
    image: "/placeholder.svg?height=400&width=300&text=Quần+Tây",
    rating: 4.6,
    reviews: 78,
    category: "Quần Tây",
  },
  {
    id: 8,
    name: "Áo Polo Nam Cao Cấp",
    price: "699,000",
    originalPrice: null,
    image: "/placeholder.svg?height=400&width=300&text=Áo+Polo",
    rating: 4.7,
    reviews: 145,
    category: "Áo Polo",
  },
  {
    id: 9,
    name: "Giày Oxford Da Thật",
    price: "2,299,000",
    originalPrice: "2,799,000",
    image: "/placeholder.svg?height=400&width=300&text=Giày+Oxford",
    rating: 4.8,
    reviews: 234,
    category: "Giày Dép",
  },
  {
    id: 10,
    name: "Thắt Lưng Da Cao Cấp",
    price: "599,000",
    originalPrice: "799,000",
    image: "/placeholder.svg?height=400&width=300&text=Thắt+Lưng",
    rating: 4.5,
    reviews: 89,
    category: "Phụ Kiện",
  },
];

// Function to get product by ID
export const getProductById = (id: number): ProductDetail | null => {
  if (id === 1) {
    return mockProductDetail;
  }

  // For other IDs, convert from regular product to detailed product
  const product = mockAllProducts.find((p) => p.id === id);
  if (!product) return null;

  return {
    ...product,
    images: [
      product.image,
      product.image.replace("text=", "text=Front+"),
      product.image.replace("text=", "text=Back+"),
      product.image.replace("text=", "text=Side+"),
      product.image.replace("text=", "text=Detail+"),
    ],
    description: `Sản phẩm ${product.name} cao cấp với chất lượng tuyệt vời. Thiết kế hiện đại, phù hợp với xu hướng thời trang mới nhất.`,
    features: [
      "Chất liệu cao cấp, bền đẹp",
      "Thiết kế hiện đại, thời trang",
      "Thoải mái khi sử dụng",
      "Dễ dàng bảo quản",
      "Phù hợp nhiều dịp khác nhau",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Đen", value: "#000000" },
      { name: "Trắng", value: "#FFFFFF" },
      { name: "Xanh", value: "#0066CC" },
    ],
    stock: Math.floor(Math.random() * 50) + 10,
    sku: `PRD-${id.toString().padStart(3, "0")}-2024`,
    brand: "FashionStore",
    material: "Chất liệu cao cấp",
    careInstructions: [
      "Giặt máy ở nhiệt độ 30°C",
      "Không sử dụng chất tẩy",
      "Ủi ở nhiệt độ trung bình",
      "Bảo quản nơi khô ráo",
    ],
  };
};

// Function to get reviews by product ID
export const getReviewsByProductId = (productId: number): Review[] => {
  if (productId === 1) {
    return mockReviews;
  }

  // Generate mock reviews for other products
  const reviewCount = Math.floor(Math.random() * 5) + 3;
  return Array.from({ length: reviewCount }, (_, index) => ({
    id: index + 1,
    user: `Người dùng ${index + 1}`,
    avatar: `/placeholder.svg?height=50&width=50&text=U${index + 1}`,
    rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
    comment: `Sản phẩm rất tốt, chất lượng cao. Tôi rất hài lòng với sự lựa chọn này. Sẽ giới thiệu cho bạn bè.`,
    date: `2024-01-${(15 + index).toString().padStart(2, "0")}`,
    helpful: Math.floor(Math.random() * 20) + 5,
  }));
};

// Function to get related products
export const getRelatedProducts = (
  productId: number,
  category: string
): Product[] => {
  if (productId === 1) {
    return mockRelatedProducts.slice(0, 4);
  }

  // Filter products by category and exclude current product
  return mockAllProducts
    .filter((p) => p.category === category && p.id !== productId)
    .slice(0, 4);
};
