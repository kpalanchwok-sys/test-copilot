import { Response } from "express";
import { IRequest } from "../shared/interfaces/IRequest";
import Survey from "../shared/models/survey";
import {
  surveyParamsSchema,
  surveySchema,
  surveyUpdateSchema,
} from "../shared/schema/zSurveySchema";
import { catchAsync } from "../utils/catchAsync";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHandler";

export const mapSurveyToResponse = (survey: any) => ({
  id: survey._id?.toString(),
  boatId: survey.boatId,
  name: survey.name,
  dueDate: survey.dueDate,
  lastDate: survey.lastDate ?? null,
  interval: survey.interval || "",
  surveyor: survey.surveyor || "",
  reminderDate: survey.reminderDate ?? null,
  location: survey.location || "",
  notes: survey.notes || "",
  links: survey.links || [],

  images: survey.images || [],
  videos: survey.videos || [],
  documents: survey.documents || [],

  createdAt: survey.createdAt,
  updatedAt: survey.updatedAt,
});

export const createSurvey = catchAsync(async (req: IRequest, res: Response) => {
  const userId = req.user?._id?.toString();
  const data = surveySchema.parse(req.body);

  // // Validation: lastDate <= dueDate
  // if (data.lastDate && data.lastDate > data.dueDate) {
  //   return sendErrorResponse({
  //     res,
  //     message: "lastDate cannot be after dueDate",
  //     code: 400,
  //   });
  // }

  // // Validation: reminderDate <= dueDate
  // if (data.reminderDate && data.reminderDate > data.dueDate) {
  //   return sendErrorResponse({
  //     res,
  //     message: "reminderDate cannot be after dueDate",
  //     code: 400,
  //   });
  // }

  const survey = await Survey.create(data);
  return res.status(200).json(mapSurveyToResponse(survey));
});

export const getAllSurveys = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const surveys = await Survey.find().sort({ dueDate: -1 });
    return res.status(200).json(surveys.map(mapSurveyToResponse));
  },
);

export const getSingleSurvey = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = surveyParamsSchema.parse(req.params);

    const survey = await Survey.findById(id);
    // .populate(
    // "boatId",
    // "boatName registrationNumber",
    // );

    if (!survey) {
      return sendErrorResponse({
        res,
        message: "Survey not found",
        code: 404,
      });
    }
    return res.status(200).json(mapSurveyToResponse(survey));
  },
);

export const updateSurvey = catchAsync(async (req: IRequest, res: Response) => {
  const userId = req.user?._id?.toString();
  const { id } = surveyParamsSchema.parse(req.params);
  const data = surveyUpdateSchema.parse(req.body);

  const survey = await Survey.findById(id);
  if (!survey) {
    return sendErrorResponse({ res, message: "Survey not found", code: 404 });
  }

  // // Date validations
  // const dueDate = data.dueDate ?? survey.dueDate;

  // if (data.lastDate && data.lastDate > dueDate) {
  //   return sendErrorResponse({
  //     res,
  //     message: "lastDate cannot be after dueDate",
  //     code: 400,
  //   });
  // }

  // if (data.reminderDate && data.reminderDate > dueDate) {
  //   return sendErrorResponse({
  //     res,
  //     message: "reminderDate cannot be after dueDate",
  //     code: 400,
  //   });
  // }

  Object.assign(survey, data);
  await survey.save();
  return res.status(200).json(mapSurveyToResponse(survey));
});

export const deleteSurvey = catchAsync(async (req: IRequest, res: Response) => {
  const userId = req.user?._id?.toString();
  const { id } = surveyParamsSchema.parse(req.params);

  const survey = await Survey.findByIdAndDelete(id);

  if (!survey) {
    return sendErrorResponse({ res, message: "Survey not found", code: 404 });
  }

  sendSuccessResponse({
    res,
    data: {},
    message: "Survey deleted successfully",
  });
});
