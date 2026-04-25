// lib/reminderNotificationService.ts
import { supabase } from "@/lib/supabase";

class ReminderNotificationService {
  private static instance: ReminderNotificationService;
  private checkInterval: NodeJS.Timeout | null = null;

  static getInstance(): ReminderNotificationService {
    if (!ReminderNotificationService.instance) {
      ReminderNotificationService.instance = new ReminderNotificationService();
    }
    return ReminderNotificationService.instance;
  }

  startReminderCheck(userId: string) {
    // Check every minute for due reminders
    this.checkInterval = setInterval(() => {
      this.checkDueReminders(userId);
    }, 60000); // Every minute

    // Also check immediately
    this.checkDueReminders(userId);
  }

  stopReminderCheck() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  private async checkDueReminders(userId: string) {
    try {
      const now = new Date();
      
      // Get all enabled reminders that are due
      const { data: dueReminders, error } = await supabase
        .from('reminder_settings')
        .select('*')
        .eq('user_id', userId)
        .eq('enabled', true)
        .lte('next_application_due', now.toISOString())
        .gt('next_application_due', new Date(now.getTime() - 5 * 60000).toISOString()); // Within last 5 minutes

      if (error) throw error;

      for (const reminder of dueReminders || []) {
        await this.sendReminderNotification(userId, reminder);
        await this.updateNextDueTime(reminder);
      }
    } catch (error) {
      console.error('Error checking due reminders:', error);
    }
  }

  private async sendReminderNotification(userId: string, reminder: any) {
    const reminderType = reminder.reminder_type === 'solution' 
      ? 'Hair Revitalizing Solution' 
      : '3-in-1 Shampoo & Beard Wash';

    const notification = {
      user_id: userId,
      title: `⏰ ${reminderType} Reminder`,
      message: `Time to apply your ${reminderType.toLowerCase()}! Stay consistent for best results.`,
      type: 'system' as const,
      order_id: null,
      order_number: '',
      old_status: null,
      new_status: null,
      data: {
        reminder_type: reminder.reminder_type,
        reminder_id: reminder.id
      },
      action_url: '/', // Link to homepage
      is_read: false,
      read_at: null,
      created_at: new Date().toISOString()
    };

    // Insert notification into database
    const { error: insertError } = await supabase
      .from('notifications')
      .insert(notification);

    if (insertError) {
      console.error('Error creating reminder notification:', insertError);
    }
  }

  private async updateNextDueTime(reminder: any) {
    const nextDue = new Date();
    nextDue.setTime(nextDue.getTime() + (reminder.frequency_hours * 60 * 60 * 1000));

    const { error } = await supabase
      .from('reminder_settings')
      .update({
        next_application_due: nextDue.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', reminder.id);

    if (error) {
      console.error('Error updating next due time:', error);
    }
  }

  // Call this when user marks application as done
  async handleManualApplication(userId: string, reminderType: 'solution' | 'shampoo') {
    try {
      const { data: reminder } = await supabase
        .from('reminder_settings')
        .select('*')
        .eq('user_id', userId)
        .eq('reminder_type', reminderType)
        .maybeSingle();

      if (reminder) {
        await this.updateNextDueTime(reminder);
      }
    } catch (error) {
      console.error('Error updating reminder after manual application:', error);
    }
  }
}

export default ReminderNotificationService.getInstance();