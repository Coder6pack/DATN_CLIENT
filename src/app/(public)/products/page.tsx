// "use client";

// import { useState, useEffect, useMemo } from "react";
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
// import { ProductType } from "@/shared/models/shared-product.model";
// import { useFilterProducts } from "@/app/queries/useProduct";
// import { useListCategories } from "@/app/queries/useCategory";
// import ProductFilters from "./product-filter";
// import ProductCard from "./product-card";
// import { GetProductsQueryType } from "@/schemaValidations/product.model";
// import { useListBrand } from "@/app/queries/useBrand";

// const sortOptions = [
//   { value: "newest", label: "Mới nhất" },
//   { value: "price-low", label: "Giá thấp đến cao" },
//   { value: "price-high", label: "Giá cao đến thấp" },
//   { value: "rating", label: "Đánh giá cao nhất" },
// ];

// function buildQueryString(params: GetProductsQueryType): string {
//   const queryParts: string[] = [];
//   Object.entries(params).forEach(([key, value]) => {
//     if (value === undefined) return;
//     if (Array.isArray(value)) {
//       if (value.length > 0) {
//         queryParts.push(`${key}=${encodeURIComponent(value.join(","))}`);
//       }
//     } else if (value !== "") {
//       queryParts.push(`${key}=${encodeURIComponent(value)}`);
//     }
//   });
//   return queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
// }

// export default function ProductsPage() {
//   const [page, setPage] = useState(1);
//   const [allProducts, setAllProducts] = useState<ProductType[]>([]);
//   const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

//   // Filter states
//   const [selectedCategory, setSelectedCategory] = useState("Tất cả");
//   const [selectedBrand, setSelectedBrand] = useState("Tất cả");
//   const [priceRange, setPriceRange] = useState([0, 3000000]);
//   const [sortBy, setSortBy] = useState("newest");
//   const [showOnSale, setShowOnSale] = useState(false);
//   const [minRating, setMinRating] = useState(0);

//   // Fetch categories and brands
//   const { data: cateList } = useListCategories();
//   const { data: brandList, refetch } = useListBrand();
//   // Map sortBy to API params
//   const getSortParams = () => {
//     switch (sortBy) {
//       case "price-low":
//         return { sortBy: "price" as const, orderBy: "asc" as const };
//       case "price-high":
//         return { sortBy: "price" as const, orderBy: "desc" as const };
//       case "newest":
//       default:
//         return { sortBy: "createdAt" as const, orderBy: "desc" as const };
//     }
//   };

//   // Get category ID
//   const selectedCategoryId = useMemo(() => {
//     if (selectedCategory === "Tất cả" || !cateList?.payload.data)
//       return undefined;
//     const category = cateList.payload.data.find(
//       (cat) => cat.name === selectedCategory
//     );
//     return category ? [category.id] : undefined;
//   }, [selectedCategory, cateList]);

//   // Build params for API
//   const params: GetProductsQueryType = {
//     page,
//     limit: 9,
//     ...getSortParams(),
//     brandIds: selectedBrand !== "Tất cả" ? [Number(selectedBrand)] : undefined,
//     categories: selectedCategory !== "Tất cả" ? selectedCategoryId : undefined,
//     minPrice: priceRange[0] || undefined,
//     maxPrice: priceRange[1] || undefined,
//   };

//   // Fetch products with filters
//   const {
//     data: listProduct,
//     isLoading,
//     isFetching,
//   } = useFilterProducts(params);

//   // Update products
//   useEffect(() => {
//     if (listProduct?.payload.data) {
//       setAllProducts((prev) => {
//         const newProducts = listProduct.payload.data.filter(
//           (newProduct) => !prev.some((p) => p.id === newProduct.id)
//         );
//         return [...prev, ...newProducts];
//       });
//     }
//   }, [listProduct]);

//   const totalPages = listProduct?.payload.totalPages ?? 0;
//   const hasMore = page < totalPages;

