import AWS from "aws-sdk";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import { IUser, User } from "../shared/models/auth";
import {
  loginSchema,
  sendOtpSchema,
  userSchema,
  verifyOtpSchema,
} from "../shared/schema/zAuthSchema";
import { resourceParamSchema } from "../shared/schema/zgetPresignedUrlsSchema";
import { generateSixDigitOtp } from "../utils";
import { AppError } from "../utils/AppError";
import { modelRegistry } from "../utils/awsModelRegistry";
import { catchAsync } from "../utils/catchAsync";
import { sendDynamicEmail } from "../utils/emailHandler";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHandler";

export const s3 = new AWS.S3({
  accessKeyId: config.AWS.ACCESS_KEY_ID,
  secretAccessKey: config.AWS.ACCESS_KEY,
  region: config.AWS.REGION,
});

export const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = userSchema.safeParse(req.body);

  if (!result.success) {
    throw result.error;
  }

  const { email, firstName, lastName, password, ...rest } = result.data;

  const existing = await User.findOne({ email });
  if (existing) {
    return sendErrorResponse({
      res,
      message: "Email already registered",
      code: 400,
    });
  }

  const otp = generateSixDigitOtp();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const user = await User.create({
    email,
    firstName,
    lastName,
    password,
    otp,
    otpExpiry,
    ...rest,
  });

  sendDynamicEmail({
    firstName: user.firstName,
    email: user.email,
    subject: "Welcome to Lock-Gate 🎉",
    type: "WELCOME",
    otp,
  });

  sendSuccessResponse({
    res,
    data: user,
  });
});

export const verifyOtp = catchAsync(async (req: Request, res: Response) => {
  const result = verifyOtpSchema.safeParse(req.body);

  if (!result.success) {
    throw result.error;
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return sendErrorResponse({
      res,
      message: "User not found",
      code: 404,
    });
  }

  if (user.isVerified) {
    return sendErrorResponse({
      res,
      message: "Email already verified",
      code: 400,
    });
  }

  if (String(user.otp) !== String(req.body.confirmationCode)) {
    return sendErrorResponse({
      res,
      message: "Invalid confirmation code",
      code: 400,
    });
  }

  if (!user.otpExpiry || new Date() > new Date(user.otpExpiry)) {
    return sendErrorResponse({
      res,
      message: "Confirmation code has expired, please register again",
      code: 400,
    });
  }

  user.isVerified = true;
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  sendSuccessResponse({
    res,
    message: "Email verified successfully",
    data: user,
  });
});

export const resendOtp = catchAsync(async (req: Request, res: Response) => {
  const result = sendOtpSchema.safeParse(req.body);

  if (!result.success) {
    throw result.error;
  }

  const { email } = result.data;

  const user = await User.findOne({ email });

  if (!user) {
    return sendErrorResponse({
      res,
      message: "User not found",
      code: 404,
    });
  }

  const otp = generateSixDigitOtp();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  user.otp = otp;
  user.otpExpiry = otpExpiry;

  await user.save();

  sendDynamicEmail({
    firstName: user.firstName,
    email: user.email,
    subject: "Your new OTP - Lock-Gate 🔐",
    type: "VERIFY_EMAIL",
    otp,
  })
    .then(() => console.log(" OTP resent to:", user.email))
    .catch((err) =>
      console.error("❌ Email failed (non-blocking):", err.message),
    );

  return sendSuccessResponse({
    res,
    message: "OTP resent successfully",
    data: null,
  });
});

export const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    throw result.error;
  }

  const { email, password } = result.data;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return sendErrorResponse({
      res,
      message: "Invalid email or password",
      code: 401,
    });
  }

  if (!user.isVerified) {
    return sendErrorResponse({
      res,
      message: "Please verify your email before logging in",
      code: 403,
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return sendErrorResponse({
      res,
      message: "Invalid email or password",
      code: 401,
    });
  }

  const refreshToken = user.generateRefreshToken();
  const accessToken = user.generateAccessToken();
  user.refreshToken = refreshToken;
  await user.save();

  const { _id, password: _, ...rest } = user.toObject();

  return res.status(200).json({
    message: "Login successful",
    userDetails: { userId: _id, ...rest },
    refreshToken,
    accessToken,
  });
});

export const forgotPassword = catchAsync(
  async (req: Request, res: Response) => {
    const result = sendOtpSchema.safeParse(req.body);

    if (!result.success) {
      throw result.error;
    }

    const { email } = result.data;

    const user = await User.findOne({ email });
    if (!user) {
      return sendErrorResponse({
        res,
        message: "User not found",
        code: 404,
      });
    }

    const otp = generateSixDigitOtp();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await User.updateOne({ email }, { $set: { otp, otpExpiry } });

    sendDynamicEmail({
      firstName: user.firstName,
      email: user.email,
      subject: "Password Reset Code - Lock-Gate 🔐",
      type: "RESET_PASSWORD",
      otp,
    })
      .then(() => console.log(" Reset OTP sent to:", user.email))
      .catch((err) =>
        console.error("❌ Email failed (non-blocking):", err.message),
      );

    sendSuccessResponse({
      res,
      message: "Password reset code sent to your email",
      data: null,
    });
  },
);

