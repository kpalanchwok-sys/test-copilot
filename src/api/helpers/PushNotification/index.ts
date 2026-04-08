import { Expo } from "expo-server-sdk";

const expo = new Expo({});

type ExpoPushMessage = {
  to: string;
  sound?: "default" | null;
  body?: string;
  title?: string;
  subtitle?: string;
  data?: Record<string, unknown>;
  channelId?: string;
};


type PushNotificationInput = {
  tokens: string[];
  title: string;
  body: string;
  data?: Record<string, unknown>;
  subtitle?: string;
};

export const sendPushNotifications = async ({
  tokens,
  title,
  body,
  data = {},
  subtitle,
}: PushNotificationInput): Promise<void> => {
  try {
    const messages: ExpoPushMessage[] = [];

    for (const token of tokens) {
      if (!Expo.isExpoPushToken(token)) {
        console.error(`Invalid Expo push token: ${token}`);
        continue;
      }

      messages.push({
        to: token,
        sound: "default",
        title,
        body,
        subtitle,
        data,
        channelId: "default",
      });
    }

    if (!messages.length) return;

    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (const chunk of chunks) {
      try {
        const result = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...result);
      } catch (err) {
        console.error("Push send error:", err);
      }
    }

    await handleReceipts(tickets);
  } catch (err) {
    console.error("Error in sendPushNotifications:", err);
  }
};

const handleReceipts = async (tickets: any[]) => {
  const receiptIds = tickets
    .filter((t) => t.status === "ok" && t.id)
    .map((t) => t.id as string);

  if (!receiptIds.length) return;

  const chunks = expo.chunkPushNotificationReceiptIds(receiptIds);

  for (const chunk of chunks) {
    try {
      const receipts = await expo.getPushNotificationReceiptsAsync(chunk);

      for (const receiptId in receipts) {
        const receipt = receipts[receiptId];

        if (receipt.status === "error") {
          console.error("Push receipt error:", receipt);
        }
      }
    } catch (err) {
      console.error("Receipt fetch error:", err);
    }
  }
};
