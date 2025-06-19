// "use client";

// import { useState, useEffect } from "react";
// import { Filter, Grid3X3, List, X, ArrowUpDown } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import type { Product } from "@/types";
// import { mockAllProducts } from "@/lib/mockData";
// import ProductFilters from "./product-filter";
// import ProductCard from "./product-card";
// import { useListProducts } from "@/app/queries/useProduct";
// import { ProductType } from "@/shared/models/shared-product.model";

// const sortOptions = [
//   { value: "newest", label: "Mới nhất" },
//   { value: "price-low", label: "Giá thấp đến cao" },
//   { value: "price-high", label: "Giá cao đến thấp" },
//   { value: "rating", label: "Đánh giá cao nhất" },
//   { value: "popular", label: "Phổ biến nhất" },
// ];

// export default function ProductsPage() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

//   // Filter states
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("Tất cả");
//   const [selectedBrand, setSelectedBrand] = useState("Tất cả");
//   const [selectedColors, setSelectedColors] = useState<string[]>([]);
//   const [priceRange, setPriceRange] = useState([0, 3000000]);
//   const [sortBy, setSortBy] = useState("newest");
//   const [showOnSale, setShowOnSale] = useState(false);
//   const [minRating, setMinRating] = useState(0);

//   const { data: listProduct, isLoading } = useListProducts({
//     page: 1,
//     limit: 10,
//   });
//   if (!listProduct) {
//     return;
//   }
//   const getProducts = listProduct.payload.data;

//   const clearFilters = () => {
//     setSearchQuery("");
//     setSelectedCategory("Tất cả");
//     setSelectedBrand("Tất cả");
//     setSelectedColors([]);
//     setPriceRange([0, 3000000]);
//     setSortBy("newest");
//     setShowOnSale(false);
//     setMinRating(0);
//   };

//   const handleAddToCart = (product: ProductType) => {
//     console.log("Add to cart:", product);
//   };

//   const handleToggleFavorite = (product: ProductType) => {
//     console.log("Toggle favorite:", product);
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Hero Section */}
//       <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
//         <div className="container mx-auto px-4 text-center">
//           <h1 className="text-5xl font-bold mb-4">Bộ Sưu Tập Thời Trang</h1>
//           <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//             Khám phá hàng nghìn sản phẩm thời trang cao cấp với chất lượng tuyệt
//             vời
//           </p>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-8">
//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Desktop Filters Sidebar */}
//           <div className="hidden lg:block w-80 flex-shrink-0">
//             <ProductFilters
//               selectedCategory={selectedCategory}
//               setSelectedCategory={setSelectedCategory}
//               selectedBrand={selectedBrand}
//               setSelectedBrand={setSelectedBrand}
//               priceRange={priceRange}
//               setPriceRange={setPriceRange}
//               selectedColors={selectedColors}
//               setSelectedColors={setSelectedColors}
//               minRating={minRating}
//               setMinRating={setMinRating}
//               showOnSale={showOnSale}
//               setShowOnSale={setShowOnSale}
//               onClearFilters={clearFilters}
//             />
//           </div>

//           {/* Main Content */}
//           <div className="flex-1">
//             {/* Toolbar */}
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
//               <div className="flex items-center space-x-4">
//                 {/* Mobile Filter Button */}
//                 <Sheet>
//                   <SheetTrigger asChild>
//                     <Button variant="outline" className="lg:hidden">
//                       <Filter className="h-4 w-4 mr-2" />
//                       Bộ lọc
//                     </Button>
//                   </SheetTrigger>
//                   <SheetContent side="left" className="w-80 overflow-y-auto">
//                     <SheetHeader>
//                       <SheetTitle>Bộ lọc sản phẩm</SheetTitle>
//                     </SheetHeader>
//                     <div className="mt-6">
//                       <ProductFilters
//                         selectedCategory={selectedCategory}
//                         setSelectedCategory={setSelectedCategory}
//                         selectedBrand={selectedBrand}
//                         setSelectedBrand={setSelectedBrand}
//                         priceRange={priceRange}
//                         setPriceRange={setPriceRange}
//                         selectedColors={selectedColors}
//                         setSelectedColors={setSelectedColors}
//                         minRating={minRating}
//                         setMinRating={setMinRating}
//                         showOnSale={showOnSale}
//                         setShowOnSale={setShowOnSale}
//                         onClearFilters={clearFilters}
//                       />
//                     </div>
//                   </SheetContent>
//                 </Sheet>

//                 <div className="text-muted-foreground">
//                   <span className="font-semibold text-foreground">
//                     {getProducts.length}
//                   </span>{" "}
//                   sản phẩm
//                 </div>
//               </div>

