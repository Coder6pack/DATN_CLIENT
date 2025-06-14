'use client';

import CategoryProducts from './CategoryProducts';
import { GetProductsResType } from "@/schemaValidations/product.model";

interface CategoryProductsListProps {
  products: GetProductsResType["data"];
}

const CategoryProductsList = ({ products }: CategoryProductsListProps) => {
  // Nhóm sản phẩm theo danh mục
  const productsByCategory = products.reduce((acc, product) => {
    const category = product.categories[0]?.name || 'Khác';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, typeof products>);

  return (
    <div className="space-y-16">
      {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
        <CategoryProducts
          key={category}
          title={category.toUpperCase()}
          products={categoryProducts}
          category={category}
        />
      ))}
    </div>
  );
};

export default CategoryProductsList; 