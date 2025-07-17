"use client";

import type React from "react";

import { useState } from "react";
import { PlusCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import RichTextEditor from "./components/rich-text-editor";
import { FormProvider, useForm } from "react-hook-form";
import {
  CreateProductBodySchema,
  CreateProductBodyType,
} from "@/schemaValidations/product.model";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import MultiSelectCategory from "../../../components/mutil-select";
import InputNumber from "./components/input-number";
import ImageUpload from "./components/image-update";
import SkuListField from "./components/sku-list-field";
import VariantSettingsField from "./components/variant-settings-field";
import { useAddProductMutation } from "@/app/queries/useProduct";
import { useUploadFileMediaMutation } from "@/app/queries/useMedia";
import { toast } from "@/hooks/use-toast";
import {
  addBlobUrlsToFormData,
  addBlobUrlToFormData,
  handleHttpErrorApi,
} from "@/lib/utils";
import { useListBrand } from "@/app/queries/useBrand";
import { useListCategories } from "@/app/queries/useCategory";

interface SKU {
  value: string;
  price: number;
  stock: number;
  image: string;
}
async function resolveSkus(skuPromises: Promise<SKU>[]): Promise<SKU[]> {
  return await Promise.all(skuPromises);
}
// Main Dialog Component
export default function AddProduct() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clearImage, setClearImage] = useState(false);
  const form = useForm<CreateProductBodyType>({
    resolver: zodResolver(CreateProductBodySchema),
    defaultValues: {
      name: "",
      description: "",
      basePrice: 0,
      virtualPrice: 0,
      brandId: undefined,
      categories: [],
      images: [],
      skus: [],
      variants: [],
    },
  });
  const images = form.watch("images");
  const basePrice = form.watch("basePrice");
  const virtualPrice = form.watch("virtualPrice");
  const watchedVariants = form.watch("variants");
  const sKus = form.watch("skus");
  const sKusValidatePrice = sKus.filter(
    (item) => item.price < basePrice || item.price > virtualPrice
  );

  const addProductMutation = useAddProductMutation();
  const updateMediaMutation = useUploadFileMediaMutation();
  const { data: listBrand } = useListBrand();
  const { data: listCategory } = useListCategories();
  if (!listBrand) {
    return;
  }
  if (!listCategory) {
    return;
  }
  const categories = listCategory.payload.data.sort((a, b) =>
    a.name.localeCompare(b.name, "vi", { sensitivity: "base" })
  );
  const getListBrand = listBrand.payload.data.sort((a, b) =>
    a.name.localeCompare(b.name, "vi", { sensitivity: "base" })
  );

  const reset = () => {
    form.reset({
      name: "",
      description: "",
      basePrice: 0,
      virtualPrice: 0,
      brandId: undefined,
      categories: [],
      images: [],
      skus: [],
      variants: [],
    });
    setOpen(false);
    setIsSubmitting(false);
  };
  const onSubmit = async (values: CreateProductBodyType) => {
    if (addProductMutation.isPending) return;
    setIsSubmitting(true);
    try {
      if (Number(basePrice) > Number(virtualPrice)) {
        toast({
          title: "Lỗi giá trị",
          variant: "destructive",
          description:
            "basePrice và VirtualPrice có giá trị không đúng, hãy kiểm tra lại",
        });
        return;
      }
      if (sKusValidatePrice.length > 0) {
        toast({
          title: "Lỗi giá trị",
          variant: "destructive",
          description:
            "Giá của sku không được nhỏ hơn basePrice và lớn hơn virtualPrice",
        });
        return;
      }
      let body = values;
      if (images !== undefined && sKus !== undefined) {
        const formData = await addBlobUrlsToFormData(images);
        const uploadImageResult = await updateMediaMutation.mutateAsync(
          formData
        );
        const imageUrl = uploadImageResult.payload.data.map((img) => img.url);
        const skusAddImage = sKus.map(async (sku) => {
          if (sku.image) {
            const formSkuData = await addBlobUrlToFormData(sku.image);
            const uploadImageSkuResult = await updateMediaMutation.mutateAsync(
              formSkuData
            );
            const imageSkuUrl = uploadImageSkuResult.payload.data[0].url;
            return {
              ...sku,
              image: imageSkuUrl,
            };
          }
          return sku;
        });
        const newSkus = await resolveSkus(skusAddImage);
        body = {
          ...values,
          images: imageUrl,
          skus: newSkus,
        };
        const result = await addProductMutation.mutateAsync(body);
        if (result) {
          toast({
            description: "Tạo sản phẩm thành công",
          });
          setOpen(false);
          setIsSubmitting(true);
          reset();
          setClearImage(true);
        } else {
          toast({
            title: "Lỗi không thêm được",
            variant: "destructive",
            description: "Tạo sản phẩm không thành công, hãy kiểm tra lại",
          });
        }
      }
    } catch (error) {
      handleHttpErrorApi({
        error,
        setError: form.setError,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Create product
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        <DialogHeader>
          <DialogTitle>Create product</DialogTitle>
          <DialogDescription>
            Field name, image, price is require
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-80px)]">
          <div className="px-6 py-4">
            <FormProvider {...form}>
              <form
                id="add-product-form"
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
                onReset={reset}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <Label htmlFor="name">Name</Label>
                            <div>
                              <Input
                                id="name"
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Input name of product"
                                required
                              />
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <Label htmlFor="description">Description</Label>
                            <RichTextEditor
                              content={field.value}
                              onChange={field.onChange}
                              placeholder="Input description"
                            />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <FormField
                          control={form.control}
                          name="categories"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Categories</FormLabel>
                              <FormControl>
                                <MultiSelectCategory
                                  value={field.value}
                                  onChange={field.onChange}
                                  categories={categories}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="space-y-2">
                        <FormField
                          control={form.control}
                          name="brandId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Brand</FormLabel>
                              <Select
                                onValueChange={(value) =>
                                  field.onChange(
                                    value ? Number.parseInt(value, 10) : null
                                  )
                                }
                                value={
                                  field.value ? field.value.toString() : ""
                                }
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chose brand" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {getListBrand.map((brand) => (
                                    <SelectItem
                                      key={brand.id}
                                      value={brand.id.toString()}
                                    >
                                      {brand.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <FormField
                          control={form.control}
                          name="basePrice"
                          render={({ field }) => (
                            <FormItem>
                              <Label htmlFor="basePrice">Base price</Label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                                  ₫
                                </span>
                                <InputNumber field={field} id="basePrice" />
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="space-y-2">
                        <FormField
                          control={form.control}
                          name="virtualPrice"
                          render={({ field }) => (
                            <FormItem>
                              <Label htmlFor="virtualPrice">
                                Virtual price
                              </Label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                                  ₫
                                </span>
                                <InputNumber field={field} id="virtualPrice" />
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {/* Hình ảnh sản phẩm */}
                <Card>
                  <CardHeader>
                    <CardTitle>Product images</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="images"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Images</FormLabel>
                          <FormControl>
                            <ImageUpload
                              value={field.value}
                              onChange={field.onChange}
                              maxImages={10}
                              clearImage={clearImage}
                              setClearImage={setClearImage}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                {/* Biến thể sản phẩm */}
                <Card>
                  <CardHeader>
                    <CardTitle>Product variations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="variants"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <VariantSettingsField
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Manage SKUs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* FormField mới cho skus */}
                    <FormField
                      control={form.control}
                      name="skus"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            {/* Component SkuListField mới với variants được truyền vào */}
                            <SkuListField
                              virtualPrice={virtualPrice}
                              value={field.value}
                              onChange={field.onChange}
                              variants={watchedVariants} // Truyền variants từ form
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                <div className="flex justify-end gap-4 pt-4 border-t">
                  <Button type="button" variant="outline">
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    form="add-product-form"
                    disabled={isSubmitting}
                    className="px-8 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        {"Đang thêm..."}
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        {"Thêm"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
