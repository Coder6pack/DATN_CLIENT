"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CreditCard, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShippingForm from "./components/shipping-form";
import PaymentMethod from "./components/payment-method";
import OrderSummary from "./components/order-summary";

interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [onlineMethod, setOnlineMethod] = useState("card");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [receiver, setReceiver] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setLoading(false);
    };
    loadData();
  }, []);

  const handleInputChange = (field: string, value: string | boolean) => {
    setReceiver((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = receiver.name && receiver.phone && receiver.address;

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse border-0 shadow-lg rounded-3xl bg-card transition-colors duration-300 p-6"
                >
                  <div className="h-6 bg-muted rounded w-1/3 mb-4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              <div className="animate-pulse border-0 shadow-lg rounded-3xl bg-card transition-colors duration-300 p-6">
                <div className="h-6 bg-muted rounded mb-4" />
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-12 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 via-blue-50 to-purple-50 dark:from-primary/20 dark:via-blue-950 dark:to-purple-950 py-16 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
              <CreditCard className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Thanh Toán Đơn Hàng
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hoàn tất đơn hàng của bạn một cách an toàn và nhanh chóng
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Back to Cart */}
        <div className="mb-8">
          <Button variant="ghost" className="rounded-2xl" asChild>
            <Link href="/cart">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại giỏ hàng
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <ShippingForm
              receiver={receiver}
              onInputChange={handleInputChange}
            />
            <PaymentMethod
              paymentMethod={paymentMethod}
              onlineMethod={onlineMethod}
              onPaymentMethodChange={setPaymentMethod}
              onOnlineMethodChange={setOnlineMethod}
            />
          </div>

          {/* Order Summary */}
          <OrderSummary
            receiver={receiver}
            paymentMethod={paymentMethod}
            processing={processing}
            isFormValid={!!isFormValid}
          />
        </div>
      </div>
    </div>
  );
}
