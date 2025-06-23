import {
  useAccountMe,
  useUpdateAccountProfileMutation,
} from "@/app/queries/useAccount";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { handleHttpErrorApi } from "@/lib/utils";
import {
  UpdateMeBodySchema,
  UpdateMeBodyType,
} from "@/schemaValidations/profile.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit3, Mail, MapPin, Phone, Save, User, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Form, FormProvider, useForm } from "react-hook-form";

export default function UploadProfileGuestForm() {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const updateAccountMutation = useUpdateAccountProfileMutation();
  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBodySchema),
    defaultValues: {
      name: "",
      address: "",
      phoneNumber: "",
    },
  });

  const { data, isLoading } = useAccountMe();
  const getProfile = data?.payload;
  useEffect(() => {
    if (data) {
      const { address, phoneNumber, name } = data.payload;
      form.reset({
        name,
        address,
        phoneNumber,
      });
    }
  }, [form, data]);

  const reset = () => {
    form.reset();
  };
  const onSubmit = async (values: UpdateMeBodyType) => {
    if (updateAccountMutation.isPending) return;
    try {
      console.log("values", values);
      await updateAccountMutation.mutateAsync(values);
      toast({
        description: "Cập nhật thông tin thành công",
      });
      reset();
    } catch (error) {
      handleHttpErrorApi({
        error,
        setError: form.setError,
      });
    }
  };
  if (isLoading) {
    return (
      <div className="grid gap-8">
        {[...Array(3)].map((_, i) => (
          <Card
            key={i}
            className="border-0 shadow-lg rounded-3xl animate-pulse"
          >
            <CardContent className="p-8 flex space-x-6">
              <div className="w-5 h-5 bg-muted rounded" />
              <div className="w-36 h-36 bg-muted rounded-3xl" />
              <div className="flex-1 space-y-4">
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-3 bg-muted rounded w-1/4" />
                <div className="h-3 bg-muted rounded w-1/3" />
                <div className="h-6 bg-muted rounded w-1/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-xl rounded-3xl overflow-hidden transition-colors duration-300">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-3 text-2xl">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <span>Thông tin cá nhân</span>
          </CardTitle>
          <Button
            variant={editing ? "destructive" : "default"}
            onClick={() => (editing ? setEditing(false) : setEditing(true))}
            className="rounded-xl"
          >
            {editing ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Hủy
              </>
            ) : (
              <>
                <Edit3 className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <FormProvider {...form}>
        <form
          id="update-profile-guest-form"
          onSubmit={form.handleSubmit(onSubmit, (e) => {
            console.log(e);
          })}
        >
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-2">
                      <Label
                        htmlFor="fullName"
                        className="text-sm font-semibold text-foreground"
                      >
                        Họ và tên
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="fullName"
                          value={field.value}
                          onChange={field.onChange}
                          disabled={!editing}
                          className="pl-10 h-12 rounded-xl border-2"
                        />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-foreground"
                >
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={getProfile?.email}
                    readOnly
                    disabled={true}
                    className="pl-10 h-12 rounded-xl border-2"
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-sm font-semibold text-foreground"
                      >
                        Số điện thoại
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={field.value}
                          onChange={field.onChange}
                          disabled={!editing}
                          className="pl-10 h-12 rounded-xl border-2"
                        />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-2">
                      <Label
                        htmlFor="address"
                        className="text-sm font-semibold text-foreground"
                      >
                        Địa chỉ
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="address"
                          type="text"
                          value={field.value as string}
                          onChange={field.onChange}
                          disabled={!editing}
                          className="pl-10 h-12 rounded-xl border-2"
                        />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {editing && (
              <div className="flex justify-end mt-8">
                <Button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-blue-600"
                  form="update-profile-guest-form"
                >
                  {saving ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang lưu...</span>
                    </div>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Lưu thay đổi
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </form>
      </FormProvider>
    </Card>
  );
}
