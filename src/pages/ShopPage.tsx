import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";
import { motion } from "framer-motion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Shield, ChevronDown } from "lucide-react";
import { useState } from "react";

const ShopPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <section id="shop" className="relative px-4 py-12 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

        <div className="relative text-center mb-12 md:mb-16 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4 md:space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/15 to-accent/15 border border-accent/30">
              <span className="text-xs md:text-sm font-bold tracking-wider uppercase bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                The Collection
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent text-glow-gold">
                Power Formulas
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
              Your crown starts here.
              <span className="block mt-2 text-accent font-semibold">Free delivery across Nassau</span>
            </p>
          </motion.div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="max-w-7xl mx-auto mt-12">
          <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between px-5 py-4 rounded-xl border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Payment & Transaction Disclaimer</span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 px-5 py-4 rounded-xl border border-border/50 bg-muted/20 text-sm text-muted-foreground leading-relaxed space-y-3">
                <p>
                  All payments are securely processed through a third-party payment provider. Taloh's Hairitage does not store or process credit or debit card information.
                </p>
                <p>
                  By completing a purchase, you authorize payment for the selected products and agree to the applicable refund, return, and shipping policies. Receipts are provided electronically for your records.
                </p>
                <p>
                  Due to the nature of hair care products, opened or used products are not eligible for refunds unless defective. Discontinuing use of the system may result in loss of cosmetic progress, particularly for ongoing hair appearance concerns.
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </section>
    </div>
  );
};

export default ShopPage;
