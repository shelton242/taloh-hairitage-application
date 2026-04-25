import { Plus, Tag } from "lucide-react";
import type { Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAdd = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);

    if (!user) {
      toast.info("Please login to complete your purchase");
      navigate("/login");
    }
  };

  const savings = product.originalPrice ? product.originalPrice - product.price : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-b from-card via-card/95 to-card/80 shadow-2xl shadow-primary/15 hover:shadow-accent/30 hover:border-accent/40 transition-all duration-500 hover:-translate-y-2"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/0 via-accent/20 to-primary/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />

      <div className="aspect-square overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {savings > 0 && (
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-full shadow-lg font-bold text-sm">
            <Tag className="h-4 w-4" />
            Save ${savings}
          </div>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      <div className="relative p-6 space-y-4">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

        <h3 className="font-display text-2xl font-bold text-card-foreground group-hover:text-primary transition-colors duration-300">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed min-h-[2.5rem]">
          {product.description}
        </p>
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through mb-1">
                ${product.originalPrice}
              </span>
            )}
            <span className="font-display text-5xl font-bold bg-gradient-to-r from-accent via-accent to-accent/80 bg-clip-text text-transparent text-glow-gold">
              ${product.price}
            </span>
          </div>
          <motion.button
            onClick={handleAdd}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-accent to-accent/90 px-6 py-4 text-base font-bold text-accent-foreground shadow-xl shadow-accent/40 active:shadow-accent/70 transition-all duration-200 glow-gold touch-manipulation min-h-[48px]"
          >
            <Plus className="h-5 w-5" />
Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
