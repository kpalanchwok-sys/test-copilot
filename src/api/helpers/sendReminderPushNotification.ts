import { getUserPushNotificationTokens } from "../services/refreshTokenService";
import { ISetReminder } from "../shared/models/setReminder";
import { resolveNotificationData } from "../utils/notification";
import { sendPushNotifications } from "./PushNotification";

export const sendReminderPushNotification = async ({
  userIds,
  reminder,
}: {
  userIds: string[];
  reminder: ISetReminder;
}) => {
  const { entityId, targetScreen } = resolveNotificationData(reminder);

  await Promise.all(
    userIds.map(async (userId) => {
      const rawTokens = await getUserPushNotificationTokens(userId);

      const tokens = rawTokens.filter((t): t is string => Boolean(t));
      if (!tokens.length) return;

      await sendPushNotifications({
        tokens,
        title: "Maintenance Reminder",
        body: "You have a maintenance item due. Tap to view details.",
        data: {
          resourceId: entityId,
          targetScreen,
        },
      });
    }),
  );
};
