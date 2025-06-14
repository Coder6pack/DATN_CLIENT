import {
  Home,
  BookImage,
  ShoppingCart,
  Users2,
  ShoppingBasket,
  Shirt,
  Images,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    Icon: Home,
    href: "/manage/dashboard",
  },
  {
    title: "Orders",
    Icon: ShoppingCart,
    href: "/manage/orders",
  },
  {
    title: "Brand",
    Icon: BookImage,
    href: "/manage/brands",
  },
  {
    title: "Category",
    Icon: ShoppingBasket,
    href: "/manage/categories",
  },
  {
    title: "Product",
    Icon: Shirt,
    href: "/manage/products",
  },
  {
    title: "Slide show",
    Icon: Images,
    href: "/manage/slide-show",
  },
  {
    title: "Employee",
    Icon: Users2,
    href: "/manage/accounts",
  },
];

export default menuItems;
