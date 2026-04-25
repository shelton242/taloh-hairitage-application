import { Link, useLocation } from "react-router-dom";
import { Hop as Home, ShoppingBag, Image, Bell, User } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

const BottomNav = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { path: "/home", icon: Home, label: "Home", requiresAuth: true },
    { path: "/reminders", icon: Bell, label: "Reminders", requiresAuth: true },
    { path: "/shop", icon: ShoppingBag, label: "Shop", requiresAuth: true },
    { path: "/progress", icon: Image, label: "Progress", requiresAuth: true },
    { path: "/profile", icon: User, label: "Profile", requiresAuth: true },
  ];

  const filteredItems = navItems.filter((item) => !item.requiresAuth || user);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-primary/20 pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {filteredItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center justify-center flex-1 h-full group"
            >
              <motion.div
                className="relative"
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.1 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 -m-3 rounded-2xl bg-primary/10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}

                <div className="relative flex flex-col items-center gap-1">
                  <div className="relative">
                    <Icon
                      className={`h-6 w-6 transition-colors ${
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground"
                      }`}
                      style={
                        isActive
                          ? {
                              filter:
                                "drop-shadow(0 0 4px hsl(180 95% 55% / 0.5))",
                            }
                          : undefined
                      }
                    />
                  </div>

                  <span
                    className={`text-xs font-medium transition-colors ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
