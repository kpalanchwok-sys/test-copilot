import { Request, Response } from "express";
import BoatTrip from "../shared/models/journey";
import {
  boatTripParamsSchema,
  boatTripUpdateSchema,
} from "../shared/schema/zJourneySchema";
import { catchAsync } from "../utils/catchAsync";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHandler";

const mapBoatTripToResponse = (trip: any) => ({
  id: trip._id?.toString(),
  boatId: trip.boatId?.toString(),
  startType: trip.startType || "",
  tripName: trip.tripName || "",
  startDate: trip.startDate?.toISOString(),
  endDate: trip.endDate?.toISOString() || null,
  baseBerth: trip.baseBerth || "",
  autoEnd: trip.autoEnd,
  note: trip.note || "",
  crewEmails: trip.crewEmails || [],
  waypoints: trip.waypoints || [],
  images: trip.images || [],
  videos: trip.videos || [],
  documents: trip.documents || [],
  youTubeUrl: trip.youTubeUrl || [],
  status: trip.status,
  createdAt: trip.createdAt?.toISOString(),
  updatedAt: trip.updatedAt?.toISOString(),
});

export const createJourney = catchAsync(async (req: Request, res: Response) => {
  const data = boatTripUpdateSchema.parse(req.body);

  const trip = await BoatTrip.create(data);
  return res.status(201).json(mapBoatTripToResponse(trip));
});

export const updateJourney = catchAsync(async (req: Request, res: Response) => {
  const { id } = boatTripParamsSchema.parse(req.params);
  const data = boatTripUpdateSchema.parse(req.body);

  const trip = await BoatTrip.findById(id);
  if (!trip) return res.status(404).json({ message: "BoatTrip not found" });

  Object.assign(trip, data);
  await trip.save();

  return res.status(200).json(mapBoatTripToResponse(trip));
});

export const getAllJourney = catchAsync(async (req: Request, res: Response) => {
  const trips = await BoatTrip.find().sort({ startDate: -1 });
  return res.status(200).json(trips.map(mapBoatTripToResponse));
});

export const getSingleJourney = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const trip = await BoatTrip.findById(id);
    if (!trip) return res.status(404).json({ message: "BoatTrip not found" });

    return res.status(200).json(mapBoatTripToResponse(trip));
  },
);

export const deleteJourney = catchAsync(async (req: Request, res: Response) => {
  const { id } = boatTripParamsSchema.parse(req.params);
  const trip = await BoatTrip.findByIdAndDelete(id);
  if (!trip)
    return sendErrorResponse({ res, message: "Trip not found", code: 404 });

  sendSuccessResponse({
    res,
    data: {},
    message: "Boat trip deleted successfully",
  });
});

export const wayPointJourney = catchAsync(
  async (req: Request, res: Response) => {
    const trip = await BoatTrip.findById(req.params.id);

    if (!trip) {
      return sendErrorResponse({
        res,
        message: "Trip not found",
        code: 404,
      });
    }

    trip.status = "completed";
    trip.endDate = new Date();

    await trip.save();

    sendSuccessResponse({ res, data: trip });
  },
);
