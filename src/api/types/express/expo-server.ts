declare module "expo-server-sdk" {
  export class Expo {
    constructor(options?: any);
    static isExpoPushToken(token: string): boolean;

    sendPushNotificationsAsync(messages: any[]): Promise<any>;
    chunkPushNotifications(messages: any[]): any[];

    getPushNotificationReceiptsAsync(receiptIds: string[]): Promise<any>;
    chunkPushNotificationReceiptIds(receiptIds: string[]): any[];
  }
}
