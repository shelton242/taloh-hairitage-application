export const dailyTips = [
  "Apply to dry scalp. Let it absorb. Then style.",
  "Consistency wins. Set reminders. Never miss.",
  "Photo every 2 weeks. Track the transformation.",
  "Store cool and dry. Keep it potent.",
  "Massage gently. Boost absorption. Maximize results.",
  "Hydrate. Eat smart. Fuel your hair.",
  "Skip harsh shampoos. Protect natural oils.",
  "Patience pays. Results show at 3-6 months.",
  "Gentle touch only. No need to scrub hard.",
  "Match reminders to your schedule. Stay locked in.",
  "Track every application. Build your streak.",
  "Join the community. Share wins. Get tips.",
  "Before photos unlock progress visibility.",
  "Mild tingling? Normal. Temporary. Keep going.",
  "Less is more. Don't over-apply.",
  "Clean scalp = best results. Remove buildup.",
  "Silk pillowcase reduces friction while you sleep.",
  "Don't wash immediately. Let it work its magic.",
  "Lock it into your routine. Morning or night.",
  "Share your progress. Get motivated.",
  "Your journey is unique. Focus on your wins.",
  "Check tutorials for pro application techniques.",
  "Stay committed. Results take time.",
  "Limit heat styling. Protect your gains.",
  "Note what works. Optimize your routine.",
  "Celebrate every win. Stay motivated.",
  "Use progress tracker. Document visually.",
  "Consistent timing = optimal results.",
  "Questions? Reach our support team instantly.",
  "Trust the process. Give it time.",
  "Take Biotin (B7) vitamins daily for faster results.",
  "Best consistency scores are considered during giveaways so stay consistent.",
  "Apply solution twice daily, 12 hours apart, without skipping days for optimal results.",
  "Always ensure your scalp is completely dry before application to maximize absorption.",
  "Visible results typically appear within 2-6 months. Full results may take 9-12 months.",
];

export const getDailyTip = (): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
  const tipIndex = daysSinceEpoch % dailyTips.length;
  return dailyTips[tipIndex];
};
