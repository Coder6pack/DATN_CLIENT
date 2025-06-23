import { useChangePasswordMutation } from "@/app/queries/useAccount";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { handleHttpErrorApi } from "@/lib/utils";
import {
  ChangePasswordBodySchema,
  ChangePasswordBodyType,
} from "@/schemaValidations/profile.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { CheckCircle, Eye, EyeOff, Lock, Shield } from "lucide-react";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

export default function ChangeGuestPassword() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  const changePasswordMutation = useChangePasswordMutation();
  const form = useForm<ChangePasswordBodyType>({
    resolver: zodResolver(ChangePasswordBodySchema),
    defaultValues: {
      newPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const reset = () => {
    form.reset();
  };
  const onSubmit = async (data: ChangePasswordBodyType) => {
    if (changePasswordMutation.isPending) return;
    setSaving(true);
    try {
      const result = await changePasswordMutation.mutateAsync(data);
      if (result) {
        toast({
          title: "Cập nhật thành công",
          description: result.payload.message,
        });
      } else {
        toast({
          title: "Cập nhật thất bại",
          description: "Mật khẩu không khớp vui lòng kiểm tra lại",
        });
      }
      reset();
    } catch (error) {
      handleHttpErrorApi({
        error,
        setError: form.setError,
      });
    } finally {
      setSaving(false);
    }
  };
  return (
    <FormProvider {...form}>
      <form
        id="change-password-form"
        onSubmit={form.handleSubmit(onSubmit, (e) => {
          toast({
            title: "Lỗi",
            description:
              e?.confirmPassword?.message ||
              e?.newPassword?.message ||
              e?.password?.message,
          });
        })}
      >
        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden transition-colors duration-300">
          <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 pb-6">
            <CardTitle className="flex items-center space-x-3 text-2xl">
              <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                <Lock className="h-5 w-5 text-white" />
              </div>
              <span>Đổi mật khẩu</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="max-w-md mx-auto space-y-6">
              {/* current password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-semibold text-foreground"
                    >
                      Mật khẩu hiện tại
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showCurrentPassword ? "text" : "password"}
                        value={field.value}
                        onChange={field.onChange}
                        className="pl-10 pr-12 h-12 rounded-xl border-2"
                        placeholder="Nhập mật khẩu hiện tại"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <FormMessage />
                    </div>
                  </div>
                )}
              />
              {/* new password */}
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label
                      htmlFor="newPassword"
                      className="text-sm font-semibold text-foreground"
                    >
                      Mật khẩu mới
                    </Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={field.value}
                        onChange={field.onChange}
                        className="pl-10 pr-12 h-12 rounded-xl border-2"
                        placeholder="Nhập mật khẩu mới"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <FormMessage />
                    </div>
                  </div>
                )}
              />
              {/* confirm password */}

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-semibold text-foreground"
                    >
                      Xác nhận mật khẩu mới
                    </Label>
                    <div className="relative">
                      <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={field.value}
                        onChange={field.onChange}
                        className="pl-10 pr-12 h-12 rounded-xl border-2"
                        placeholder="Nhập lại mật khẩu mới"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <FormMessage />
                    </div>
                  </div>
                )}
              />
              <Button
                type="submit"
                form="change-password-form"
                disabled={saving}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
              >
                {saving ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang cập nhật...</span>
                  </div>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Đổi mật khẩu
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
}
