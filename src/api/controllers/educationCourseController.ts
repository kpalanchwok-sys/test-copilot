import { Response } from "express";
import { IRequest } from "../shared/interfaces/IRequest";
import { Course } from "../shared/models/educationCourses";
import {
  courseParamsSchema,
  courseSchema,
  courseUpdateSchema,
} from "../shared/schema/zEducationCoursesSchema";
import { catchAsync } from "../utils/catchAsync";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHandler";

const mapCourseToResponse = (course: any) => ({
  id: course._id?.toString(),

  courseTitle: course.courseTitle,
  institute: course.institute || "",
  dateRange: course.dateRange || "",

  fee: course.fee ?? 0,
  rating: course.rating ?? 0,

  location: course.location || "",
  googleLocation: course.googleLocation || "",

  duration: course.duration || "",
  time: course.time || "",

  seats: course.seats ?? 0,
  availability: course.availability || "available",

  includes: course.includes || "",
  note: course.note || "",
  description: course.description || "",

  instructorName: course.instructorName || "",
  instructorDescription: course.instructorDescription || "",

  createdAt: course.createdAt,
  updatedAt: course.updatedAt,
});

export const createCourse = catchAsync(async (req: IRequest, res: Response) => {
  const userId = req.user?._id?.toString();
  const result = courseSchema.safeParse(req.body);

  if (!result.success) {
    throw result.error;
  }

  const course = await Course.create(result.data);

  return res.status(201).json(mapCourseToResponse(course));
});

export const getAllCourses = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const courses = await Course.find().sort({ createdAt: -1 });

    return res.status(200).json(courses.map(mapCourseToResponse));
  },
);

export const getCourseById = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json(mapCourseToResponse(course));
  },
);

export const updateCourse = catchAsync(async (req: IRequest, res: Response) => {
  const userId = req.user?._id?.toString();
  const { id } = courseParamsSchema.parse(req.params);
  const validatedData = courseUpdateSchema.parse(req.body);

  const course = await Course.findById(id);
  if (!course) {
    return sendErrorResponse({ res, message: "Course not found", code: 404 });
  }

  Object.assign(course, validatedData);
  await course.save();

  sendSuccessResponse({ res, data: course });
});

export const deleteCourse = catchAsync(async (req: IRequest, res: Response) => {
  const userId = req.user?._id?.toString();
  const { id } = courseParamsSchema.parse(req.params);

  const course = await Course.findByIdAndDelete(id);

  if (!course) {
    return sendErrorResponse({
      res,
      message: "Course not found",
      code: 404,
    });
  }

  sendSuccessResponse({
    data: {},
    res,
    message: "Course deleted successfully",
  });
});
