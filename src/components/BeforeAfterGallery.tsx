import { motion } from "framer-motion";

interface BeforeAfterPair {
  id: number;
  before: string;
  after: string;
  label?: string;
}

interface BeforeAfterGalleryProps {
  hideHeading?: boolean;
}

const photos: BeforeAfterPair[] = [
  {
    id: 1,
    before: "https://res.cloudinary.com/dgqdutijd/image/upload/v1777217828/3_waq3bz.png",
    after: "https://res.cloudinary.com/dgqdutijd/image/upload/v1777217817/4_oriwyw.png",
  },
  {
    id: 2,
    before: "https://res.cloudinary.com/dgqdutijd/image/upload/v1777217824/1_rcitph.png",
    after: "https://res.cloudinary.com/dgqdutijd/image/upload/v1777217829/2_z2mk6r.png",
  },
  {
    id: 3,
    before: "https://res.cloudinary.com/dgqdutijd/image/upload/v1777217830/7_xdpisn.png",
    after: "https://res.cloudinary.com/dgqdutijd/image/upload/v1777217818/8_u2bejf.png",
  },
];

const BeforeAfterGallery = ({ hideHeading = false }: BeforeAfterGalleryProps) => {
  const pairs = photos.filter((p) => p.before && p.after);

  return (
    <div className="w-full">
      {!hideHeading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-center mb-6"
        >
          <h2 className="text-2xl md:text-3xl font-bold">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Real Results
            </span>
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Before & After transformations from our customers
          </p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="h-0.5 w-24 mx-auto mt-3 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"
          />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="flex flex-col gap-6"
      >
        {pairs.map((pair, i) => (
          <motion.div
            key={pair.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 + i * 0.1 }}
            className="rounded-2xl overflow-hidden border border-primary/20 shadow-lg bg-card"
          >
            {pair.label && (
              <div className="px-4 py-2 text-xs text-center text-muted-foreground font-medium border-b border-primary/10">
                {pair.label}
              </div>
            )}
            <div className="grid grid-cols-2">
              <div className="relative">
                <div className="bg-primary/10 py-2 text-center border-b border-primary/10">
                  <span className="text-xs font-semibold text-primary">Before</span>
                </div>
                <div className="aspect-square overflow-hidden">
                  <img
                    src={pair.before}
                    alt="Before"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="relative border-l border-primary/10">
                <div className="bg-accent/10 py-2 text-center border-b border-primary/10">
                  <span className="text-xs font-semibold text-accent">After</span>
                </div>
                <div className="aspect-square overflow-hidden">
                  <img
                    src={pair.after}
                    alt="After"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default BeforeAfterGallery;
