import { Response } from "express";
import { sendReminderPushNotification } from "../helpers/sendReminderPushNotification";
import { getUserPushNotificationTokens } from "../services/refreshTokenService";
import { IRequest } from "../shared/interfaces/IRequest";
import { User } from "../shared/models/auth";
import SetReminder from "../shared/models/setReminder";
import {
  setReminderParamsSchema,
  setReminderSchema,
  setReminderUpdateSchema,
} from "../shared/schema/zSetReminderSchema";
import { catchAsync } from "../utils/catchAsync";

const formatSetReminderResponse = (setReminder: any) => ({
  id: setReminder.id,
  dueDate: setReminder.dueDate,
  setReminderBefore: setReminder.setReminderBefore || "",
  assignShareReminder: setReminder.assignShareReminder || "",
  assignShareReminderUserId: setReminder.assignShareReminderUserId || null,
  email: setReminder.email || [],
  maintenanceItemId: setReminder.maintenanceItemId,
  repeatSetting: setReminder.repeatSetting || "",
  createdBy: setReminder.createdBy,
});

const getEligibleRecipients = async (emails: string[]) => {
  const uniqueEmails = [...new Set(emails.map((item) => item.toLowerCase()))];

  const users = await User.find(
    { email: { $in: uniqueEmails } },
    { _id: 1, email: 1, firstName: 1 },
  );

  const eligibility = await Promise.all(
    users.map(async (user) => {
      const pushTokens = await getUserPushNotificationTokens(
        user._id.toString(),
      );
      return {
        user,
        hasPushToken: pushTokens.length > 0,
      };
    }),
  );

  return users; // skip push token filtering
};

const buildReminderPayload = async ({
  assignShareReminder,
  inputEmails,
  userId,
  userEmail,
}: {
  assignShareReminder?: string;
  inputEmails?: string[];
  userId: string;
  userEmail?: string;
}): Promise<{
  assignShareReminderUserId?: string;
  email?: string[] | undefined;
}> => {
  if (assignShareReminder === "myself") {
    return {
      assignShareReminderUserId: userId,
      email: userEmail ? [userEmail] : [],
    };
  }

  if (assignShareReminder === "other") {
    if (!inputEmails || inputEmails.length === 0) {
      throw new Error("Email is required when assignShareReminder is 'other'");
    }

    const recipients = await getEligibleRecipients(inputEmails);

    return {
      assignShareReminderUserId: undefined,
      email: recipients.map((recipient) => recipient.email),
    };
  }

  return {};
};

export const createSetReminder = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const userEmail = req.user?.email;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const body = setReminderSchema.parse(req.body);
    let reminderPayload = {};
    try {
      reminderPayload = await buildReminderPayload({
        assignShareReminder: body.assignShareReminder,
        inputEmails: body.email,
        userId,
        userEmail,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error?.message || "Invalid reminder recipient settings",
      });
    }

    const setReminder = await SetReminder.create({
      ...body,
      ...reminderPayload,
      createdBy: userId,
    });

    // for pushNotification
    const recipientUserIds: string[] = [];

    if (body.assignShareReminder === "myself") {
      recipientUserIds.push(userId);
    } else if (body.assignShareReminder === "other") {
      const recipients = await User.find(
        //@ts-ignore
        { email: { $in: reminderPayload.email || [] } },
        { _id: 1 },
      );
      recipients.forEach((r) => recipientUserIds.push(r._id.toString()));
    }

    if (recipientUserIds.length > 0) {
      sendReminderPushNotification({
        userIds: recipientUserIds,
        reminder: setReminder,
      }).catch((err) => console.error("Push notification error:", err));
    }

    return res.status(201).json(formatSetReminderResponse(setReminder));
  },
);

export const getAllSetReminders = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();

    const setReminders = await SetReminder.find({
      createdBy: userId,
    });

    return res.status(200).json(setReminders);
  },
);

export const getSetReminderById = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { setReminderId } = setReminderParamsSchema.parse(req.params);

    const setReminder = await SetReminder.findOne({
      _id: setReminderId,
      createdBy: userId,
    }).populate("maintenanceItemId");

    if (!setReminder) {
      return res.status(404).json({ message: "Set reminder not found" });
    }

    return res.status(200).json(formatSetReminderResponse(setReminder));
  },
);

export const updateSetReminder = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const userEmail = req.user?.email;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { setReminderId } = setReminderParamsSchema.parse(req.params);
    const body = setReminderUpdateSchema.parse(req.body);
    let reminderPayload = {};
    try {
      reminderPayload = await buildReminderPayload({
        assignShareReminder: body.assignShareReminder,
        inputEmails: body.email,
        userId,
        userEmail,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error?.message || "Invalid reminder recipient settings",
      });
    }

    const setReminder = await SetReminder.findOneAndUpdate(
      { _id: setReminderId, createdBy: userId },
      { $set: { ...body, ...reminderPayload } },
      { new: true },
    );

    if (!setReminder) {
      return res.status(404).json({ message: "Set reminder not found" });
    }

    //  Push Notification Logic
    const recipientUserIds: string[] = [];

    if (body.assignShareReminder === "myself") {
      recipientUserIds.push(userId);
    } else if (body.assignShareReminder === "other") {
      const recipients = await User.find(
        //@ts-ignore
        { email: { $in: reminderPayload.email || [] } },
        { _id: 1 },
      );

      recipients.forEach((r) => recipientUserIds.push(r._id.toString()));
    }

    if (recipientUserIds.length > 0) {
      sendReminderPushNotification({
        userIds: recipientUserIds,
        // maintenanceItemId: body.maintenanceItemId,
        reminder: setReminder,
      }).catch((err) => console.error("Push notification error:", err));
    }

    return res.status(200).json(formatSetReminderResponse(setReminder));
  },
);

export const deleteSetReminder = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { setReminderId } = setReminderParamsSchema.parse(req.params);

    const setReminder = await SetReminder.findOneAndDelete({
      _id: setReminderId,
      createdBy: userId,
    });

    if (!setReminder) {
      return res.status(404).json({ message: "Set reminder not found" });
    }

    return res.status(200).json({
      message: "Set reminder deleted successfully",
    });
  },
);
