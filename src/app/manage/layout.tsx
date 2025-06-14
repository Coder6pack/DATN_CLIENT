"use client";

import type React from "react";

import { useState, useEffect } from "react";
import NavLinks from "./nav-links";
import MobileNavLinks from "./mobile-nav-links"; // Assuming you have this component
import DropdownAvatar from "./dropdown-avatar"; // Assuming you have this component
import DarkModeToggle from "@/components/dark-mode-toggle";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Sync with NavLinks collapsed state
  useEffect(() => {
    setIsMounted(true);
    const savedState = localStorage.getItem("navCollapsed");
    if (savedState !== null) {
      setCollapsed(savedState === "true");
    }

    // Listen for storage changes to sync across components
    const handleStorageChange = () => {
      const newState = localStorage.getItem("navCollapsed");
      if (newState !== null) {
        setCollapsed(newState === "true");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom event from NavLinks
    const handleNavToggle = (event: CustomEvent) => {
      setCollapsed(event.detail.collapsed);
    };

    window.addEventListener("navToggle", handleNavToggle as EventListener);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("navToggle", handleNavToggle as EventListener);
    };
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <NavLinks />
      <div
        className={`flex flex-col sm:gap-4 sm:py-4 transition-all duration-300 ease-in-out ${
          isMounted ? (collapsed ? "sm:pl-14" : "sm:pl-64") : "sm:pl-14" // Default fallback during SSR
        }`}
      >
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <MobileNavLinks />
          <div className="relative ml-auto flex-1 md:grow-0">
            <div className="flex justify-end">
              <DarkModeToggle />
            </div>
          </div>
          <DropdownAvatar />
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