//   // Reset page and products when filters change
//   useEffect(() => {
//     setPage(1);
//     setAllProducts([]);
//   }, [
//     selectedCategory,
//     selectedBrand,
//     priceRange,
//     sortBy,
//     showOnSale,
//     minRating,
//   ]);

//   const clearFilters = () => {
//     setSelectedCategory("Tất cả");
//     setSelectedBrand("Tất cả");
//     setPriceRange([0, 3000000]);
//     setSortBy("newest");
//     setShowOnSale(false);
//     setMinRating(0);
//     setAllProducts([]);
//     setPage(1);
//   };

//   const handleToggleFavorite = (product: ProductType) => {
//     console.log("Toggle favorite:", product);
//   };

//   const handleLoadMore = () => {
//     if (hasMore && !isFetching) {
//       setPage((prev) => prev + 1);
//     }
//   };

//   // Client-side sorting
//   const sortedProducts = useMemo(() => {
//     return [...allProducts].sort((a, b) => {
//       switch (sortBy) {
//         case "newest":
//           return (
//             new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//           );
//         case "price-low":
//           return a.virtualPrice - b.virtualPrice;
//         case "price-high":
//           return b.virtualPrice - a.virtualPrice;
//         // case "rating":
//         //   return (b.rating || 0) - (a.rating || 0);
//         default:
//           return 0;
//       }
//     });
//   }, [allProducts, sortBy]);

//   // Update URL with query string
//   useEffect(() => {
//     const queryString = buildQueryString(params);
//     window.history.pushState({}, "", `/products${queryString}`);
//   }, [params]);

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
//               // searchQuery={searchQuery}
//               // setSearchQuery={setSearchQuery}
//               selectedCategory={selectedCategory}
//               setSelectedCategory={setSelectedCategory}
//               selectedBrand={selectedBrand}
//               setSelectedBrand={setSelectedBrand}
//               priceRange={priceRange}
//               setPriceRange={setPriceRange}
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
//                         // searchQuery={searchQuery}
//                         // setSearchQuery={setSearchQuery}
//                         selectedCategory={selectedCategory}
//                         setSelectedCategory={setSelectedCategory}
//                         selectedBrand={selectedBrand}
//                         setSelectedBrand={setSelectedBrand}
//                         priceRange={priceRange}
//                         setPriceRange={setPriceRange}
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
//                     {sortedProducts.length}
//                   </span>{" "}
//                   sản phẩm
//                 </div>
//               </div>

//               <div className="flex items-center space-x-4">
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
//                     {brandList?.payload.data.find(
//                       (brand) => brand.id.toString() === selectedBrand
//                     )?.name || selectedBrand}
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
//             {isLoading && page === 1 ? (
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
//             ) : sortedProducts.length === 0 ? (
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
//                 {sortedProducts.map((product) => (
//                   <ProductCard
//                     key={product.id}
//                     product={product}
//                     viewMode={viewMode}
//                     onToggleFavorite={handleToggleFavorite}
//                   />
//                 ))}
//               </div>
//             )}

//             {/* Load More */}
//             {sortedProducts.length > 0 && hasMore && (
//               <div className="text-center mt-12">
//                 <Button
//                   size="lg"
//                   variant="outline"
//                   onClick={handleLoadMore}
//                   disabled={isFetching}
//                 >
//                   {isFetching ? "Đang tải..." : "Xem thêm sản phẩm"}
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

import { useState, useEffect, useMemo } from "react";
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
import { useFilterProducts } from "@/app/queries/useProduct";
import { useListCategories } from "@/app/queries/useCategory";
import ProductFilters from "./product-filter";
import ProductCard from "./product-card";
import { GetProductsQueryType } from "@/schemaValidations/product.model";
import { useListBrand } from "@/app/queries/useBrand";

