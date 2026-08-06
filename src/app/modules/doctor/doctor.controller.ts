import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { doctorService } from "./doctor.service";


const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
 

    const getAllDoctors = await doctorService.getAllDoctors(); 

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Doctors retrieved successfully",
        data: getAllDoctors,
    });
});

export const doctorController = {
    getAllDoctors,
};