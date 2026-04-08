import { User } from "../shared/models/auth";
import Boats from "../shared/models/boat";
import BoatInventory from "../shared/models/boatInventory";
import BoatProject from "../shared/models/boatProject";
import { CommunityNews } from "../shared/models/communityNews";
import ComplianceDocument from "../shared/models/complianceDocument";
import { Equipment } from "../shared/models/equipment";
import FuelWaterLogs from "../shared/models/fuelWaterLog";
import { ContactInquiry } from "../shared/models/inquiry";
import BoatTrip from "../shared/models/journey";
import MaintenanceItems from "../shared/models/maintenanceItem";
import { Marketplace } from "../shared/models/marketplace";
import { OrderSticker } from "../shared/models/orderSticker";
import { ServiceRequest } from "../shared/models/serviceJob";
import { SiteDetail } from "../shared/models/siteDetails";
import Survey from "../shared/models/survey";
import { UserDevice } from "../shared/models/userDevice";

export const resources = [
  "boats",
  "equipment",
  "marketplace",
  "fuelwaterlogs",
  "servicejobs",
  "boatinventory",
  "inquiry",
  "ordersticker",
  "journeys",
  "sitedetail",
  "surveys",
  "userdevice",
  "maintenanceitems",
  "communitynews",
  "user",

  "boatproject",
  "compliancedocuments",
] as const;

export type Resource = (typeof resources)[number];

export const modelRegistry: Record<Resource, any> = {
  boats: Boats,
  equipment: Equipment,
  marketplace: Marketplace,
  fuelwaterlogs: FuelWaterLogs,
  boatinventory: BoatInventory,
  inquiry: ContactInquiry,
  ordersticker: OrderSticker,
  journeys: BoatTrip,
  servicejobs: ServiceRequest,
  sitedetail: SiteDetail,
  surveys: Survey,
  userdevice: UserDevice,
  maintenanceitems: MaintenanceItems,
  communitynews: CommunityNews,
  user: User,

  boatproject: BoatProject,
  compliancedocuments: ComplianceDocument,
};
