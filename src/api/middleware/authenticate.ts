import { type NextFunction, type Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import config from "../config";
import { IRequest } from "../shared/interfaces/IRequest";
import { User } from "../shared/models/auth";
import { AppError } from "../utils/AppError";

export type UserGroup =
  | "Members"
  | "organization"
  | "internal"
  | "governing-body"
  | "local-governments"
  | "lock-keepers"
  | "commercial-partners"
  | "service-providers"
  | "non-boat";

type DecodedToken = {
  _id: string;
  group: UserGroup;
  iat: number;
  exp: number;
};

const verifyToken = (token: string, secret: string): Promise<DecodedToken> =>
  new Promise((resolve, reject) =>
    jwt.verify(token, secret, (err, decoded) =>
      err ? reject(err) : resolve(decoded as DecodedToken),
    ),
  );

export const authenticate = (
  allowedGroups: UserGroup[] = [
    "Members",
    "organization",
    "internal",
    "governing-body",
    "local-governments",
    "lock-keepers",
    "commercial-partners",
    "service-providers",
    "non-boat",
  ],
  allowGuests = false,
) => {
  return async (req: IRequest, _res: Response, next: NextFunction) => {
    try {
      console.log(`\n[AUTH] ${req.method} ${req.originalUrl}`);

      const authHeader = req.headers.authorization;

      const token = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : undefined;

      if (!token) {
        if (allowGuests) {
          req.user = undefined;
          return next();
        }
        throw new AppError(
          StatusCodes.UNAUTHORIZED,
          "You are not logged in! Please log in to get access.",
        );
      }

      //  Verify token
      let decoded: DecodedToken;
      try {
        decoded = await verifyToken(token, config.JWT_SECRET_KEY);
      } catch (err) {
        throw new AppError(
          StatusCodes.UNAUTHORIZED,
          "Invalid or expired token.",
        );
      }

      if (!allowedGroups.includes(decoded.group)) {
        throw new AppError(StatusCodes.FORBIDDEN, "Permission denied.");
      }

      //  Load user and validate group matches DB
      // console.log(`[AUTH] Looking up user in DB with _id: ${decoded._id}`);
      const currentUser = await User.findById(decoded._id);

      if (!currentUser) {
        throw new AppError(
          StatusCodes.UNAUTHORIZED,
          "The account belonging to this token no longer exists.",
        );
      }

      // Guard against group being changed in DB after token was issued
      // @ts-ignore
      if (!currentUser.groups.includes(decoded.group)) {
        throw new AppError(
          StatusCodes.UNAUTHORIZED,
          "Your access group has changed. Please log in again.",
        );
      }

      // Attach user and continue
      req.user = currentUser;
      next();
    } catch (error) {
      console.log(`[AUTH] ❌ Authentication error:`, error);
      next(error);
    }
  };
};
