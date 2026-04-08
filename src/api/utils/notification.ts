import { TargetScreen } from "../helpers/enums/notification";
import { ISetReminder } from "../shared/models/setReminder";

type ReminderEntityKey = "maintenanceItemId" | "eventId";

interface EntityConfig {
  idKey: ReminderEntityKey;
  targetScreen: TargetScreen;
}

// Map each entity type to its config
const ENTITY_CONFIG_MAP: EntityConfig[] = [
  { idKey: "maintenanceItemId", targetScreen: TargetScreen.SERVICE_DETAIL },
  { idKey: "eventId", targetScreen: TargetScreen.EVENT_DETAIL },
];

interface NotificationData {
  entityId: string;
  targetScreen: TargetScreen;
}

export const resolveNotificationData = (
  reminder: ISetReminder,
): NotificationData => {
  const matched = ENTITY_CONFIG_MAP.find((config) => !!reminder[config.idKey]);

  // fallback if no entity matches
  const targetScreen = matched?.targetScreen ?? TargetScreen.REMINDER_DETAIL;
   const entityId = matched
    ? (reminder[matched.idKey]?.toString() ?? "")
    : String(reminder._id);

  return {
    entityId,
    targetScreen,
  };
};
