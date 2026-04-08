import { type Request } from "express";

//@ts-ignore
export const getClientIp = (req) => {
  // The 'x-forwarded-for' header is used when the server is behind a proxy
  const forwardedFor = req.headers["x-forwarded-for"];
  if (forwardedFor) {
    // The client's IP is the first one in the list
    return forwardedFor.split(",")[0].trim();
  }
  // If not behind a proxy, use the remote address
  return (
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null)
  );
};

export function getClientDeviceId(req: Request): string | undefined {
  const deviceId = req.headers["x-device-id"];
  return typeof deviceId === "string" ? deviceId : deviceId?.[0];
}

export function getClientUserAgent(req: Request): string {
  const userAgent = req.headers["user-agent"];
  return userAgent || "Unknown";
}
