import { Request } from "express";
import { IUser } from "../models/auth";
export interface IRequest extends Request {
  userRole?:
    | "Members"
    | "organization"
    | "internal"
    | "governing-body"
    | "local-governments"
    | "lock-keepers"
    | "commercial-partners"
    | "service-providers"
    | "non-boat";
  user?: IUser | null;
}
