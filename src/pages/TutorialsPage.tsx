import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CirclePlay as PlayCircle, Info } from "lucide-react";

interface Tutorial {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  category: string;
}

const tutorials: Tutorial[] = [
  {
    id: "hair-revitalization-guide",
    title: "Hair Revitalizing Solution Application Guide",
    description:
      "Complete step-by-step guide on how to properly apply the hair revitalizing solution for optimal results and maximum effectiveness.",
    videoUrl: "https://res.cloudinary.com/dgqdutijd/video/upload/v1770571961/hairitage-hair-revitalizing-solution-application-guide_n0qhzi.mp4",
    duration: "Video Guide",
    category: "Application",
  },
  {
    id: "beard-growth-guide",
    title: "Beard Growth Solution Application Guide",
    description:
      "Complete step-by-step guide on how to properly apply the beard growth solution for optimal results and maximum effectiveness.",
    videoUrl: "https://res.cloudinary.com/dgqdutijd/video/upload/v1770571967/beard-growth-solution-application-guide_i6j7sp.mp4",
    duration: "Video Guide",
    category: "Application",
  },
  {
    id: "shampoo-wash",
    title: "3-in-1 Shampoo & Beard Wash Guide",
    description:
      "Discover how to use our versatile shampoo for scalp, hair, and beard care. Perfect for your daily routine.",
    videoUrl: "https://res.cloudinary.com/dgqdutijd/video/upload/v1770327364/talohs-hairitage-3-in-1-shampoo-guide_1_tkiqj3.mp4",
    duration: "Video Guide",
    category: "Care Routine",
  },
  {
    id: "results-timeline",
    title: "Results Timeline",
    description:
      "See the typical progression of results over time with consistent use of the Hair Revitalizing Solution. Understand what to expect at each stage of your hair regrowth journey.",
    videoUrl: "https://res.cloudinary.com/dgqdutijd/video/upload/v1770325890/hair-revitalizing-solution-user-timeline_sy1lel.mp4",
    duration: "Video Guide",
    category: "Results & Expectations",
  },
];

const TutorialsPage = () => {
  const [loadedVideos, setLoadedVideos] = useState<Set<string>>(new Set());

  const handleVideoLoad = (id: string) => {
    setLoadedVideos((prev) => new Set(prev).add(id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container max-w-6xl mx-auto px-4 py-8 md:py-12 pb-24 md:pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-amber-500/20 border border-cyan-500/30 mb-4">
            <PlayCircle className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-bold text-cyan-400 uppercase tracking-wider">
              Video Tutorials
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-amber-400 to-cyan-400 bg-clip-text text-transparent">
              Master the Method
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Pro techniques. Maximum results. Watch and win.
          </p>
        </motion.div>

        <div className="space-y-8">
          {tutorials.map((tutorial, index) => (
            <motion.div
              key={tutorial.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="bg-gray-800/50 border-cyan-500/20 backdrop-blur-sm overflow-hidden hover:border-cyan-500/40 transition-all duration-300 shadow-xl">
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-2xl md:text-3xl text-white mb-2">
                        {tutorial.title}
                      </CardTitle>
                      <CardDescription className="text-gray-300 text-base">
                        {tutorial.description}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 whitespace-nowrap"
                    >
                      {tutorial.duration}
                    </Badge>
                  </div>
                  <Badge
                    variant="outline"
                    className="w-fit border-amber-500/30 text-amber-400"
                  >
                    {tutorial.category}
                  </Badge>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900 shadow-2xl">
                    {!loadedVideos.has(tutorial.id) && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
                      </div>
                    )}
                    {tutorial.videoUrl.includes('cloudinary.com') ? (
                      <video
                        src={tutorial.videoUrl}
                        title={tutorial.title}
                        className="w-full h-full object-cover"
                        style={
                          tutorial.id === 'shampoo-wash'
                            ? { objectPosition: 'center 70%' }
                            : undefined
                        }
                        controls
                        preload="metadata"
                        poster={
                          tutorial.id === 'hair-revitalization-guide'
                            ? 'https://res.cloudinary.com/dgqdutijd/image/upload/v1770677602/d614d98e-2e37-4233-9b9c-d90c28362ba5_sfosar.png'
                            : tutorial.id === 'shampoo-wash'
                            ? 'https://res.cloudinary.com/dgqdutijd/image/upload/v1770678723/ChatGPT_Image_Feb_9_2026_06_10_04_PM_dfgwhi.png'
                            : tutorial.id === 'beard-growth-guide'
                            ? 'https://res.cloudinary.com/dgqdutijd/image/upload/v1770678724/ChatGPT_Image_Feb_9_2026_06_10_33_PM_bv4dcm.png'
                            : tutorial.id === 'results-timeline'
                            ? 'https://res.cloudinary.com/dgqdutijd/image/upload/v1770571300/file_000000003d9071f597a787f492e73ac4_1_m9q3x6.png'
                            : undefined
                        }
                        onLoadedData={() => handleVideoLoad(tutorial.id)}
                      />
                    ) : (
                      <iframe
                        src={tutorial.videoUrl}
                        title={tutorial.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onLoad={() => handleVideoLoad(tutorial.id)}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <Card className="bg-cyan-500/10 border-cyan-500/30 backdrop-blur-sm">
            <CardContent className="py-6">
              <p className="text-gray-300 text-sm">
                Have questions about application or results?{" "}
                <a
                  href="/faq"
                  className="text-cyan-400 hover:text-cyan-300 font-semibold underline decoration-cyan-400/30 hover:decoration-cyan-300 transition-colors"
                >
                  Check our FAQ
                </a>{" "}
                or{" "}
                <a
                  href="/disclaimer"
                  className="text-amber-400 hover:text-amber-300 font-semibold underline decoration-amber-400/30 hover:decoration-amber-300 transition-colors"
                >
                  read our disclaimer
                </a>
                .
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default TutorialsPage;
