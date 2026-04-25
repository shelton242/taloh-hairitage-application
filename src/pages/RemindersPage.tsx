import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Droplets, Sparkles, Clock, CheckCircle2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { registerPush } from "@/utils/pushNotifications";
import { Button } from "@/components/ui/button";

const RemindersPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [solutionEnabled, setSolutionEnabled] = useState(false);
  const [shampooEnabled, setShampooEnabled] = useState(false);
  const [shampooFrequency, setShampooFrequency] = useState<"24" | "48">("24");
  const [solutionTime, setSolutionTime] = useState("09:00");
  const [shampooTime, setShampooTime] = useState("08:00");
  const [pushEnabled, setPushEnabled] = useState(false);
  const [checkingPushStatus, setCheckingPushStatus] = useState(false);

  useEffect(() => {
    if (user) {
      loadReminderSettings();
    }
  }, [user]);

  const checkPushStatus = async () => {
    if (!user) return;

    setCheckingPushStatus(true);
    try {
      const { data, error } = await supabase
        .from("push_subscriptions")
        .select("*")
        .eq("user_id", user.id);

      if (!error && data && data.length > 0) {
        setPushEnabled(true);
      }
    } catch (error) {
      console.error("Error checking push status:", error);
    } finally {
      setCheckingPushStatus(false);
    }
  };

  // Add this function to enable push notifications
  const enablePushNotifications = async () => {
    if (!user) return;

    try {
      await registerPush(user.id);
      await checkPushStatus();
      toast.success("Push notifications enabled successfully!");
    } catch (error) {
      console.error("Error enabling push notifications:", error);
      toast.error("Failed to enable push notifications");
    }
  };

  // Add this useEffect to check push status on load
  useEffect(() => {
    if (user) {
      checkPushStatus();
    }
  }, [user]);


  const loadReminderSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("reminder_settings")
        .select("*")
        .eq("user_id", user?.id);

      if (error) throw error;

      if (data && data.length > 0) {
        data.forEach((setting) => {
          if (setting.reminder_type === "solution") {
            setSolutionEnabled(setting.enabled);
            setSolutionTime(setting.start_time);
          } else if (setting.reminder_type === "shampoo") {
            setShampooEnabled(setting.enabled);
            setShampooTime(setting.start_time);
            setShampooFrequency(setting.frequency_hours.toString() as "24" | "48");
          }
        });
      }
    } catch (error: any) {
      console.error("Error loading reminder settings:", error);
      toast.error("Failed to load reminder settings");
    } finally {
      setLoading(false);
    }
  };

  const saveReminderSetting = async (
    reminderType: "solution" | "shampoo",
    enabled: boolean,
    startTime: string,
    frequencyHours: number
  ) => {
    if (!user) return;

    setSaving(true);
    try {
      // Check if this reminder already exists
      const { data: existing } = await supabase
        .from("reminder_settings")
        .select("id, next_application_due, current_streak, consistency_percentage, total_applications")
        .eq("user_id", user.id)
        .eq("reminder_type", reminderType)
        .maybeSingle();

      // Calculate initial next_application_due based on start_time
      const now = new Date();
      const [hours, minutes] = startTime.split(':').map(Number);
      const nextDue = new Date();
      nextDue.setHours(hours, minutes, 0, 0);

      // If the start time has already passed today, schedule for next occurrence
      if (nextDue <= now) {
        nextDue.setTime(nextDue.getTime() + frequencyHours * 60 * 60 * 1000);
      }

      const updateData: any = {
        user_id: user.id,
        reminder_type: reminderType,
        enabled,
        start_time: startTime,
        frequency_hours: frequencyHours,
        updated_at: new Date().toISOString(),
      };

      // Only set next_application_due if it doesn't exist or if we're enabling for the first time
      if (!existing || !existing.next_application_due) {
        updateData.next_application_due = nextDue.toISOString();
      }

      // Initialize tracking fields only for new reminders
      if (!existing) {
        updateData.current_streak = 0;
        updateData.consistency_percentage = 0;
        updateData.total_applications = 0;
      }

      const { error } = await supabase
        .from("reminder_settings")
        .upsert(updateData, {
          onConflict: "user_id,reminder_type",
          ignoreDuplicates: false,
        });

      if (error) throw error;

      toast.success("Reminder settings saved");
    } catch (error: any) {
      console.error("Error saving reminder setting:", error);
      toast.error("Failed to save reminder settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSolutionToggle = (checked: boolean) => {
    setSolutionEnabled(checked);
    saveReminderSetting("solution", checked, solutionTime, 12);
  };

  const handleShampooToggle = (checked: boolean) => {
    setShampooEnabled(checked);
    saveReminderSetting("shampoo", checked, shampooTime, parseInt(shampooFrequency));
  };

  const handleSolutionTimeChange = (time: string) => {
    setSolutionTime(time);
    saveReminderSetting("solution", solutionEnabled, time, 12);
  };

  const handleShampooTimeChange = (time: string) => {
    setShampooTime(time);
    saveReminderSetting("shampoo", shampooEnabled, time, parseInt(shampooFrequency));
  };

  const handleShampooFrequencyChange = (frequency: "24" | "48") => {
    setShampooFrequency(frequency);
    saveReminderSetting("shampoo", shampooEnabled, shampooTime, parseInt(frequency));
  };

  if (loading) {
    return (
      <div className="min-h-screen pb-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8">
      <div className="px-4 py-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Reminders
              </h1>
            </div>
          </div>
          <p className="text-muted-foreground text-base md:text-lg">
            Never miss. Stay locked in.
          </p>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`relative overflow-hidden rounded-3xl border transition-all duration-300 ${solutionEnabled
                ? "border-primary/40 bg-gradient-to-br from-card via-card to-primary/5 shadow-2xl shadow-primary/20"
                : "border-primary/20 bg-card/50 shadow-lg shadow-primary/10"
              }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50" />
            {solutionEnabled && (
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-50 blur-xl -z-10" />
            )}

            <div className="relative p-6 md:p-8">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-accent/20 border border-primary/40">
                      <Droplets className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                      Hair Revitalizing Solution
                    </h3>
                  </div>
                  <p className="text-lg text-muted-foreground mb-4">
                    Apply every 12 hours
                  </p>

                  <div className="mb-4">
                    <Label htmlFor="solution-time" className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Start time
                    </Label>
                    <input
                      id="solution-time"
                      type="time"
                      value={solutionTime}
                      onChange={(e) => handleSolutionTimeChange(e.target.value)}
                      disabled={saving}
                      className="w-full px-4 py-3 rounded-xl bg-background/50 border border-primary/30 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50"
                    />
                  </div>

                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${solutionEnabled
                        ? "bg-primary/20 text-primary border border-primary/40"
                        : "bg-muted/50 text-muted-foreground border border-border/50"
                      }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${solutionEnabled ? "bg-primary animate-pulse" : "bg-muted-foreground/50"
                      }`} />
                    {solutionEnabled ? "Active" : "Inactive"}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <Switch
                    id="solution-toggle"
                    checked={solutionEnabled}
                    onCheckedChange={handleSolutionToggle}
                    disabled={saving}
                    className="data-[state=checked]:bg-primary"
                  />
                  <Label
                    htmlFor="solution-toggle"
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    {solutionEnabled ? "On" : "Off"}
                  </Label>
                </div>
              </div>

              {solutionEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pt-4 border-t border-primary/20"
                >
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <Bell className="h-4 w-4" />
                    <span className="font-medium">
                      First reminder at {solutionTime}, then every 12 hours
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`relative overflow-hidden rounded-3xl border transition-all duration-300 ${shampooEnabled
                ? "border-accent/40 bg-gradient-to-br from-card via-card to-accent/5 shadow-2xl shadow-accent/20"
                : "border-primary/20 bg-card/50 shadow-lg shadow-primary/10"
              }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 opacity-50" />
            {shampooEnabled && (
              <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 via-primary/20 to-accent/20 opacity-50 blur-xl -z-10" />
            )}

            <div className="relative p-6 md:p-8">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-accent/30 to-primary/20 border border-accent/40">
                      <Sparkles className="h-5 w-5 text-accent" />
                    </div>
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                      3-in-1 Shampoo & Beard Wash
                    </h3>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-3">
                      Select frequency
                    </p>
                    <div className="flex gap-3">
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleShampooFrequencyChange("24")}
                        disabled={saving}
                        className={`flex-1 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 touch-manipulation min-h-[56px] disabled:opacity-50 ${shampooFrequency === "24"
                            ? "bg-gradient-to-r from-accent to-accent/90 text-accent-foreground shadow-xl shadow-accent/40"
                            : "bg-muted/50 text-muted-foreground border border-border/50 hover:bg-muted"
                          }`}
                      >
                        24 hours
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleShampooFrequencyChange("48")}
                        disabled={saving}
                        className={`flex-1 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 touch-manipulation min-h-[56px] disabled:opacity-50 ${shampooFrequency === "48"
                            ? "bg-gradient-to-r from-accent to-accent/90 text-accent-foreground shadow-xl shadow-accent/40"
                            : "bg-muted/50 text-muted-foreground border border-border/50 hover:bg-muted"
                          }`}
                      >
                        48 hours
                      </motion.button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <Label htmlFor="shampoo-time" className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Start time
                    </Label>
                    <input
                      id="shampoo-time"
                      type="time"
                      value={shampooTime}
                      onChange={(e) => handleShampooTimeChange(e.target.value)}
                      disabled={saving}
                      className="w-full px-4 py-3 rounded-xl bg-background/50 border border-accent/30 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all disabled:opacity-50"
                    />
                  </div>

                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${shampooEnabled
                        ? "bg-accent/20 text-accent border border-accent/40"
                        : "bg-muted/50 text-muted-foreground border border-border/50"
                      }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${shampooEnabled ? "bg-accent animate-pulse" : "bg-muted-foreground/50"
                      }`} />
                    {shampooEnabled ? "Active" : "Inactive"}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <Switch
                    id="shampoo-toggle"
                    checked={shampooEnabled}
                    onCheckedChange={handleShampooToggle}
                    disabled={saving}
                    className="data-[state=checked]:bg-accent"
                  />
                  <Label
                    htmlFor="shampoo-toggle"
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    {shampooEnabled ? "On" : "Off"}
                  </Label>
                </div>
              </div>

              {shampooEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pt-4 border-t border-accent/20"
                >
                  <div className="flex items-center gap-2 text-sm text-accent">
                    <Bell className="h-4 w-4" />
                    <span className="font-medium">
                      First reminder at {shampooTime}, then every {shampooFrequency} hours
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary text-sm font-bold">i</span>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">
                Notification Settings
              </h4>
              <p className="text-sm text-muted-foreground">
                Make sure notifications are enabled in your device settings to receive reminders for your haircare routine.
              </p>
            </div>
          </div>
        </motion.div>
        {/* Add this after the info card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                <Bell className="h-4 w-4 text-accent" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">
                  Push Notifications
                </h4>
                <p className="text-sm text-muted-foreground">
                  Get notified even when the app is closed
                </p>
              </div>
            </div>
            {!pushEnabled ? (
              <Button
                onClick={enablePushNotifications}
                disabled={checkingPushStatus}
                size="sm"
                className="bg-accent hover:bg-accent/90"
              >
                {checkingPushStatus ? "Checking..." : "Enable"}
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-sm text-green-500">Enabled</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RemindersPage;
