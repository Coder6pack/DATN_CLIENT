"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "@/app/queries/useAuth";
import { toast } from "@/hooks/use-toast";
import { decodeToken, handleHttpErrorApi } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { LoginBodySchema, LoginBodyType } from "@/schemaValidations/auth.model";
import { useAppContext } from "@/components/app-provider";
import { useEffect, useState } from "react";
import Link from "next/link";
import envConfig from "@/config";
import { LogInIcon, Send } from "lucide-react";

const getOauthGoogleUrl = () => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: envConfig.NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URI,
    client_id: envConfig.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };
  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
};
const googleOauthUrl = getOauthGoogleUrl();
console.log("googleOauthUrl", googleOauthUrl);
export default function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const loginMutation = useLoginMutation();
  const searchParams = useSearchParams();
  const clearTokens = searchParams.get("clearTokens");
  const { setIsAuth } = useAppContext();
  const route = useRouter();
  useEffect(() => {
    if (clearTokens) {
      setIsAuth(false);
    }
  }, [clearTokens, setIsAuth]);
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBodySchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data: LoginBodyType) => {
    if (loginMutation.isPending) return;
    setIsSubmitting(true);
    try {
      const result = await loginMutation.mutateAsync(data);
      const role = decodeToken(result.payload.refreshToken).roleName;
      if (result) {
        if (role === "Admin" || role === "Seller") {
          toast({
            description: "Login Admin successfully",
          });
          setIsAuth(true);
          route.push("/manage/dashboard");
          route.refresh();
        }
        if (role === "Client") {
          toast({
            description: "Login Guest successfully",
          });
          route.refresh();
          setIsAuth(true);
          route.push("/");
        }
      }
    } catch (error) {
      handleHttpErrorApi({ error, setError: form.setError });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Đăng nhập</CardTitle>
        <CardDescription>
          Nhập email và mật khẩu của bạn để đăng nhập vào hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            id="login-form"
            className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
            noValidate
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.log(errors);
            })}
          >
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        required
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                form="login-form"
                disabled={isSubmitting}
                className="px-8 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    {"Đang đăng nhập..."}
                  </>
                ) : (
                  <>
                    <LogInIcon className="h-4 w-4 mr-2" />
                    {"Đăng nhập"}
                  </>
                )}
              </Button>
              <Link href={googleOauthUrl}>
                <Button variant="outline" className="w-full" type="button">
                  Đăng nhập bằng Google
                </Button>
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm">
          Bạn đã có tài khoản?{" "}
          <Link
            href="/register"
            className="text-primary underline-offset-4 hover:underline"
          >
            Đăng ký
          </Link>
        </div>
        <div className="text-center text-sm">
          Quên mật khẩu?{" "}
          <Link
            href="/forgot-password"
            className="text-primary underline-offset-4 hover:underline"
          >
            Click vào đây
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
