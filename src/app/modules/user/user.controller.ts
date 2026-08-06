import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { UserService } from "./user.service";


const createDoctor = catchAsync(async (req: Request, res: Response) => {
 
    const doctorData = req.body; // Get the doctor data from the request body
    const createdDoctor = await UserService.createDoctor(doctorData); 

    sendResponse(res, {
        httpStatusCode: 201,
        success: true,
        message: "Doctor created successfully",
        data: createdDoctor,
    });
});

export const userController = {
    createDoctor,
};