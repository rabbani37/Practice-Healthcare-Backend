import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"
import { AppoinmentService } from "./appoinment.service";



const bookAppoinment = catchAsync(async (req: Request, res: Response) => {

    const result = await AppoinmentService.bookAppoinment()

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Create an appoinment successfully",
        data: result
    });
});



const bookAppoinmentCallback = catchAsync(async (req: Request, res: Response) => {

    const result = await AppoinmentService.bookAppoinmentCallback()

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "After payment successfully",
        data: result
    });
});





export const AppoinmentController = {
    bookAppoinment,
    bookAppoinmentCallback
}