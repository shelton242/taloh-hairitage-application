import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import logo from "@/assets/WhatsApp_Image_2026-03-25_at_8.12.25_AM.jpeg";
import noCap from "@/assets/WhatsApp_Image_2026-04-08_at_6.56.53_PM.jpeg";
import heroBackground from "@/assets/Nano_Banana_Pro_place_both_bottles_in_one_photo__standing_on_a_dark_reflective_surface_with_dramatic.png";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BeforeAfterGallery from "@/components/BeforeAfterGallery";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/home");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="relative px-4 py-4 max-w-4xl mx-auto min-h-[80vh] flex flex-col items-center justify-start space-y-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center space-y-2 text-center"
        >
          <motion.img
            src={logo}
            alt="Taloh's Hairitage"
            className="w-64 md:w-80 lg:w-96 h-auto drop-shadow-2xl"
            style={{ mixBlendMode: 'screen' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-3 max-w-2xl"
          >
            <motion.h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundImage: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)))",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Strengthening and Revitalizing Your Confidence,
              <br />
              <span className="text-accent">One Strand at a Time!</span>
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="w-full max-w-2xl"
        >
          <Card className="border-primary/20 shadow-2xl shadow-primary/10 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <h1 className="text-3xl font-bold mb-3">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Your Hair Journey Starts Here
                </span>
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                Master your routine. Track real results. Everything you need—smart reminders, progress photos, expert tutorials—right here.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="relative px-4 pb-24 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-center mb-8 mt-4"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-primary/70 mb-2">Real People. Real Results.</p>
          <h2 className="text-2xl md:text-3xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Before & After Transformations
            </span>
            <br />
            <span className="text-foreground text-xl md:text-2xl font-medium">from Actual Users</span>
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="h-0.5 w-28 mx-auto mt-3 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full"
          />
        </motion.div>
        <BeforeAfterGallery hideHeading />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-12 flex flex-col items-center gap-4"
        >
          <img
            src={noCap}
            alt="No more concealment"
            className="w-24 h-24 rounded-full object-cover border-2 border-primary/30 shadow-lg"
          />
          <div className="text-center">
            <p className="text-lg md:text-xl font-semibold tracking-wide text-foreground/80 italic">
              Less concealment,
            </p>
            <p className="text-lg md:text-xl font-semibold tracking-wide text-foreground/80 italic">
              more confidence
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
