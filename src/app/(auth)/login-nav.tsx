"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoginNavProps {
  showHomeButton?: boolean;
  logoText?: string;
}

export default function LoginNav({
  showHomeButton = true,
  logoText = "FashionStore",
}: LoginNavProps) {
  return (
    <nav className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-5 h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
          >
            {logoText}
          </Link>

          {/* Home Button */}
          {showHomeButton && (
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full px-4 py-2 transition-all duration-300"
              asChild
            >
              <Link href="/">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Trang chủ</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
