import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TriangleAlert as AlertTriangle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DisclaimerModalProps {
  isOpen: boolean;
  onAgree: () => void;
}

export const DISCLAIMER_TEXT = `Taloh's Hairitage™ is a cosmetic and personal care brand. Information provided within this app is for educational and informational purposes only and is not intended as professional cosmetic advice or consultation.

Results may vary from person to person. No guarantees are made regarding hair appearance, thickness, or permanence of cosmetic results.

Always perform a patch test before using any new cosmetic products, especially if you have sensitive skin or are using other cosmetic treatments.

Use of this app and its associated products constitutes acceptance of these terms.`;

const DisclaimerModal = ({ isOpen, onAgree }: DisclaimerModalProps) => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      const element = scrollRef.current;

      const checkScroll = () => {
        const isAtBottom = Math.abs(
          element.scrollHeight - element.scrollTop - element.clientHeight
        ) < 10;

        if (isAtBottom) {
          setHasScrolled(true);
        }
      };

      if (element.scrollHeight <= element.clientHeight) {
        setHasScrolled(true);
      }

      element.addEventListener("scroll", checkScroll);
      checkScroll();

      return () => element.removeEventListener("scroll", checkScroll);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-3xl bg-background rounded-3xl shadow-2xl overflow-hidden border-2 border-primary/30"
        >
          <div className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 p-8 border-b-2 border-primary/30">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-4 left-4 w-32 h-32 bg-primary rounded-full blur-3xl" />
              <div className="absolute bottom-4 right-4 w-40 h-40 bg-accent rounded-full blur-3xl" />
            </div>
            <div className="relative flex items-start gap-4">
              <div className="p-4 bg-accent/30 rounded-2xl shadow-lg border border-accent/40">
                <AlertTriangle className="h-8 w-8 text-accent" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  General Disclaimer
                </h2>
                <p className="text-base text-muted-foreground">
                  Please read this important information carefully before continuing
                </p>
              </div>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="relative p-8 max-h-[55vh] overflow-y-auto"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'hsl(var(--primary)) hsl(var(--muted))',
            }}
          >
            <div className="space-y-6">
              {DISCLAIMER_TEXT.split('\n\n').map((paragraph, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-muted/50 rounded-xl p-5 border border-border/50"
                >
                  <p className="text-foreground/90 leading-relaxed text-base">
                    {paragraph}
                  </p>
                </motion.div>
              ))}
            </div>

            {!hasScrolled && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/95 to-transparent pt-10 pb-2 text-center pointer-events-none"
              >
                <div className="flex flex-col items-center gap-2">
                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ChevronDown className="h-6 w-6 text-primary" />
                  </motion.div>
                  <p className="text-sm font-medium text-primary">
                    Scroll down to continue
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          <div className="p-8 border-t-2 border-border/50 bg-gradient-to-br from-muted/30 to-muted/50">
            <Button
              onClick={onAgree}
              disabled={!hasScrolled}
              className="w-full bg-gradient-to-r from-primary via-primary to-accent hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed h-14 text-lg font-bold rounded-xl active:scale-95"
            >
              {hasScrolled ? "I Agree & Continue" : "Please scroll to the bottom to continue"}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-4 leading-relaxed">
              By clicking "I Agree & Continue", you acknowledge that you have read, understood, and agree to this disclaimer
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DisclaimerModal;
