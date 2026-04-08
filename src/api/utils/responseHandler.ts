/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Response } from "express";
import { StatusCodes } from "http-status-codes";

type Codes = 400 | 401 | 403 | 404 | 409 | 500;

const messages = {
  400: "Malformed or illegal request.",
  401: "Your session expired. Login again.",
  403: "You don't have permission for requested resource.",
  404: "Requested resource not found.",
  409: "Conflict: resource already exists or is in an invalid state.",
  500: "Sorry, something went wrong.",
};

type ErrorProps = {
  code: Codes;
  res: Response;
  message?: string;
  err?: { message: string } | any;
  flag?: string;
};

type SuccessProps = {
  data: any | any[];
  res: Response;
  totalCount?: number;
  status?: StatusCodes;
  [key: string]: any;
  message?: string;
};

export function sendSuccessResponse({
  data,
  res,
  message,
  totalCount,
  status = StatusCodes.OK,
}: SuccessProps): Response {
  const response = {
    status: "success",
    totalCount,
    data,
    message,
  };

  return res.status(status).json(response);
}

export function sendErrorResponse({
  err,
  code,
  message,
  res,
  flag,
}: ErrorProps): Response {
  // logger.error(err?.message || message);
  console.error(err?.message || message);
  return res.status(code || 500).json({
    status: "error",
    message: message ?? err?.message ?? messages[code],
    flag,
  });
}
