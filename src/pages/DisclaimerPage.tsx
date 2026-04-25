import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TriangleAlert as AlertTriangle, Shield, Info, Ban, Bell, Scale, FlaskConical } from "lucide-react";

interface DisclaimerSection {
  id: string;
  title: string;
  description: string;
  icon: any;
}

const disclaimerSections: DisclaimerSection[] = [
  {
    id: "product-medical",
    title: "Product Disclaimer",
    description:
      "Taloh's Hairitage Hair Revitalizing Solution contains 5% minoxidil, an FDA-recognized active ingredient used for hair loss management.\n\nThis product is for external use only and is not intended to diagnose, treat, cure, or prevent any disease.\n\nNot for use by persons under 18 years of age.\n\nConsult a physician before use if you have heart conditions, scalp or skin disorders, sudden or unexplained hair loss, or existing medical concerns.\n\nDiscontinue use and consult a healthcare provider if irritation, redness, swelling, dizziness, or unwanted facial hair growth occurs.",
    icon: FlaskConical,
  },
  {
    id: "results-consistency",
    title: "Results & Consistency Disclaimer",
    description:
      "Hair regrowth requires consistent and ongoing use of the Taloh's Hairitage system as directed. Hair loss types vary. Results depend on genetics, type of hair loss, consistency of use, and overall health. Stopping use may result in gradual loss of regrown hair. Most users may begin noticing visible changes within 3–6 months of consistent use. Individual results and timelines may vary.",
    icon: Info,
  },
  {
    id: "beard-facial",
    title: "Beard & Facial Use Disclaimer",
    description:
      "Facial skin is more sensitive than scalp skin. Application to the beard or facial area should be done cautiously. Dryness, flaking, redness, or cosmetic reactions may occur. Begin with a small amount and reduce frequency if sensitivity develops. Avoid contact with eyes, mouth, broken skin, or sensitive areas. Wash hands thoroughly after application.",
    icon: AlertTriangle,
  },
  {
    id: "payment-transaction",
    title: "Payment & Transaction Disclaimer",
    description:
      "All payments are securely processed through a third-party payment provider. Taloh's Hairitage does not store or process credit or debit card information. By completing a purchase, you authorize payment for the selected products and agree to the applicable refund, return, and shipping policies. Receipts are provided electronically for your records.\n\nWe encourage online purchases for both your safety and ours.",
    icon: Shield,
  },
  {
    id: "refund-continuity",
    title: "Refund & Continuity Disclaimer",
    description:
      "Due to the nature of hair care products, opened or used products are not eligible for refunds unless defective. Discontinuing use of the system may result in loss of cosmetic progress, particularly for ongoing hair appearance concerns.",
    icon: Ban,
  },
  {
    id: "notifications-reminders",
    title: "Notifications & Reminders Disclaimer",
    description:
      "Notifications and reminders are provided as a convenience tool only. Taloh's Hairitage is not responsible for missed applications, incorrect usage, or failure to follow instructions.",
    icon: Bell,
  },
  {
    id: "jurisdiction-law",
    title: "Jurisdiction & Governing Law",
    description:
      "These terms are governed by the laws of the Commonwealth of The Bahamas. Any disputes shall be handled within the applicable jurisdiction.",
    icon: Scale,
  },
];

const DisclaimerPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container max-w-5xl mx-auto px-4 py-8 md:py-12 pb-24 md:pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-amber-500/20 border border-cyan-500/30 mb-4">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-bold text-cyan-400 uppercase tracking-wider">
              Important Information
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-amber-400 to-cyan-400 bg-clip-text text-transparent">
              Disclaimer
            </span>
          </h1>
        </motion.div>

        <Alert className="mb-8 bg-amber-500/10 border-amber-500/30">
          <AlertTriangle className="h-5 w-5 text-amber-400" />
          <AlertDescription className="text-gray-200 ml-2">
            This disclaimer provides important guidance for safe and effective use of our products on facial areas.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          {disclaimerSections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-gray-800/50 border-cyan-500/20 backdrop-blur-sm hover:border-cyan-500/40 transition-all duration-300 shadow-lg hover:shadow-cyan-500/10">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-amber-500/20 border border-cyan-500/30 flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-cyan-400" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl md:text-2xl text-white mb-2">
                          {section.title}
                        </CardTitle>
                        <CardDescription className="text-gray-300 text-base leading-relaxed whitespace-pre-line">
                          {section.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-br from-cyan-500/10 to-amber-500/10 border-cyan-500/30 backdrop-blur-sm shadow-lg">
            <CardContent className="py-6">
              <div className="flex items-start gap-4">
                <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Questions about product usage?{" "}
                    <a
                      href="/faq"
                      className="text-cyan-400 hover:text-cyan-300 font-semibold underline decoration-cyan-400/30 hover:decoration-cyan-300 transition-colors"
                    >
                      Visit our FAQ
                    </a>{" "}
                    or contact our support team for assistance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-500 text-xs">
            Last Updated: {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default DisclaimerPage;
