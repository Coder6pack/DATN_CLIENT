"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle, Loader2 } from "lucide-react";

interface NewsletterProps {
  title?: string;
  description?: string;
  onSubscribe?: (email: string) => Promise<void>;
}

export default function Newsletter({
  title = "Đăng Ký Nhận Tin",
  description = "Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt",
  onSubscribe,
}: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError("");

    try {
      await onSubscribe?.(email);
      setIsSuccess(true);
      setEmail("");
    } catch (err) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <section className="py-16 bg-gradient-to-r from-primary/10 to-blue-600/10 transition-colors duration-300">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-foreground">
              Cảm ơn bạn!
            </h2>
            <p className="text-muted-foreground">
              Bạn đã đăng ký thành công. Chúng tôi sẽ gửi thông tin mới nhất đến
              email của bạn.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-r from-primary/10 to-blue-600/10 transition-colors duration-300">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-md mx-auto">
          <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2 text-foreground">{title}</h2>
          <p className="text-muted-foreground mb-8">{description}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-background border-border focus:border-primary transition-colors duration-200"
                required
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-primary-foreground font-medium px-8 transition-all duration-300 hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Đăng Ký"
                )}
              </Button>
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
          </form>

          <p className="text-xs text-muted-foreground mt-4">
            Chúng tôi tôn trọng quyền riêng tư của bạn. Bạn có thể hủy đăng ký
            bất cứ lúc nào.
          </p>
        </div>
      </div>
    </section>
  );
}
