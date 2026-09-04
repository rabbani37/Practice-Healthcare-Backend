import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"
import { UserService } from "./user.service";


const profileImage = catchAsync(async (req: Request, res: Response) => {
    const file = req.file;
    const userId = req.user?.userId as string
    if (!file) {
        throw new Error("File Not Found")
    }
    const result = await UserService.profileImage(file.buffer, userId);


    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Uploaded Your Profile Image",
        data: result
    });
});







export const UserController = {
    profileImage
}