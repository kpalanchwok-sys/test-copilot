import z from "zod";

export const addressSchema = z.object({
  lineOne: z.string().optional(),
  lineTwo: z.string().optional(),
  lineThree: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
});

export const userSchema = z.object({
  firstName: z.string({ message: "First name is required" }).min(1),
  lastName: z.string({ message: "Last name is required" }).min(1),

  dateOfBirth: z.coerce.date().optional(),

  email: z
    .string({ message: "Email is required" })
    .min(1)
    .email({ message: "Invalid email format" }),

  password: z
    .string({ message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),

  groups: z
    .array(
      z.enum([
        "Members",
        "organization",
        "internal",
        "governing-body",
        "local-governments",
        "lock-keepers",
        "commercial-partners",
        "service-providers",
        "non-boat",
      ]),
    )
    .default(["Members"]),

  contactNumber: z.string().optional(),

  address: addressSchema.optional(),

  otp: z.number().nullable().optional(),
  otpExpiry: z.coerce.date().nullable().optional(),
  isVerified: z.boolean().default(false),

  resetPasswordToken: z.string().optional(),
  resetPasswordExpires: z.coerce.date().optional(),
});


export const userUpdateSchema = userSchema.partial();

export const userParamsSchema = z.object({
  id: z
    .string({ message: "User ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId format" }),
});

export const verifyOtpSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email({ message: "Invalid email format" }),

  confirmationCode: z
    .union([
      z.string().min(1, { message: "Confirmation code is required" }),
      z.number(),
    ])
    .transform((val) => String(val)), // normalize to string
});

export const sendOtpSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email({ message: "Invalid email format" }),
});

export const loginSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email({ message: "Invalid email format" }),

  password: z
    .string({ message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
});
