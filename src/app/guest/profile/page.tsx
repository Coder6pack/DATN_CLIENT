"use client";

import { useState, useEffect } from "react";
import { User } from "lucide-react";
import ProfileContent from "./components/profile-content";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="animate-pulse bg-card transition-colors duration-300 rounded-3xl shadow-lg p-6">
                <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4" />
                <div className="h-6 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded w-2/3 mx-auto" />
              </div>
            </div>
            <div className="lg:col-span-2 space-y-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-card transition-colors duration-300 rounded-3xl shadow-lg p-6"
                >
                  <div className="h-6 bg-muted rounded w-1/3 mb-4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 via-blue-50 to-purple-50 dark:from-primary/20 dark:via-blue-950 dark:to-purple-950 py-20 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
              <User className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Hồ Sơ Cá Nhân
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Quản lý thông tin cá nhân và theo dõi đơn hàng của bạn
            </p>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <ProfileContent />
      </div>
    </div>
  );
}
