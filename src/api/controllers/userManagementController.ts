import { Request, Response } from "express";
import { User } from "../shared/models/auth";
import UserManagement from "../shared/models/userManagement";
import {
  userManagementParamsSchema,
  userManagementSchema,
  userManagementUpdateSchema,
} from "../shared/schema/zUserManagementSchema";
import { catchAsync } from "../utils/catchAsync";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHandler";

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const data = userManagementSchema.parse(req.body);

  const existing = await UserManagement.findOne({ email: data.email });
  if (existing) {
    return sendErrorResponse({
      res,
      message: "Email already exists",
      code: 400,
    });
  }

  const user = await UserManagement.create(data);

  sendSuccessResponse({ res, data: user });
});

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const members = await UserManagement.find().sort({ createdAt: -1 });
  sendSuccessResponse({ res, data: members });
});

export const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = userManagementParamsSchema.parse(req.params);

  const user = await User.findById(id);

  if (!user) {
    return sendErrorResponse({ res, message: "User not found", code: 404 });
  }

  const {
    _id,
    email,
    firstName,
    lastName,
    avatar,
    coverImg,
    contactNumber,
    dateOfBirth,
    address,
    groups,
    governingBody,
  } = user.toObject();

  return res.status(200).json({
    userId: _id.toString(),
    email,
    firstName,
    lastName,
    avatar,
    coverImg,
    contactNumber,
    dateOfBirth,
    groups,
    governingBody,
    address: address || {
      lineOne: "",
      lineTwo: "",
      lineThree: "",
      city: "",
      postCode: "",
      county: "",
      country: "",
    },
  });
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = userManagementParamsSchema.parse(req.params);
  const data = userManagementUpdateSchema.parse(req.body);

  const user = await UserManagement.findById(id);
  if (!user) {
    return sendErrorResponse({ res, message: "User not found", code: 404 });
  }

  // Prevent duplicate email update
  if (data.email) {
    const existing = await UserManagement.findOne({
      email: data.email,
      _id: { $ne: id },
    });

    if (existing) {
      return sendErrorResponse({
        res,
        message: "Another user already uses this email",
        code: 400,
      });
    }
  }

  Object.assign(user, data);
  await user.save();

  sendSuccessResponse({ res, data: user });
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = userManagementParamsSchema.parse(req.params);

  const user = await UserManagement.findByIdAndDelete(id);

  if (!user) {
    return sendErrorResponse({ res, message: "User not found", code: 404 });
  }

  sendSuccessResponse({
    res,
    data: {},
    message: "User deleted successfully",
  });
});