const sortOptions = [
  { value: "newest", label: "Mới nhất" },
  { value: "price-low", label: "Giá thấp đến cao" },
  { value: "price-high", label: "Giá cao đến thấp" },
  { value: "rating", label: "Đánh giá cao nhất" },
];

function buildQueryString(params: GetProductsQueryType): string {
  const queryParts: string[] = [];
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) return;
    if (Array.isArray(value)) {
      if (value.length > 0) {
        queryParts.push(`${key}=${encodeURIComponent(value.join(","))}`);
      }
    } else if (value !== "") {
      queryParts.push(`${key}=${encodeURIComponent(value)}`);
    }
  });
  return queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
}

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedBrand, setSelectedBrand] = useState("Tất cả");
  const [priceRange, setPriceRange] = useState([0, 3000000]);
  const [sortBy, setSortBy] = useState("newest");
  const [showOnSale, setShowOnSale] = useState(false);
  const [minRating, setMinRating] = useState(0);

  // Fetch categories and brands
  const { data: cateList } = useListCategories();
  const { data: brandList, refetch } = useListBrand();

  // Map sortBy to API params
  const getSortParams = () => {
    switch (sortBy) {
      case "price-low":
        return { sortBy: "price" as const, orderBy: "asc" as const };
      case "price-high":
        return { sortBy: "price" as const, orderBy: "desc" as const };
      case "newest":
      default:
        return { sortBy: "createdAt" as const, orderBy: "desc" as const };
    }
  };

  // Get category ID
  const selectedCategoryId = useMemo(() => {
    if (selectedCategory === "Tất cả" || !cateList?.payload.data)
      return undefined;
    const category = cateList.payload.data.find(
      (cat) => cat.name === selectedCategory
    );
    return category ? [category.id] : undefined;
  }, [selectedCategory, cateList]);

  // Build params for API
  const params: GetProductsQueryType = {
    page,
    limit: 9,
    ...getSortParams(),
    brandIds: selectedBrand !== "Tất cả" ? [Number(selectedBrand)] : undefined,
    categories: selectedCategory !== "Tất cả" ? selectedCategoryId : undefined,
    minPrice: priceRange[0] || undefined,
    maxPrice: priceRange[1] || undefined,
  };

  // Fetch products with filters
  const {
    data: listProduct,
    isLoading,
    isFetching,
  } = useFilterProducts(params);

  // Update products
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

  // Reset page and products when filters change
  useEffect(() => {
    setPage(1);
    setAllProducts([]);
  }, [
    selectedCategory,
    selectedBrand,
    priceRange,
    sortBy,
    showOnSale,
    minRating,
  ]);

  const clearFilters = () => {
    // Reset all filter states
    setSelectedCategory("Tất cả");
    setSelectedBrand("Tất cả");
    setPriceRange([0, 3000000]);
    setSortBy("newest");
    setShowOnSale(false);
    setMinRating(0);
    // Force reset products and page
    setAllProducts([]);
    setPage(1);
    // Trigger refetch of brands if needed
    refetch();
  };

  const handleToggleFavorite = (product: ProductType) => {
    console.log("Toggle favorite:", product);
  };

  const handleLoadMore = () => {
    if (hasMore && !isFetching) {
      setPage((prev) => prev + 1);
    }
  };

  // Client-side sorting
  const sortedProducts = useMemo(() => {
    return [...allProducts].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "price-low":
          return a.virtualPrice - b.virtualPrice;
        case "price-high":
          return b.virtualPrice - a.virtualPrice;
        default:
          return 0;
      }
    });
  }, [allProducts, sortBy]);

  // Update URL with query string
  useEffect(() => {
    const queryString = buildQueryString(params);
    window.history.pushState({}, "", `/products${queryString}`);
  }, [params]);

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
                    {brandList?.payload.data.find(
                      (brand) => brand.id.toString() === selectedBrand
                    )?.name || selectedBrand}
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
