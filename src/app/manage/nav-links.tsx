"use client";

import menuItems from "@/app/manage/menuItems";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Package2, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function NavLinks() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Handle initial state from localStorage when component mounts
  useEffect(() => {
    setIsMounted(true);
    const savedState = localStorage.getItem("navCollapsed");
    if (savedState !== null) {
      setCollapsed(savedState === "true");
    }
  }, []);

  // Save collapsed state to localStorage and dispatch custom event
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("navCollapsed", String(collapsed));
      // Dispatch custom event to notify layout
      window.dispatchEvent(
        new CustomEvent("navToggle", {
          detail: { collapsed },
        })
      );
    }
  }, [collapsed, isMounted]);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-10 hidden flex-col border-r bg-background transition-all duration-300 ease-in-out sm:flex",
          collapsed ? "w-14" : "w-64"
        )}
      >
        <div className="flex items-center justify-between px-4 py-4">
          <Link
            href="#"
            className={cn(
              "group flex h-9 items-center gap-2 rounded-lg",
              collapsed ? "justify-center" : "px-2"
            )}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base">
              <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
            </div>
            {!collapsed && (
              <span className="font-semibold tracking-tight">Acme Inc</span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8", collapsed && "mx-auto")}
            onClick={toggleCollapsed}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
            <span className="sr-only">
              {collapsed ? "Expand sidebar" : "Collapse sidebar"}
            </span>
          </Button>
        </div>

        <nav className="flex flex-col gap-1 px-2 py-4">
          {menuItems.map((Item, index) => {
            const isActive = pathname === Item.href;
            return (
              <Tooltip key={index} delayDuration={collapsed ? 300 : 0}>
                <TooltipTrigger asChild>
                  <Link
                    href={Item.href}
                    className={cn(
                      "flex h-10 items-center rounded-lg px-3 transition-colors hover:bg-accent hover:text-accent-foreground",
                      {
                        "bg-accent text-accent-foreground": isActive,
                        "text-muted-foreground": !isActive,
                      },
                      collapsed && "justify-center px-2"
                    )}
                  >
                    <Item.Icon className="h-5 w-5 min-w-5" />
                    {!collapsed && (
                      <span className="ml-3 truncate">{Item.title}</span>
                    )}
                    {collapsed && <span className="sr-only">{Item.title}</span>}
                  </Link>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">{Item.title}</TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>

        <nav className="mt-auto flex flex-col gap-1 px-2 py-4">
          <Tooltip delayDuration={collapsed ? 300 : 0}>
            <TooltipTrigger asChild>
              <Link
                href="/manage/setting"
                className={cn(
                  "flex h-10 items-center rounded-lg px-3 transition-colors hover:bg-accent hover:text-accent-foreground",
                  {
                    "bg-accent text-accent-foreground":
                      pathname === "/manage/setting",
                    "text-muted-foreground": pathname !== "/manage/setting",
                  },
                  collapsed && "justify-center px-2"
                )}
              >
                <Settings className="h-5 w-5 min-w-5" />
                {!collapsed && <span className="ml-3">Cài đặt</span>}
                {collapsed && <span className="sr-only">Cài đặt</span>}
              </Link>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">Cài đặt</TooltipContent>}
          </Tooltip>
        </nav>
      </aside>
    </TooltipProvider>
  );
}
