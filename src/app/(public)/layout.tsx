import Link from "next/link";
import { Menu, Package2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import DarkModeToggle from "@/components/dark-mode-toggle";
import NavItems from "@/app/(public)/nav-items";
import CartProvider from "@/context/CartContext";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      <div className="flex min-h-screen w-full flex-col relative">
        <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
          <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <Link
              href="#"
              className="flex items-center gap-2 text-lg font-semibold md:text-base"
            >
              <Package2 className="h-6 w-6" />
              <span className="sr-only">Nhon Thien</span>
          </Link>
            <NavItems className="text-muted-foreground transition-colors hover:text-foreground flex-shrink-0" />
        </nav>
        <Sheet>
          <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader className="sr-only">
              <SheetTitle />
              <SheetDescription />
            </SheetHeader>
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Package2 className="h-6 w-6" />
                  <span className="sr-only">Nhon Thien</span>
              </Link>

                <NavItems className="text-muted-foreground transition-colors hover:text-foreground" />
            </nav>
          </SheetContent>
        </Sheet>
          <div className="ml-auto">
          <DarkModeToggle />
        </div>
      </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 pt-20">
          {children}
        </main>
    </div>
    </CartProvider>
  );
}
