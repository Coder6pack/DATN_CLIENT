"use client";

import Link from "next/link";

interface SimpleHeaderProps {
  title?: string;
}

export default function SimpleHeader({ title }: SimpleHeaderProps) {
  return (
    <header className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
          >
            FashionStore
          </Link>

          {/* Title */}
          {title && (
            <h1 className="text-xl font-semibold text-gray-700">{title}</h1>
          )}
        </div>
      </div>
    </header>
  );
}
