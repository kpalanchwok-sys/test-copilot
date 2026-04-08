import { z } from "zod";
export const resources = [
  "boats",
  "marketplace",
  "equipment",
  "servicejobs",
  "boatinventory",
  "fuelwaterlogs",
  "inquiry",
  "ordersticker",
  "journeys",
  "sitedetail",
  "surveys",
  "userdevice",
  "maintenanceitems",
  "communitynews",
  "user",
  // "userDeviceManagement",
  // //  "userManagement",
  // "waterAlerts",

  "boatproject",
  "compliancedocuments",
] as const;

export const resourceParamSchema = z.object({
  resource: z.enum(resources),
  id: z.string().regex(/^[0-9a-fA-F]{24}$/),
});
