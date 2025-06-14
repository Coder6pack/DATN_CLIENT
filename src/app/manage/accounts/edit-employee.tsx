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
import {
  UpdateUserBodySchema,
  UpdateUserBodyType,
} from "@/schemaValidations/user.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  useGetAccount,
  useUpdateAccountMutation,
} from "@/app/queries/useAccount";
import { useUploadFileMediaMutation } from "@/app/queries/useMedia";
import { toast } from "@/hooks/use-toast";
import { handleHttpErrorApi } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditEmployee({
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
  const form = useForm<UpdateUserBodyType>({
    resolver: zodResolver(UpdateUserBodySchema),
    defaultValues: {
      status: "ACTIVE",
      name: "",
      phoneNumber: "",
      avatar: "",
      email: "",
      roleId: 3,
    },
  });
  const updateAccountMutation = useUpdateAccountMutation();
  const updateMediaMutation = useUploadFileMediaMutation();
  const { data } = useGetAccount({
    id: id as number,
    enabled: Boolean(id),
  });
  const avatar = form.watch("avatar");
  const name = form.watch("name");
  const previewAvatarFromFile = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return avatar;
  }, [file, avatar]);
  useEffect(() => {
    if (data) {
      const { name, avatar, email, phoneNumber, roleId, status } = data.payload;
      form.reset({
        name,
        avatar: avatar ?? undefined,
        email,
        phoneNumber,
        roleId,
        status,
      });
    }
  }, [data, form]);

  const onSubmit = async (values: UpdateUserBodyType) => {
    if (updateAccountMutation.isPending) return;
    try {
      let body: UpdateUserBodyType & { id: number } = {
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
          roleId: Number(body.roleId),
          avatar: imageUrl[0].url,
        };
      }
      body = {
        ...body,
        roleId: Number(body.roleId),
      };
      const result = await updateAccountMutation.mutateAsync(body);
      toast({
        description: "Update account successfully",
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
            id="edit-employee-form"
            onSubmit={form.handleSubmit(onSubmit, (e) => {
              console.log("error form edit", e);
            })}
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2 items-start justify-start">
                      <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
                        <AvatarImage src={previewAvatarFromFile!} />
                        <AvatarFallback className="rounded-none">
                          {name || "Avatar"}
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
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="email">Email</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input id="email" className="w-full" {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="phoneNumber">SDT</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input id="phoneNumber" className="w-full" {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <FormLabel htmlFor="roleId">Status</FormLabel>
                      <div className="col-span-3 w-full space-y-2">
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                              <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                              <SelectItem value="BLOCKED">BLOCKED</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="roleId"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <FormLabel htmlFor="roleId">Role</FormLabel>
                      <div className="col-span-3 w-full space-y-2">
                        <FormControl>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(Number(value))
                            }
                            value={String(field.value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={
                                  field.value ? "Chọn vai trò" : "User"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Admin</SelectItem>
                              <SelectItem value="3">Seller</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
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
          <Button type="submit" form="edit-employee-form">
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
