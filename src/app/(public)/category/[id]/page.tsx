"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import categoryApiRequest from "@/app/apiRequests/category";
import { GetCategoryDetailResType } from "@/schemaValidations/category.model";
import productApiRequest from '@/app/apiRequests/product';
import { GetProductDetailResType, GetProductsQueryType } from '@/schemaValidations/product.model';
import { GetAllCategoriesResType, CategoryType } from "@/schemaValidations/category.model";

export default function CategoryDetailPage() {
  const params = useParams();
  const [category, setCategory] = useState<GetCategoryDetailResType | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [allCategories, setAllCategories] = useState<CategoryType[]>([]);
  const [selectedFilterCategoryIds, setSelectedFilterCategoryIds] = useState<number[]>([]);
  const [displayLimit, setDisplayLimit] = useState(12);

  useEffect(() => {
    fetchCategory();
    fetchAllCategories();
  }, [params.id]);

  useEffect(() => {
    fetchProducts();
  }, [search, selectedFilterCategoryIds, params.id]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await categoryApiRequest.getCategory(Number(params.id));
      setCategory(response?.payload);
    } catch (error) {
      console.error("Error fetching category:", error);
      setCategory(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCategories = async () => {
    try {
      const response = await categoryApiRequest.listCategory();
      setAllCategories(response?.payload?.data || []);
    } catch (error) {
      console.error("Error fetching all categories:", error);
      setAllCategories([]);
    }
  };

  const fetchProducts = async () => {
    try {
      const queryParams: GetProductsQueryType = {
        page: 1,
        limit: 999,
        orderBy: "desc",
        sortBy: "createdAt",
        categories: [...(params.id ? [Number(params.id)] : []), ...selectedFilterCategoryIds],
        name: search.trim() || undefined,
      };
      const response = await productApiRequest.listProduct(queryParams);
      setProducts(response?.payload?.data || []);
      setFilteredProducts(response?.payload?.data || []);
      setDisplayLimit(12);
    } catch (error) {
      setProducts([]);
      setFilteredProducts([]);
      setDisplayLimit(12);
    }
  };

  const handleCategoryFilterChange = (categoryId: number) => {
    setSelectedFilterCategoryIds(prevIds => {
      if (prevIds.includes(categoryId)) {
        return prevIds.filter(id => id !== categoryId);
      } else {
        return [...prevIds, categoryId];
      }
    });
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedFilterCategoryIds([]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold">Không tìm thấy danh mục</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar bộ lọc/tìm kiếm */}
        <div className="col-span-1">
          <div className="mb-6 p-4 border rounded-lg bg-white">
            <h2 className="font-bold text-lg mb-4">Tìm kiếm</h2>
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-4 py-2 border rounded mb-4"
            />
          </div>
          <div className="mb-6 p-4 border rounded-lg bg-white">
            <h2 className="font-bold text-lg mb-4">Lọc theo Danh mục</h2>
            {allCategories.length === 0 && <p className="text-gray-500">Không có danh mục để lọc.</p>}
            {allCategories.map(cat => (
              <div key={cat.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`category-${cat.id}`}
                  checked={selectedFilterCategoryIds.includes(cat.id)}
                  onChange={() => handleCategoryFilterChange(cat.id)}
                  className="mr-2"
                />
                <label htmlFor={`category-${cat.id}`} className="text-gray-700">
                  {cat.name}
                </label>
              </div>
            ))}
          </div>
          <Button 
            onClick={handleClearFilters} 
            className="w-full bg-red-500 hover:bg-red-600 text-white"
          >
            Xóa bộ lọc
          </Button>
        </div>
        {/* Danh sách sản phẩm */}
        <div className="col-span-1 md:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.length === 0 && (
              <div className="col-span-full text-center text-gray-500">Không có sản phẩm nào trong danh mục này.</div>
            )}
            {filteredProducts.slice(0, displayLimit).map(product => (
              <div key={product.id} className="border rounded-lg overflow-hidden shadow-sm flex flex-col">
                <div className="aspect-square w-full relative">
                  <img 
                    src={product.images?.[0] || '/placeholder.png'} 
                    alt={product.name} 
                    className="object-cover w-full h-full" 
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <div className="text-primary font-bold mb-2">{product.basePrice?.toLocaleString('vi-VN')}đ</div>
                  <div className="flex-1" />
                  <a href={`/product/${product.id}`} className="mt-2 block w-full text-center bg-primary text-white py-2 rounded hover:bg-primary/90">Xem chi tiết</a>
                </div>
              </div>
            ))}
          </div>
          {filteredProducts.length > displayLimit && (
            <div className="text-center mt-8">
              <Button onClick={() => setDisplayLimit(prevLimit => prevLimit + 12)}>
                Xem thêm
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 