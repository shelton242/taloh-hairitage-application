import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ReminderSettings {
  id: string;
  user_id: string;
  reminder_type: string;
  next_application_due: string;
  frequency_hours: number;
  enabled: boolean;
  last_notified_at: string | null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const now = new Date();
    const gracePeriodMinutes = 120;

    const { createClient } = await import("jsr:@supabase/supabase-js@2");
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: overdueReminders, error: fetchError } = await supabase
      .from("reminder_settings")
      .select("id, user_id, reminder_type, next_application_due, frequency_hours, enabled, last_notified_at")
      .eq("enabled", true)
      .not("next_application_due", "is", null);

    if (fetchError) {
      console.error("Error fetching reminders:", fetchError);
      throw fetchError;
    }

    if (!overdueReminders || overdueReminders.length === 0) {
      return new Response(
        JSON.stringify({
          message: "No active reminders found",
          checked: 0,
          notified: 0
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const notifications = [];

    for (const reminder of overdueReminders as ReminderSettings[]) {
      const dueTime = new Date(reminder.next_application_due);
      const minutesOverdue = (now.getTime() - dueTime.getTime()) / (1000 * 60);

      if (minutesOverdue < gracePeriodMinutes) {
        continue;
      }

      if (reminder.last_notified_at) {
        const lastNotified = new Date(reminder.last_notified_at);
        if (lastNotified >= dueTime) {
          continue;
        }
      }

      const hoursOverdue = Math.floor(minutesOverdue / 60);
      const title = "Missed Application Reminder";
      const body = hoursOverdue > 0
        ? `You missed your scheduled ${reminder.reminder_type} application (${hoursOverdue}h overdue). Apply now to keep your streak!`
        : `Your ${reminder.reminder_type} application is overdue. Apply now!`;

      const pushResponse = await fetch(`${supabaseUrl}/functions/v1/send-push`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({
          userId: reminder.user_id,
          title,
          body,
          data: {
            type: "missed_application",
            reminder_type: reminder.reminder_type,
          },
          url: "/home",
        }),
      });

      if (!pushResponse.ok) {
        console.error(
          `Failed to send notification to user ${reminder.user_id}:`,
          await pushResponse.text()
        );
      } else {
        await supabase
          .from("reminder_settings")
          .update({ last_notified_at: now.toISOString() })
          .eq("id", reminder.id);

        notifications.push({
          user_id: reminder.user_id,
          reminder_type: reminder.reminder_type,
          hours_overdue: hoursOverdue,
        });
      }
    }

    return new Response(
      JSON.stringify({
        message: "Checked for missed applications",
        checked: overdueReminders.length,
        notified: notifications.length,
        notifications,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.error("Error in check-missed-applications:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
