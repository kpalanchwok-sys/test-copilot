import cron from "node-cron";
import { sendPushNotifications } from "../helpers/PushNotification";
import { User } from "../shared/models/auth";
import SetReminder, { ISetReminder } from "../shared/models/setReminder";
import { resolveNotificationData } from "../utils/notification";

let isReminderJobRunning = false;

const applyRepeat = (dueDate: Date, repeat?: string): Date => {
  const next = new Date(dueDate);
  if (repeat === "6 month") next.setMonth(next.getMonth() + 6);
  if (repeat === "12 month") next.setMonth(next.getMonth() + 12);
  return next;
};

const getUserPushTokens = (user: any): string[] => {
  if (Array.isArray(user?.pushTokens)) return user.pushTokens.filter(Boolean);
  if (Array.isArray(user?.expoPushTokens))
    return user.expoPushTokens.filter(Boolean);
  if (typeof user?.pushToken === "string" && user.pushToken.trim()) {
    return [user.pushToken.trim()];
  }
  return [];
};

const resolveRecipients = async (reminder: ISetReminder) => {
  if (reminder.assignShareReminder === "myself") {
    const userId = reminder.assignShareReminderUserId || reminder.createdBy;
    if (!userId) return [];
    const user = await User.findById(userId).lean();
    return user ? [user] : [];
  }

  if (reminder.assignShareReminder === "other") {
    if (!reminder.email?.length) return [];
    return User.find({ email: { $in: reminder.email } }).lean();
  }

  return [];
};

const processReminder = async (reminder: ISetReminder): Promise<void> => {
  const now = new Date();

  const users = await resolveRecipients(reminder);
  const tokens = users.flatMap((u) => getUserPushTokens(u));

  if (!tokens.length) {
    console.log(`[CRON] No tokens found for reminder ${reminder._id}`);
    return;
  }

  const notificationData = resolveNotificationData(reminder);
  await sendPushNotifications({
    tokens,
    title: "Maintenance Reminder",
    body: `Your reminder is scheduled for ${reminder.dueDate.toLocaleDateString()}`,
    data: { notificationData },
  });

  console.log(`[CRON] Notification sent for reminder ${reminder._id}`);

  reminder.lastReminderSentAt = now; //  Mark as sent

  // If repeat is set, push dueDate forward and reset lastReminderSentAt for next cycle
  if (reminder.repeatSetting) {
    reminder.dueDate = applyRepeat(reminder.dueDate, reminder.repeatSetting);
    reminder.lastReminderSentAt = undefined; // reset so next cycle is picked up
  }

  await reminder.save();
};

export const runSetReminderCron = async (): Promise<void> => {
  if (isReminderJobRunning) {
    console.log("[CRON] Reminder job already running, skipping...");
    return;
  }

  isReminderJobRunning = true;
  const now = new Date();

  try {
    const isProduction = process.env.ENV === "production";

    let reminders;

    if (isProduction) {
      // PRODUCTION: Use due date logic
      reminders = await SetReminder.find({
        lastReminderSentAt: null,
        assignShareReminder: { $in: ["myself", "other"] },
        $or: [
          // 1 week before due date
          {
            setReminderBefore: "1 week",
            dueDate: {
              $lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
              $gte: now,
            },
          },
          // 3 days before due date
          {
            setReminderBefore: "3 days",
            dueDate: {
              $lte: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
              $gte: now,
            },
          },
          // already due
          {
            dueDate: { $lte: now },
          },
        ],
      });
    } else {
      // DEVELOPMENT: Fire 2 minutes after reminder creation, ignore dueDate logic
      const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);

      reminders = await SetReminder.find({
        lastReminderSentAt: null,
        assignShareReminder: { $in: ["myself", "other"] },
        createdAt: { $lte: now, $gte: twoMinutesAgo },
      });
    }

    if (!reminders.length) {
      console.log("[CRON] No pending reminders found.");
      return;
    }

    console.log(`[CRON] Found ${reminders.length} pending reminders.`);

    for (const reminder of reminders) {
      try {
        await processReminder(reminder);
      } catch (error) {
        console.error("[CRON] Failed for reminder:", reminder._id, error);
      }
    }
  } finally {
    isReminderJobRunning = false;
  }
};

export const startSetReminderCron = (): void => {
  const isProduction = process.env.NODE_ENV === "production";

  // Run once on startup
  void runSetReminderCron();

  if (isProduction) {
    // PRODUCTION: Run every 30 minutes
    cron.schedule("*/30 * * * *", () => {
      void runSetReminderCron();
    });
  } else {
    // DEVELOPMENT: Run every 3 minute
    cron.schedule("*/3 * * * *", () => {
      void runSetReminderCron();
    });
  }
};
