"use client";

import { useEffect, useState } from "react";
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
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import RichTextEditor from "./components/rich-text-editor";
import { FormProvider, useForm } from "react-hook-form";
import {
  UpdateProductBodySchema,
  type UpdateProductBodyType,
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
import {
  useGetProduct,
  useUpdateProductMutation,
} from "@/app/queries/useProduct";
import { useUploadFileMediaMutation } from "@/app/queries/useMedia";
import { toast } from "@/hooks/use-toast";
import {
  addBlobUrlsToFormData,
  addBlobUrlToFormData,
  handleHttpErrorApi,
} from "@/lib/utils";
import { useListBrand } from "@/app/queries/useBrand";

interface SKU {
  value: string;
  price: number;
  stock: number;
  image: string;
}

async function resolveSkus(skuPromises: Promise<SKU>[]): Promise<SKU[]> {
  return await Promise.all(skuPromises);
}

interface EditProductProps {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
}

export default function EditProduct({
  id,
  setId,
  onSubmitSuccess,
}: EditProductProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Always call all hooks in the same order
  const form = useForm<UpdateProductBodyType>({
    resolver: zodResolver(UpdateProductBodySchema),
    defaultValues: {
      name: "",
      description: "",
      basePrice: 0,
      virtualPrice: 0,
      brandId: undefined,
      categories: undefined,
      images: undefined,
      skus: undefined,
      variants: undefined,
    },
  });

  const images = form.watch("images");
  const watchedVariants = form.watch("variants");
  const sKus = form.watch("skus");

  // Always call these hooks regardless of id value
  const {
    data: productDetail,
    isLoading,
    isError,
    refetch,
  } = useGetProduct({
    id: id || 0, // Provide default value instead of conditional
    enabled: Boolean(id), // Use enabled to control when query runs
  });

  const updateProductMutation = useUpdateProductMutation();
  const updateMediaMutation = useUploadFileMediaMutation();
  const { data: listBrand } = useListBrand();

  // Set open state when id changes
  useEffect(() => {
    if (id) {
      setOpen(true);
      setIsDataLoaded(false);
    } else {
      setOpen(false);
      setIsDataLoaded(false);
    }
  }, [id]);

  // Populate form when product data is loaded
  useEffect(() => {
    if (productDetail && !isDataLoaded && id) {
      const {
        name,
        description,
        brandId,
        basePrice,
        virtualPrice,
        images,
        skus,
        variants,
        categories,
      } = productDetail.payload;

      // Prepare form data
      const formData = {
        name: name || "",
        description: description || "",
        brandId: brandId || undefined,
        basePrice: basePrice || 0,
        virtualPrice: virtualPrice || 0,
        images: images || [],
        skus:
          skus?.map((sku) => ({
            value: sku.value || "",
            price: sku.price || 0,
            stock: sku.stock || 0,
            image: sku.image || "",
          })) || [],
        variants: variants || [],
        categories: categories?.map((cat) => cat.id) || [],
      };

      console.log("Setting form data:", formData);

      // Reset form with new data
      form.reset(formData);
      setIsDataLoaded(true);
    }
  }, [productDetail, form, isDataLoaded, id]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
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
      setIsDataLoaded(false);
    }
  }, [open, form]);

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
    setIsDataLoaded(false);
    setId(undefined);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset();
    }
    setOpen(newOpen);
  };

  const onSubmit = async (values: UpdateProductBodyType) => {
    if (updateProductMutation.isPending || !id) return;

    try {
      setIsSubmitting(true);
      let body: UpdateProductBodyType & { id: number } = {
        id,
        ...values,
      };

      if (images !== undefined && sKus !== undefined) {
        // Handle image uploads
        const blobImages = images.filter((img) => img.startsWith("blob:"));
        const existingImages = images.filter((img) => !img.startsWith("blob:"));

        let imageUrls = [...existingImages];

        if (blobImages.length > 0) {
          const formData = await addBlobUrlsToFormData(blobImages);
          const uploadImageResult = await updateMediaMutation.mutateAsync(
            formData
          );
          const newImageUrls = uploadImageResult.payload.data.map(
            (img) => img.url
          );
          imageUrls = [...existingImages, ...newImageUrls];
        }

        // Handle SKU image uploads
        const skusAddImage = sKus.map(async (sku) => {
          if (sku.image && sku.image.startsWith("blob:")) {
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
          ...body,
          images: imageUrls,
          skus: newSkus,
        };
      }

      await updateProductMutation.mutateAsync(body);

      toast({
        description: "Update product successfully",
      });

      reset();
      onSubmitSuccess?.();
      refetch();
    } catch (error) {
      handleHttpErrorApi({
        error,
        setError: form.setError,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Early return after all hooks have been called
  if (!listBrand) {
    return null;
  }

  const getListBrand = listBrand.payload.data.sort((a, b) =>
    a.name.localeCompare(b.name, "vi", { sensitivity: "base" })
  );

  if (isLoading || !isDataLoaded) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] p-0">
          <DialogTitle className="px-6 pt-4">Edit product</DialogTitle>
          <DialogDescription className="px-6">
            Update product information
          </DialogDescription>

          <div className="flex items-center justify-center h-96">
            <div className="text-muted-foreground">Loading product data...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (isError) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] p-0">
          <DialogTitle className="px-6 pt-4">Edit product</DialogTitle>
          <DialogDescription className="px-6">
            Update product information
          </DialogDescription>

          <div className="flex items-center justify-center h-96">
            <div className="text-red-500">Error loading product data</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        <DialogTitle className="px-6 pt-4">Edit product</DialogTitle>
        <DialogDescription className="px-6">
          Update product information
        </DialogDescription>

        <ScrollArea className="max-h-[calc(90vh-80px)]">
          <div className="px-6 py-4">
            <FormProvider {...form}>
              <form
                id="edit-product-form"
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
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
                                    <SelectValue placeholder="Choose brand" />
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

                {/* Product Images */}
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
                              value={field.value || []}
                              onChange={field.onChange}
                              maxImages={10}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Product Variants */}
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
                              value={field.value || []}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* SKU Management */}
                <Card>
                  <CardHeader>
                    <CardTitle>Manage SKUs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="skus"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <SkuListField
                              value={field.value || []}
                              onChange={field.onChange}
                              variants={watchedVariants || []}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-4 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={reset}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    form="edit-product-form"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Updating..." : "Update product"}
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
