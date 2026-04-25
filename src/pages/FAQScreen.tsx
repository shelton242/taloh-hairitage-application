import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

interface FAQItem {
  question: string;
  summary: string;
  details: string;
}

const faqs: FAQItem[] = [
  {
    question: "🧬 Which types of hair loss does it work on?",
    summary:
      "Effective for pattern thinning, traction, postpartum, and stress-related loss.",
    details:
      "Taloh's Hairitage™ helps with hereditary pattern thinning, thinning edges, postpartum shedding, and traction or stress-related hair loss. Works best when small fine hairs are still present.",
  },
  {
    question: "⏳ When will I start to see results?",
    summary: "Early results in 2–6 months; full results in 9–12 months.",
    details:
      "Users typically see visible results in 2–6 months, with full improvement occurring after 9–12 months of consistent use.",
  },
  {
    question:
      "🔁 If I start using Taloh's Hairitage™, can I stop once I see results?",
    summary: "Depends on the type of hair loss.",
    details:
      "For traction-related thinning, you may stop once your desired density is reached (if you maintain healthy hair practices). For hereditary pattern thinning, continuous use is required to maintain growth. Stopping the treatment will gradually reverse progress.",
  },
  {
    question: "🧠 How do I know if it's right for me?",
    summary: "Ideal for hair loss within the last 5 years.",
    details:
      "Best for users whose hair loss began in the past five years or who still have small fine hairs in thinning areas.",
  },
  {
    question: "💇🏽 Is shedding normal?",
    summary: "Yes—first 2–8 weeks.",
    details:
      "Temporary shedding during the first 2–8 weeks is normal and signals that old hairs are being replaced by newer ones.",
  },
  {
    question: "🌿 Is itching normal?",
    summary: "Mild tingling is normal; irritation is not.",
    details:
      "Light tingling is common. Persistent redness, severe itching, or flaking may indicate irritation. Discontinue use if symptoms persist.",
  },
  {
    question: "🧴 How does the Taloh's Hairitage™ system work?",
    summary: "Cleanse, condition (optional), then apply.",
    details:
      "1. Cleanse with Taloh's Hairitage™ Revitalizing Shampoo (mandatory)\n2. Condition with Taloh's Hairitage™ Strength & Restore Conditioner (optional)\n3. Apply Taloh's Hairitage™ Solution to dry scalp, beard, or eyebrow areas.",
  },
  {
    question: "🌍 Can it be used only on the scalp?",
    summary: "Safe for scalp, beard, and eyebrows.",
    details:
      "Taloh's Hairitage™ can be applied to the scalp, beard, and eyebrows. Avoid eye contact.",
  },
  {
    question: "💆🏾‍♂️ Can I apply it on wet or damp hair?",
    summary: "No—apply only to dry skin.",
    details:
      "Applying on wet or damp skin may dilute the formula and reduce absorption.",
  },
  {
    question: "☀️ Should I wash it out after applying?",
    summary: "No—let it absorb fully.",
    details:
      "Do not rinse after application. Allow a few minutes for complete absorption.",
  },
  {
    question: "🕒 How often should I apply it?",
    summary: "Twice daily, 12 hours apart.",
    details:
      "Use twice per day (morning and night), spaced 12 hours apart, for maximum effectiveness.",
  },
  {
    question: "👩🏽‍🦱 Can women use it?",
    summary: "Yes.",
    details:
      "Taloh's Hairitage™ is formulated for both men and women experiencing thinning or hair loss.",
  },
  {
    question: "🚫 Can children use it?",
    summary: "Not for users under 18.",
    details: "This product is not recommended for individuals under 18 years old.",
  },
  {
    question: "⚠️ Are there any side effects?",
    summary: "Mild irritation possible.",
    details:
      "Most users experience no side effects. Mild dryness or itching may occur. If irritation persists, stop use and consult a healthcare professional.",
  },
  {
    question: "⚕️ Does it work on scarred or burned scalps?",
    summary: "Minimal to no results.",
    details:
      "Minoxidil typically provides little to no benefit on areas with scars or burns.",
  },
  {
    question: "💆🏾 Can I use other hair products with it?",
    summary: "Yes—after it dries.",
    details:
      "You may apply oils, gels, or creams once Taloh's Hairitage™ has fully dried.",
  },
  {
    question: "⏰ What if I miss a dose?",
    summary: "Apply soon—don't double.",
    details: "Apply as soon as you remember. Never double the dose.",
  },
  {
    question: "🌸 How does it smell?",
    summary: "Light, clean fragrance.",
    details:
      "Taloh's Hairitage™ has a soft, pleasant scent that is not overpowering.",
  },
  {
    question: "🕓 How long does one bottle last?",
    summary: "About 30 days.",
    details: "A 60 mL bottle lasts approximately one month with twice-daily use.",
  },
  {
    question: "📸 How should I track my progress?",
    summary: "Upload photos every 2 weeks in the app.",
    details:
      "Use the Taloh's Hairitage™ App to upload progress photos every two weeks for accurate comparison.",
  },
];

const FAQScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Everything you need to know about Taloh's Hairitage™
          </p>
        </div>

        <Card className="mb-6 border-cyan-200 shadow-lg">
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-gray-200 rounded-lg px-4 bg-white hover:border-cyan-300 transition-colors"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-4">
                    <span className="font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="pt-2 border-t border-gray-100">
                      <p className="font-semibold text-cyan-600 mb-2">
                        {faq.summary}
                      </p>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {faq.details}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default FAQScreen;
