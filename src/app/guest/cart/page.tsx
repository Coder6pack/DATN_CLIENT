// "use client";

// import { useState, useEffect } from "react";
// import { ShoppingBag } from "lucide-react";
// import CartContent from "./components/cart-content";

// export default function CartPage() {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadCart = async () => {
//       setLoading(true);
//       await new Promise((resolve) => setTimeout(resolve, 800));
//       setLoading(false);
//     };
//     loadCart();
//   }, []);

//   return (
//     <div className="min-h-screen bg-background transition-colors duration-300">
//       {/* Hero Section */}
//       <div className="bg-gradient-to-r from-primary/10 via-blue-50 to-purple-50 dark:from-primary/20 dark:via-blue-950 dark:to-purple-950 py-20 transition-colors duration-300">
//         <div className="container mx-auto px-4">
//           <div className="text-center">
//             <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-full mb-6">
//               <ShoppingBag className="h-10 w-10 text-primary" />
//             </div>
//             <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//               Giỏ Hàng
//             </h1>
//             <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//               Quản lý và thanh toán các sản phẩm yêu thích của bạn
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-12">
//         <CartContent />
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import CartContent from "./components/cart-content";
import { useAppContext } from "@/components/app-provider";

export default function CartPage() {
  const [loading, setLoading] = useState(true);
  const { cartItems, removeFromCart, updateQuantity, clearCart } =
    useAppContext();

  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setLoading(false);
    };
    loadCart();
  }, []);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 via-blue-50 to-purple-50 dark:from-primary/20 dark:via-blue-950 dark:to-purple-950 py-20 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-full mb-6">
              <ShoppingBag className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Giỏ Hàng
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Quản lý và thanh toán các sản phẩm yêu thích của bạn
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <CartContent
          initialCartItems={cartItems}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
          clearCart={clearCart}
          loading={loading}
        />
      </div>
    </div>
  );
}
