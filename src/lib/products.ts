import hairSolutionImg from "@/assets/WhatsApp_Image_2026-04-02_at_10.11.42_PM.jpeg";
import shampooImg from "@/assets/file_00000000032471fd87ac64c15b4be91e.png";
import bundleImg from "@/assets/file_000000009d2c71f8bfffa2a94b1be3a6_ujyyfg.png";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  active: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Hair Solution",
    price: 25,
    description: "Power-packed formula for explosive growth. Stronger, thicker, unstoppable hair. Free delivery.",
    image: hairSolutionImg,
    active: true,
  },
  {
    id: "2",
    name: "Shampoo",
    price: 15,
    description: "Deep-cleanse daily. Revive natural shine. Fortify every strand. Free delivery.",
    image: shampooImg,
    active: true,
  },
  {
    id: "3",
    name: "Bundle (3 Solutions + 1 Shampoo)",
    price: 80,
    originalPrice: 90,
    description: "Complete arsenal — 3 Hair Solutions + 1 Shampoo. Maximum impact. Best value. Free delivery.",
    image: bundleImg,
    active: true,
  },
];