//               <div className="flex items-center space-x-4">
//                 {/* Sort */}
//                 <Select value={sortBy} onValueChange={setSortBy}>
//                   <SelectTrigger className="w-48">
//                     <ArrowUpDown className="h-4 w-4 mr-2" />
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {sortOptions.map((option) => (
//                       <SelectItem key={option.value} value={option.value}>
//                         {option.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>

//                 {/* View Mode */}
//                 <div className="flex border border-muted rounded-lg p-1">
//                   <Button
//                     variant={viewMode === "grid" ? "default" : "ghost"}
//                     size="sm"
//                     onClick={() => setViewMode("grid")}
//                   >
//                     <Grid3X3 className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     variant={viewMode === "list" ? "default" : "ghost"}
//                     size="sm"
//                     onClick={() => setViewMode("list")}
//                   >
//                     <List className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             </div>

//             {/* Active Filters */}
//             {(selectedCategory !== "Tất cả" ||
//               selectedBrand !== "Tất cả" ||
//               showOnSale ||
//               minRating > 0) && (
//               <div className="flex flex-wrap gap-2 mb-6">
//                 {selectedCategory !== "Tất cả" && (
//                   <Badge variant="secondary" className="px-3 py-1">
//                     {selectedCategory}
//                     <button
//                       onClick={() => setSelectedCategory("Tất cả")}
//                       className="ml-2 hover:text-destructive"
//                     >
//                       <X className="h-3 w-3" />
//                     </button>
//                   </Badge>
//                 )}
//                 {selectedBrand !== "Tất cả" && (
//                   <Badge variant="secondary" className="px-3 py-1">
//                     {selectedBrand}
//                     <button
//                       onClick={() => setSelectedBrand("Tất cả")}
//                       className="ml-2 hover:text-destructive"
//                     >
//                       <X className="h-3 w-3" />
//                     </button>
//                   </Badge>
//                 )}
//                 {showOnSale && (
//                   <Badge variant="secondary" className="px-3 py-1">
//                     Giảm giá
//                     <button
//                       onClick={() => setShowOnSale(false)}
//                       className="ml-2 hover:text-destructive"
//                     >
//                       <X className="h-3 w-3" />
//                     </button>
//                   </Badge>
//                 )}
//                 {minRating > 0 && (
//                   <Badge variant="secondary" className="px-3 py-1">
//                     {minRating}+ sao
//                     <button
//                       onClick={() => setMinRating(0)}
//                       className="ml-2 hover:text-destructive"
//                     >
//                       <X className="h-3 w-3" />
//                     </button>
//                   </Badge>
//                 )}
//               </div>
//             )}

//             {/* Products Grid/List */}
//             {isLoading ? (
//               <div
//                 className={`grid gap-6 ${
//                   viewMode === "grid"
//                     ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
//                     : "grid-cols-1"
//                 }`}
//               >
//                 {[...Array(12)].map((_, i) => (
//                   <div
//                     key={i}
//                     className="border-2 rounded-3xl overflow-hidden animate-pulse"
//                   >
//                     <div className="aspect-[4/5] bg-muted" />
//                     <div className="p-4 space-y-2">
//                       <div className="h-4 bg-muted rounded" />
//                       <div className="h-4 bg-muted rounded w-2/3" />
//                       <div className="h-6 bg-muted rounded w-1/2" />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : getProducts.length === 0 ? (
//               <div className="text-center py-20">
//                 <div className="text-6xl mb-4">🔍</div>
//                 <h3 className="text-2xl font-bold mb-2">
//                   Không tìm thấy sản phẩm
//                 </h3>
//                 <p className="text-muted-foreground mb-6">
//                   Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
//                 </p>
//                 <Button onClick={clearFilters}>Xóa tất cả bộ lọc</Button>
//               </div>
//             ) : (
//               <div
//                 className={`grid gap-6 ${
//                   viewMode === "grid"
//                     ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
//                     : "grid-cols-1"
//                 }`}
//               >
//                 {getProducts.map((product) => (
//                   <ProductCard
//                     key={product.id}
//                     product={product}
//                     viewMode={viewMode}
//                     onAddToCart={handleAddToCart}
//                     onToggleFavorite={handleToggleFavorite}
//                   />
//                 ))}
//               </div>
//             )}

//             {/* Load More */}
//             {getProducts.length > 0 && (
//               <div className="text-center mt-12">
//                 <Button size="lg" variant="outline">
//                   Xem thêm sản phẩm
//                 </Button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { Filter, Grid3X3, List, X, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ProductType } from "@/shared/models/shared-product.model";
import { useGetProduct, useListProducts } from "@/app/queries/useProduct";
import ProductFilters from "./product-filter";
import ProductCard from "./product-card";
import { useAppContext } from "@/components/app-provider";

const sortOptions = [
  { value: "newest", label: "Mới nhất" },
  { value: "price-low", label: "Giá thấp đến cao" },
  { value: "price-high", label: "Giá cao đến thấp" },
  { value: "rating", label: "Đánh giá cao nhất" },
  { value: "popular", label: "Phổ biến nhất" },
];

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedBrand, setSelectedBrand] = useState("Tất cả");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 3000000]);
  const [sortBy, setSortBy] = useState("newest");
  const [showOnSale, setShowOnSale] = useState(false);
  const [minRating, setMinRating] = useState(0);

  const {
    data: listProduct,
    isLoading,
    isFetching,
  } = useListProducts({
    page,
    limit: 10,
  });
  useEffect(() => {
    if (listProduct?.payload.data) {
      setAllProducts((prev) => {
        const newProducts = listProduct.payload.data.filter(
          (newProduct) => !prev.some((p) => p.id === newProduct.id)
        );
        return [...prev, ...newProducts];
      });
    }
  }, [listProduct]);

  const totalPages = listProduct?.payload.totalPages ?? 0;
  const hasMore = page < totalPages;

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("Tất cả");
    setSelectedBrand("Tất cả");
    setSelectedColors([]);
    setPriceRange([0, 3000000]);
    setSortBy("newest");
    setShowOnSale(false);
    setMinRating(0);
    setAllProducts([]);
    setPage(1);
  };

  const handleToggleFavorite = (product: ProductType) => {
    console.log("Toggle favorite:", product);
  };

  const handleLoadMore = () => {
    if (hasMore && !isFetching) {
      setPage((prev) => prev + 1);
    }
  };

  // Lọc và sắp xếp sản phẩm (như code trước)
  const filteredProducts = allProducts.filter((product) => {
    if (selectedBrand !== "Tất cả" && product.brandId) {
      // Cần ánh xạ brandId sang tên brand
      if (product.brandId.toString() !== selectedBrand) return false;
    }
    if (
      product.virtualPrice < priceRange[0] ||
      product.virtualPrice > priceRange[1]
    )
      return false;
    if (selectedColors.length > 0) {
      const productColors =
        product.variants?.find((v) => v.value === "color")?.options || [];
      if (!selectedColors.some((color) => productColors.includes(color)))
        return false;
    }
    // if (showOnSale && product.basePrice === product.virtualPrice) return false;
    // if (minRating > 0 && (!product.rating || product.rating < minRating))
    //   return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "price-low":
        return a.virtualPrice - b.virtualPrice;
      case "price-high":
        return b.virtualPrice - a.virtualPrice;
      // case "rating":
      //   return (b.rating || 0) - (a.rating || 0);
      // case "popular":
      //   return (b.popularity || 0) - (a.popularity || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Bộ Sưu Tập Thời Trang</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Khám phá hàng nghìn sản phẩm thời trang cao cấp với chất lượng tuyệt
            vời
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <ProductFilters
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedColors={selectedColors}
              setSelectedColors={setSelectedColors}
              minRating={minRating}
              setMinRating={setMinRating}
              showOnSale={showOnSale}
              setShowOnSale={setShowOnSale}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center space-x-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <Filter className="h-4 w-4 mr-2" />
                      Bộ lọc
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Bộ lọc sản phẩm</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <ProductFilters
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        selectedBrand={selectedBrand}
                        setSelectedBrand={setSelectedBrand}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        selectedColors={selectedColors}
                        setSelectedColors={setSelectedColors}
                        minRating={minRating}
                        setMinRating={setMinRating}
                        showOnSale={showOnSale}
                        setShowOnSale={setShowOnSale}
                        onClearFilters={clearFilters}
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {sortedProducts.length}
                  </span>{" "}
                  sản phẩm
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex border border-muted rounded-lg p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategory !== "Tất cả" ||
              selectedBrand !== "Tất cả" ||
              showOnSale ||
              minRating > 0) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategory !== "Tất cả" && (
                  <Badge variant="secondary" className="px-3 py-1">
                    {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory("Tất cả")}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {selectedBrand !== "Tất cả" && (
                  <Badge variant="secondary" className="px-3 py-1">
                    {selectedBrand}
                    <button
                      onClick={() => setSelectedBrand("Tất cả")}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {showOnSale && (
                  <Badge variant="secondary" className="px-3 py-1">
                    Giảm giá
                    <button
                      onClick={() => setShowOnSale(false)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {minRating > 0 && (
                  <Badge variant="secondary" className="px-3 py-1">
                    {minRating}+ sao
                    <button
                      onClick={() => setMinRating(0)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}

            {/* Products Grid/List */}
            {isLoading && page === 1 ? (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="border-2 rounded-3xl overflow-hidden animate-pulse"
                  >
                    <div className="aspect-[4/5] bg-muted" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-4 bg-muted rounded w-2/3" />
                      <div className="h-6 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold mb-2">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-muted-foreground mb-6">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </p>
                <Button onClick={clearFilters}>Xóa tất cả bộ lọc</Button>
              </div>
            ) : (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}

            {/* Load More */}
            {sortedProducts.length > 0 && hasMore && (
              <div className="text-center mt-12">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={isFetching}
                >
                  {isFetching ? "Đang tải..." : "Xem thêm sản phẩm"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
