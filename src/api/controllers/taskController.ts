import { Response } from "express";
import mongoose from "mongoose";
import { IRequest } from "../shared/interfaces/IRequest";
import Task from "../shared/models/task";
import {
  taskParamsSchema,
  taskSchema,
  taskUpdateSchema,
} from "../shared/schema/zTaskSchema";
import { catchAsync } from "../utils/catchAsync";
import { sendDynamicEmail } from "../utils/emailHandler";

const formatTaskResponse = (task: any) => ({
  id: task.id,
  title: task.title,
  dueDateAndTime: task.dueDateAndTime,
  reminder: task.reminder || "",
  category: Array.isArray(task.category)
    ? task.category
    : task.category
      ? [task.category]
      : [],
  notes: task.notes || "",
  categoryColor: task.categoryColor || "",
  createdBy: task.createdBy,
});

const sendTaskShareEmails = async (req: IRequest, task: any) => {
  const recipients = Array.isArray(task.shareTaskWithColleagues)
    ? task.shareTaskWithColleagues.filter(Boolean)
    : [];

  if (!recipients.length) {
    return;
  }

  const senderName =
    req.user?.fullName ||
    [req.user?.firstName, req.user?.lastName].filter(Boolean).join(" ") ||
    req.user?.email ||
    "A Lock-Gate user";

  await Promise.allSettled(
    //@ts-ignore
    recipients.map((email) =>
      sendDynamicEmail({
        firstName: email.split("@")[0],
        email,
        subject: `${senderName} shared a task with you`,
        type: "TASK_SHARED",
        senderName,
        taskTitle: task.title,
        dueDateAndTime: task.dueDateAndTime,
        notes: task.notes,
      }),
    ),
  );
};

export const createTask = catchAsync(async (req: IRequest, res: Response) => {
  const userId = req.user?._id?.toString();
  const body = taskSchema.parse(req.body);

  const task = await Task.create({
    ...body,
    createdBy: userId,
  });

  if (body.shareTaskWithColleagues?.length) {
    void sendTaskShareEmails(req, task).catch((error) => {
      console.error("Task share email failed:", error.message);
    });
  }

  return res.status(201).json(formatTaskResponse(task));
});

export const getAllTasks = catchAsync(async (req: IRequest, res: Response) => {
  const userId = req.user?._id?.toString();

  const { date } = req.query; // expected format: YYYY-MM-DD

  let filter: any = {
    createdBy: userId,
  };

  if (date) {
    const startOfDay = new Date(date as string);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date as string);
    endOfDay.setHours(23, 59, 59, 999);

    filter.dueDateAndTime = {
      $gte: startOfDay,
      $lte: endOfDay,
    };
  }

  const tasks = await Task.find(filter).sort({ dueDateAndTime: -1 });

  return res.status(200).json(tasks.map(formatTaskResponse));
});

export const getTaskById = catchAsync(async (req: IRequest, res: Response) => {
  const userId = req.user?._id;
  const { taskId } = taskParamsSchema.parse(req.params);

  const task = await Task.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(taskId),
        createdBy: new mongoose.Types.ObjectId(userId),
      },
    },

    // 🔗 Lookup users by email
    {
      $lookup: {
        from: "users", // collection name
        let: { emails: "$shareTaskWithColleagues" },
        pipeline: [
          {
            $match: {
              $expr: { $in: ["$email", "$$emails"] },
            },
          },
          {
            $project: {
              email: 1,
              avatar: 1,
              fullName: { $concat: ["$firstName", " ", "$lastName"] },
            },
          },
        ],
        as: "sharedUsers",
      },
    },

    // ❌ Hide original email array
    {
      $project: {
        shareTaskWithColleagues: 0,
        __v: 0,
      },
    },
  ]);

  if (!task.length) {
    return res.status(404).json({ message: "Task not found" });
  }

  const formattedTask = {
    ...task[0],
    category: Array.isArray(task[0].category)
      ? task[0].category
      : task[0].category
        ? [task[0].category]
        : [],
  };

  return res.status(200).json(formattedTask);
});

export const updateTask = catchAsync(async (req: IRequest, res: Response) => {
  const userId = req.user?._id?.toString();
  const { taskId } = taskParamsSchema.parse(req.params);
  const body = taskUpdateSchema.parse(req.body);

  const task = await Task.findOneAndUpdate(
    { _id: taskId, createdBy: userId },
    { $set: body },
    { new: true },
  );

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (body.shareTaskWithColleagues?.length) {
    void sendTaskShareEmails(req, task).catch((error) => {
      console.error("Task share email failed:", error.message);
    });
  }

  return res.status(200).json(formatTaskResponse(task));
});

export const deleteTask = catchAsync(async (req: IRequest, res: Response) => {
  const userId = req.user?._id?.toString();
  const { taskId } = taskParamsSchema.parse(req.params);

  const task = await Task.findOneAndDelete({
    _id: taskId,
    createdBy: userId,
  });

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  return res.status(200).json({
    message: "Task deleted successfully",
  });
});
