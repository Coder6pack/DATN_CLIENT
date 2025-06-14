"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUploadFileMediaMutation } from "@/app/queries/useMedia";
import { toast } from "@/hooks/use-toast";
import { handleHttpErrorApi } from "@/lib/utils";
import {
  UpdateBrandBodySchema,
  UpdateBrandBodyType,
} from "@/schemaValidations/brand.model";
import { useGetBrand, useUpdateBrandMutation } from "@/app/queries/useBrand";

export default function EditBrand({
  id,
  setId,
  onSubmitSuccess,
}: {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const form = useForm<UpdateBrandBodyType>({
    resolver: zodResolver(UpdateBrandBodySchema),
    defaultValues: {
      name: "",
      logo: "",
    },
  });
  const updateBrandtMutation = useUpdateBrandMutation();
  const updateMediaMutation = useUploadFileMediaMutation();
  const { data } = useGetBrand({
    id: id as number,
    enabled: Boolean(id),
  });
  const logo = form.watch("logo");
  const name = form.watch("name");
  const previewAvatarFromFile = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return logo;
  }, [file, logo]);
  useEffect(() => {
    if (data) {
      const { name, logo } = data.payload;
      form.reset({
        name,
        logo: logo ?? undefined,
      });
    }
  }, [data, form]);

  const onSubmit = async (values: UpdateBrandBodyType) => {
    if (updateBrandtMutation.isPending) return;
    try {
      let body: UpdateBrandBodyType & { id: number } = {
        id: id as number,
        ...values,
      };
      if (file) {
        const formData = new FormData();
        formData.append("files", file);
        const uploadImageResult = await updateMediaMutation.mutateAsync(
          formData
        );
        const imageUrl = uploadImageResult.payload.data;
        body = {
          ...body,
          logo: imageUrl[0].url,
        };
      }
      body = {
        ...body,
      };
      const result = await updateBrandtMutation.mutateAsync(body);
      toast({
        description: "Cập nhật nhãn hàng thành công",
      });
      setId(undefined);
      onSubmitSuccess && onSubmitSuccess();
    } catch (error) {
      handleHttpErrorApi({
        error,
        setError: form.setError,
      });
    }
  };
  const test = (value: any) => {
    console.log(value);
    return true;
  };
  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          setId(undefined);
        }
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Cập nhật tài khoản</DialogTitle>
          <DialogDescription>
            Các trường tên, email là bắt buộc
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="edit-brand-form"
            onSubmit={form.handleSubmit(onSubmit, (e) => {
              console.log("error form edit", e);
            })}
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2 items-start justify-start">
                      <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
                        <AvatarImage src={previewAvatarFromFile!} />
                        <AvatarFallback className="rounded-none">
                          {name || "Logo"}
                        </AvatarFallback>
                      </Avatar>
                      <input
                        type="file"
                        accept="image/*"
                        ref={avatarInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFile(file);
                            field.onChange(
                              "http://localhost:3000/" + file.name
                            );
                          }
                        }}
                        className="hidden"
                      />
                      <button
                        className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed"
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Upload</span>
                      </button>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="name">Tên</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input id="name" className="w-full" {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="edit-brand-form">
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