export const confirmForgetPassword = catchAsync(
  async (req: Request, res: Response) => {
    const { email, password, confirmationCode } = req.body;
    console.log("🚀 ~ req.body:", req.body);

    if (!email || !password || !confirmationCode) {
      return sendErrorResponse({
        res,
        message: "Email, new password and confirmation code are required",
        code: 400,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return sendErrorResponse({
        res,
        message: "User not found",
        code: 404,
      });
    }

    // Check if verified
    // if (!user.isVerified) {
    //   return sendErrorResponse({
    //     res,
    //     message: "Email not verified, please verify your email first",
    //     code: 403,
    //   });
    // }

    // Check OTP match
    if (String(user.otp) !== String(confirmationCode)) {
      return sendErrorResponse({
        res,
        message: "Invalid confirmation code",
        code: 400,
      });
    }

    if (!user.otpExpiry || new Date() > new Date(user.otpExpiry)) {
      return sendErrorResponse({
        res,
        message: "Confirmation code has expired",
        code: 400,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.updateOne(
      { email },
      { $set: { password: hashedPassword, otp: null, otpExpiry: null } },
    );

    sendSuccessResponse({
      res,
      message: "Password reset successful",
      data: null, // ← don't auto-login after reset; force the user to log in fresh
    });
  },
);

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email, password, oldPassword } = req.body;

  if (!email || !password || !oldPassword) {
    return sendErrorResponse({
      res,
      message: "Email, old password and new password are required",
      code: 400,
    });
  }

  if (password.length < 8) {
    return sendErrorResponse({
      res,
      message: "New password must be at least 8 characters",
      code: 400,
    });
  }

  if (oldPassword === password) {
    return sendErrorResponse({
      res,
      message: "New password must be different from old password",
      code: 400,
    });
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return sendErrorResponse({
      res,
      message: "User not found",
      code: 404,
    });
  }

  const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isOldPasswordValid) {
    return sendErrorResponse({
      res,
      message: "Old password is incorrect",
      code: 401,
    });
  }

  user.password = password;
  await user.save();

  sendDynamicEmail({
    firstName: user.firstName,
    email: user.email,
    subject: "Password Changed - Lock-Gate 🔐",
    type: "RESET_PASSWORD",
    otp: undefined,
  })
    .then(() => console.log(" Password change email sent to:", user.email))
    .catch((err) =>
      console.error("❌ Email failed (non-blocking):", err.message),
    );

  sendSuccessResponse({
    res,
    message: "Password changed successfully",
    data: null,
  });
});

// export const updateProfile = catchAsync(async (req: Request, res: Response) => {
//   const user = await User.findById(req.user._id);

//   if (!user) {
//     return sendErrorResponse({ res, message: "User not found", code: 404 });
//   }

//   Object.assign(user, req.body);
//   await user.save();

//   sendSuccessResponse({ res, data: user });
// });

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  //   await User.findByIdAndDelete(req.user._id);

  sendSuccessResponse({
    data: {},
    res,
    message: "User deleted successfully",
  });
});

export const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { email, refreshToken } = req.body;

  if (!email || !refreshToken) {
    return sendErrorResponse({
      res,
      message: "Email and refreshToken are required",
      code: 400,
    });
  }

  // Verify token
  let decoded: any;
  try {
    decoded = jwt.verify(refreshToken, config.JWT_SECRET_KEY);
  } catch (err) {
    return sendErrorResponse({
      res,
      message: "Invalid or expired refresh token",
      code: 401,
    });
  }

  //  Get user WITH refreshToken
  const user = await User.findOne({ email }).select("+refreshToken");

  if (!user) {
    return sendErrorResponse({
      res,
      message: "User not found",
      code: 404,
    });
  }

  //  Validate token match (important)
  if (user.refreshToken !== refreshToken) {
    return sendErrorResponse({
      res,
      message: "Refresh token mismatch",
      code: 401,
    });
  }

  //  Generate new tokens using model methods
  const newAccessToken = user.generateAccessToken();
  const newRefreshToken = user.generateRefreshToken();

  //  Rotate refresh token
  user.refreshToken = newRefreshToken;
  await user.save();

  const response = {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    // expiresIn: "1d", //or 86400 seconds = 24 hours = 1 day
    // requiresNewPassword: false,
    // newPasswordSession: null,
    // userDetails: {
    //   userId: user._id,
    //   avatar: user.avatar || "",
    //   groups: user.groups || ["Members"],
    //   email: user.email,
    //   firstName: user.firstName,
    //   lastName: user.lastName,
    //   contactNumber: user.contactNumber,
    //   dateOfBirth: user.dateOfBirth,
    //   // createdAt: user.createdAt,
    //   status: user.isVerified ? "Active" : "Inactive",

    //   address: {
    //     lineOne: user.address?.lineOne || "",
    //     lineTwo: user.address?.lineTwo || "",
    //     lineThree: user.address?.lineThree || "",
    //     city: user.address?.city || "",
    //     postCode: user.address?.postCode || "",
    //     county: user.address?.county || "",
    //     country: user.address?.country || "",
    //   },

    //   failedLoginAttempts: 0,
    //   lastFailedLogin: null,
    //   governingBody: user.governingBody,

    //   deviceTokens: [], // not implemented yet
    // },
  };

  return res.status(200).json(response);
});

