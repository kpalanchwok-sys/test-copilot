import EventManagement from "../shared/models/eventManagement";
import { AppError } from "../utils/AppError";

export const deleteEventService = async (userId: string, eventId: string) => {
  try {
    if (!userId || !eventId) {
      throw new AppError(400, "User ID and Event ID are required");
    }

    const event = await EventManagement.findById(eventId);

    if (!event) {
      throw new AppError(404, "Event not found");
    }

    if (event.createdBy?.toString() !== userId) {
      throw new AppError(403, "You are not authorized to delete this event");
    }

    event.deletedAt = new Date();
    await event.save();

    return { message: "Event deleted successfully" };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(500, "Internal server error");
  }
};
