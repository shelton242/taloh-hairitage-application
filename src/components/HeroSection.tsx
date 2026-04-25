import heroBg from "@/assets/hero-bg.jpg";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import logo from "@/assets/logo-transparent.png";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="Healthy hair" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative container mx-auto px-4 py-20 md:py-32 lg:py-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-8 flex justify-center"
          >
            <img
              src={logo}
              alt="Taloh's Hairitage"
              className="h-56 md:h-72 lg:h-80 w-auto"
              style={{
                filter: 'drop-shadow(0 0 8px hsl(180 95% 55% / 0.15)) drop-shadow(0 0 16px hsl(43 100% 62% / 0.1))'
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 backdrop-blur-sm"
          >
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium tracking-wider uppercase bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Elite Hair Revival
            </span>
          </motion.div>

          <h1 className="font-display text-5xl font-bold leading-[1.1] text-foreground md:text-6xl lg:text-7xl mb-6">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent text-glow-cyan">
              Unlock Your Hair's Power
            </span>
            <br />
            <span className="text-foreground">Own Your Heritage</span>
          </h1>

          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
            Ancient wisdom meets cutting-edge science. Taloh's Hairitage delivers precision-crafted formulas that revive, fortify, and unleash your hair's natural brilliance.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center w-full max-w-lg mx-auto px-4"
          >
            <motion.a
              href="#products"
              whileTap={{ scale: 0.97 }}
              className="group relative inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-accent via-accent to-accent/90 px-8 py-5 text-lg font-bold text-accent-foreground shadow-2xl shadow-accent/50 active:shadow-accent/70 transition-all duration-200 overflow-hidden glow-gold touch-manipulation min-h-[56px]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative">Shop Now</span>
            </motion.a>

            <motion.a
              href="#products"
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center rounded-2xl border-2 border-primary/60 px-8 py-5 text-lg font-semibold text-primary active:bg-primary/10 active:border-primary shadow-xl shadow-primary/30 active:shadow-primary/50 transition-all duration-200 backdrop-blur-sm touch-manipulation min-h-[56px]"
            >
See Real Results
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span>Pure Ingredients</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span>Science-Backed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span>Real Results</span>
            </div>
          </motion.div>

        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