// GET /lookup/:email
export const lookupUserByEmail = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.params;

    if (!email) {
      return sendErrorResponse({
        res,
        message: "Email parameter is required",
        code: 400,
      });
    }

    const user = (await User.findOne({ email })
      .select("_id groups")
      .exec()) as IUser | null;

    if (!user) {
      return sendErrorResponse({
        res,
        message: "User not found",
        code: 404,
      });
    }

    sendSuccessResponse({
      res,
      message: "User found",
      data: {
        userId: user._id.toString(),
        userGroups: user.groups || [],
      },
    });
  },
);

// // avatar
export const uploadAvatar = catchAsync(async (req: Request, res: Response) => {
  const normalizedParams = {
    ...req.params,
    resource: (req.params.resource as string).toLowerCase(),
  };

  const { resource, id } = resourceParamSchema.parse(normalizedParams);

  const avatarFile = (req.files as any)?.avatar?.[0] || null;

  const coverFile = (req.files as any)?.coverImage?.[0] || null;

  if (!avatarFile && !coverFile) {
    throw new AppError(400, "Image file is required");
  }

  const imageMimeRegex = /^image\/.+$/;

  const validateFile = (file: any, label: string) => {
    if (!imageMimeRegex.test(file.mimetype)) {
      throw new AppError(400, `Only image files are allowed for ${label}`);
    }

    if (!file.buffer || file.buffer.length === 0) {
      throw new AppError(400, `Invalid ${label} file`);
    }
  };

  if (avatarFile) validateFile(avatarFile, "avatar");
  if (coverFile) validateFile(coverFile, "coverImage");

  const Model = modelRegistry[resource];
  if (!Model) {
    throw new AppError(404, `Resource '${resource}' not found`);
  }

  const doc = await Model.findById(id).orFail(
    new AppError(404, `${resource} not found`),
  );

  const uploadToS3 = async (file: any, folder: string) => {
    const extension = file.mimetype.split("/")[1];
    const key = `${resource}/${id}/${folder}/${folder}-${Date.now()}.${extension}`;

    await s3
      .putObject({
        Bucket: config.AWS.PUBLIC_BUCKET_NAME as string,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read",
      })
      .promise();

    return {
      key,
      url: `https://${config.AWS.PUBLIC_BUCKET_NAME}.s3.${config.AWS.REGION}.amazonaws.com/${key}`,
    };
  };

  // AVATAR
  if (avatarFile) {
    const oldKey = doc.avatar?.split(".amazonaws.com/")[1] ?? null;

    const uploaded = await uploadToS3(avatarFile, "avatar");

    doc.avatar = uploaded.url;

    if (oldKey) {
      await s3
        .deleteObject({
          Bucket: config.AWS.PUBLIC_BUCKET_NAME as string,
          Key: oldKey,
        })
        .promise();
    }
  }

  // COVER IMAGE
  if (coverFile) {
    const oldKey = doc.coverImg?.split(".amazonaws.com/")[1] ?? null;

    const uploaded = await uploadToS3(coverFile, "cover");

    doc.coverImg = uploaded.url;

    if (oldKey) {
      await s3
        .deleteObject({
          Bucket: config.AWS.PUBLIC_BUCKET_NAME as string,
          Key: oldKey,
        })
        .promise();
    }
  }

  await doc.save();

  return res.status(200).json({
    message: "Images uploaded successfully",
    avatar: doc.avatar,
    coverImg: doc.coverImg,
  });
});

export const deleteAvatar = catchAsync(async (req: Request, res: Response) => {
  const normalizedParams = {
    ...req.params,
    resource: (req.params.resource as string).toLowerCase(),
  };
  const { resource, id } = resourceParamSchema.parse(normalizedParams);

  const Model = modelRegistry[resource];
  if (!Model) {
    throw new AppError(404, `Resource '${resource}' not found`);
  }

  const entity = await Model.findByIdAndUpdate(
    id,
    { $unset: { avatar: "" } },
    { new: true },
  );

  if (!entity) {
    return sendErrorResponse({
      res,
      message: `${resource} not found`,
      code: 404,
    });
  }

  return sendSuccessResponse({
    res,
    message: "Avatar removed successfully",
    data: { id },
  });
});
