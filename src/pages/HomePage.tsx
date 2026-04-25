import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getDailyTip } from "@/lib/dailyTips";
import { Lightbulb, TrendingUp, Facebook, Mail, MessageCircle, CircleCheck as CheckCircle2, Sparkles, Droplets } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { format, addHours, differenceInMinutes } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Bell, BellOff } from "lucide-react";

interface ProgressMetrics {
  lastApplication: string | null;
  nextApplication: string | null;
  streak: number;
  consistency: number;
  totalApplications: number;
  canMarkDone: boolean;
}

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const dailyTip = getDailyTip();
  const [metrics, setMetrics] = useState<ProgressMetrics>({
    lastApplication: null,
    nextApplication: null,
    streak: 0,
    consistency: 0,
    totalApplications: 0,
    canMarkDone: true,
  });
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
const [reminderStatus, setReminderStatus] = useState<{
  solution: boolean;
  shampoo: boolean;
}>({ solution: false, shampoo: false });
const [checkingReminders, setCheckingReminders] = useState(true);

const checkReminderStatus = async () => {
  if (!user) return;
  
  setCheckingReminders(true);
  try {
    const { data, error } = await supabase
      .from("reminder_settings")
      .select("reminder_type, enabled")
      .eq("user_id", user.id);

    if (!error && data) {
      const status = {
        solution: data.find(r => r.reminder_type === "solution")?.enabled || false,
        shampoo: data.find(r => r.reminder_type === "shampoo")?.enabled || false,
      };
      setReminderStatus(status);
    }
  } catch (error) {
    console.error("Error checking reminder status:", error);
  } finally {
    setCheckingReminders(false);
  }
};


  useEffect(() => {
    if (user) {
      loadUserProgress();
    checkReminderStatus(); // Add this line

      // Set up real-time subscription for reminder_settings changes
      const channel = supabase
        .channel('reminder-progress-updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'reminder_settings',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            loadUserProgress();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const loadUserProgress = async () => {
    if (!user) return;

    try {
      const { data: settings } = await supabase
        .from("reminder_settings")
        .select("*")
        .eq("user_id", user.id)
        .eq("reminder_type", "solution")
        .maybeSingle();

      if (!settings) {
        setLoading(false);
        return;
      }

      const lastApp = settings.last_application_time;
      const nextApp = settings.next_application_due;
      const frequencyHours = settings.frequency_hours || 12;

      let canMark = true;
      if (lastApp) {
        const minutesSinceLast = differenceInMinutes(new Date(), new Date(lastApp));
        canMark = minutesSinceLast >= (frequencyHours * 60 - 60);
      }

      setMetrics({
        lastApplication: lastApp,
        nextApplication: nextApp,
        streak: settings.current_streak || 0,
        consistency: settings.consistency_percentage || 0,
        totalApplications: settings.total_applications || 0,
        canMarkDone: canMark,
      });
    } catch (error) {
      console.error("Error loading progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const markApplicationDone = async () => {
    if (!user || marking || !metrics.canMarkDone) return;

    setMarking(true);
    try {
      const { data: settings } = await supabase
        .from("reminder_settings")
        .select("frequency_hours")
        .eq("user_id", user.id)
        .eq("reminder_type", "solution")
        .maybeSingle();

      if (!settings) {
        toast({
          title: "Setup Required",
          description: "Please set up your reminders first",
          variant: "destructive",
        });
        return;
      }

      const now = new Date();
      const nextDue = addHours(now, settings.frequency_hours);

      const { error: logError } = await supabase
        .from("application_logs")
        .insert({
          user_id: user.id,
          application_time: now.toISOString(),
          reminder_type: "solution",
        });

      if (logError) throw logError;

      const { data: streakData, error: streakError } = await supabase.rpc("update_streak", {
        p_user_id: user.id,
        p_reminder_type: "solution",
      });

      if (streakError) {
        console.error("Error calculating streak:", streakError);
      }

      const { data: consistencyData, error: consistencyError } = await supabase.rpc(
        "calculate_consistency_percentage",
        {
          p_user_id: user.id,
          p_reminder_type: "solution",
        }
      );

      if (consistencyError) {
        console.error("Error calculating consistency:", consistencyError);
      }

      const newStreak = streakData ?? 0;
      const newConsistency = consistencyData ?? 0;

      console.log("Updating progress:", {
        streak: newStreak,
        consistency: newConsistency,
        totalApplications: metrics.totalApplications + 1
      });

      const { error: updateError } = await supabase
        .from("reminder_settings")
        .update({
          last_application_time: now.toISOString(),
          next_application_due: nextDue.toISOString(),
          total_applications: metrics.totalApplications + 1,
          current_streak: newStreak,
          consistency_percentage: newConsistency,
        })
        .eq("user_id", user.id)
        .eq("reminder_type", "solution");

      if (updateError) throw updateError;

      // Optimistically update the UI immediately
      setMetrics({
        lastApplication: now.toISOString(),
        nextApplication: nextDue.toISOString(),
        streak: newStreak,
        consistency: newConsistency,
        totalApplications: metrics.totalApplications + 1,
        canMarkDone: false,
      });

      toast({
        title: "Application Logged!",
        description: "Keep up the great work!",
      });

      // Reload to ensure we have the latest data
      await loadUserProgress();
    } catch (error: any) {
      console.error("Error marking application:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to log application",
        variant: "destructive",
      });
    } finally {
      setMarking(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 px-4 py-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Welcome Back!
            </span>
          </h1>
          <p className="text-muted-foreground">
            Track your routine and achieve your hair goals
          </p>
        </div>

        <Card className="border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Today's Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                    <p className="text-xs text-muted-foreground mb-1">Streak</p>
                    <p className="text-2xl font-bold text-primary">{metrics.streak}</p>
                  </div>
                  <div className="bg-accent/5 rounded-lg p-4 border border-accent/10">
                    <p className="text-xs text-muted-foreground mb-1">Consistency</p>
                    <p className="text-2xl font-bold text-accent">{metrics.consistency.toFixed(0)}%</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-muted-foreground">Last Application</span>
                    <span className="text-sm font-semibold">
                      {metrics.lastApplication
                        ? format(new Date(metrics.lastApplication), "MMM d, h:mm a")
                        : "Not yet"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-muted-foreground">Next Application</span>
                    <span className="text-sm font-semibold">
                      {metrics.nextApplication
                        ? format(new Date(metrics.nextApplication), "MMM d, h:mm a")
                        : "Set reminder first"}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={markApplicationDone}
                  disabled={marking || !metrics.canMarkDone}
                  className="w-full h-12 font-bold rounded-xl bg-gradient-to-r from-primary to-primary/90 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {marking ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Logging...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      <span>{metrics.canMarkDone ? "Mark Application Done" : "Too Soon"}</span>
                    </div>
                  )}
                </Button>
                {!metrics.canMarkDone && (
                  <p className="text-xs text-center text-muted-foreground">
                    Wait at least 11 hours between applications
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>

{/* Add this after the Today's Progress Card */}
<Card className="border-primary/20 shadow-lg">
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Bell className="h-5 w-5 text-primary" />
      Reminder Status
    </CardTitle>
  </CardHeader>
  <CardContent className="space-y-3">
    {checkingReminders ? (
      <div className="flex justify-center py-4">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    ) : (
      <>
        <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-3">
            <Droplets className="h-5 w-5 text-primary" />
            <span className="font-medium">Hair Solution</span>
          </div>
          <div className="flex items-center gap-2">
            {reminderStatus.solution ? (
              <>
                <Bell className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-500">Active</span>
              </>
            ) : (
              <>
                <BellOff className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Inactive</span>
              </>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center p-3 rounded-lg bg-accent/5 border border-accent/10">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-accent" />
            <span className="font-medium">Shampoo & Beard Wash</span>
          </div>
          <div className="flex items-center gap-2">
            {reminderStatus.shampoo ? (
              <>
                <Bell className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-500">Active</span>
              </>
            ) : (
              <>
                <BellOff className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Inactive</span>
              </>
            )}
          </div>
        </div>
        
        <Button
          variant="outline"
          className="w-full mt-2"
          onClick={() => navigate("/reminders")}
        >
          Manage Reminders
        </Button>
      </>
    )}
  </CardContent>
</Card>

        <Card className="border-primary/20 hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => navigate("/tutorials")}>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors">
              <Lightbulb className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold">How to Apply Solution</h3>
              <p className="text-sm text-muted-foreground">Learn more</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Daily Tip
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">{dailyTip}</p>
          </CardContent>
        </Card>

        <div className="mt-8">
          <Card className="border-primary/20 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">Connect With Us</h3>
              <div className="flex justify-center gap-4">
                <a
                  href="https://www.facebook.com/profile.php?id=61588103206815"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1877F2] hover:scale-110 transition-transform shadow-lg hover:shadow-xl"
                  aria-label="Facebook"
                >
                  <Facebook className="h-6 w-6 text-white" />
                </a>
                <a
                  href="https://wa.me/message/C3LKH4QVNVHXB1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] hover:scale-110 transition-transform shadow-lg hover:shadow-xl"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-6 w-6 text-white" />
                </a>
                <a
                  href="mailto:Talohshairitage@gmail.com?subject=Inquiry from Hair Heritage App"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-primary hover:scale-110 transition-transform shadow-lg hover:shadow-xl"
                  aria-label="Email"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Mail className="h-6 w-6 text-white" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;
