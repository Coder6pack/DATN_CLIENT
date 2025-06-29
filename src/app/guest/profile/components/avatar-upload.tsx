"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Camera, Upload, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useUploadFileMediaMutation } from "@/app/queries/useMedia";
import { FormProvider, useForm } from "react-hook-form";
import {
  UpdateMeBodySchema,
  UpdateMeBodyType,
} from "@/schemaValidations/profile.model";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useAccountMe,
  useUpdateAccountProfileMutation,
} from "@/app/queries/useAccount";
import { FormField, FormItem } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { handleHttpErrorApi } from "@/lib/utils";

export default function AvatarUpload() {
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const { data, refetch } = useAccountMe();
  const updateAccountMutation = useUpdateAccountProfileMutation();
  const uploadMediaMutation = useUploadFileMediaMutation();
  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBodySchema),
    defaultValues: {
      name: "",
      address: "",
      avatar: undefined,
    },
  });
  const avatar = form.watch("avatar");
  useEffect(() => {
    if (data) {
      const { avatar, name, address } = data.payload;
      form.reset({
        avatar: avatar ?? "",
        name,
        address,
      });
    }
  }, [form, data]);

  // preview avatar
  const previewAvatar = file ? URL.createObjectURL(file) : avatar;

  const reset = () => {
    form.reset();
    setFile(null);
  };
  const onSubmit = async (values: UpdateMeBodyType) => {
    if (updateAccountMutation.isPending) return;
    setUploading(true);
    try {
      let body = values;
      if (data) {
        body = {
          ...values,
          name: data.payload.name,
          address: data.payload.address,
        };
      }
      console.log("body", body);
      if (file) {
        const formData = new FormData();
        formData.append("files", file);
        const uploadImageResult = await uploadMediaMutation.mutateAsync(
          formData
        );
        const imageUrl = uploadImageResult.payload.data[0].url;
        body = {
          ...values,
          avatar: imageUrl,
        };
        const result = await updateAccountMutation.mutateAsync(body);
        toast({
          description: "Cập nhật thông tin thành công",
        });
        reset();
      }
    } catch (error) {
      handleHttpErrorApi({
        error,
        setError: form.setError,
      });
    } finally {
      setUploading(false);
    }
  };
  const handleCancel = () => {
    setIsOpen(false);
    setFile(null);
  };
  return (
    <FormProvider {...form}>
      <form
        id="upload-avatar-form"
        onSubmit={form.handleSubmit(onSubmit, (e) => {
          console.log(e);
        })}
      >
        <div className="relative inline-block">
          <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
            <AvatarImage src={previewAvatar} alt={data?.payload.name || ""} />
            <AvatarFallback className="text-2xl font-bold bg-primary text-white">
              {data?.payload.name || ""}
            </AvatarFallback>
          </Avatar>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                size="icon"
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-card border transition-colors duration-300">
              <DialogHeader>
                <DialogTitle className="text-center text-foreground">
                  Cập nhật ảnh đại diện
                </DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Choose an image to upload as your profile avatar.
              </DialogDescription>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      {/* Current/Selected Avatar Preview */}
                      <div className="text-center">
                        <Avatar className="w-32 h-32 mx-auto border-4 border-background shadow-lg">
                          <AvatarImage
                            src={previewAvatar}
                            alt={data?.payload.name}
                          />
                          <AvatarFallback className="text-4xl font-bold bg-primary text-white">
                            {data?.payload.name}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      {/* Upload Options */}
                      <div className="space-y-4">
                        {/* File Upload */}
                        <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer bg-card/50">
                          <CardContent className="p-6">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              ref={avatarInputRef}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setFile(file);
                                  field.onChange(
                                    "http://localhost:3000/" + field.name
                                  );
                                }
                              }}
                            />
                            <div
                              className="text-center space-y-3"
                              onClick={() => avatarInputRef.current?.click()}
                            >
                              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                <Upload className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium text-foreground">
                                  Tải ảnh từ máy tính
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  PNG, JPG, GIF tối đa 5MB
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-3 pt-4">
                        <Button
                          variant="outline"
                          onClick={handleCancel}
                          className="flex-1 rounded-xl"
                          disabled={uploading}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Hủy
                        </Button>
                        <Button
                          type="submit"
                          form="upload-avatar-form"
                          disabled={uploading}
                          className="flex-1 rounded-xl"
                        >
                          {uploading ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Đang tải...</span>
                            </div>
                          ) : (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Cập nhật
                            </>
                          )}
                        </Button>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </form>
    </FormProvider>
  );
}
