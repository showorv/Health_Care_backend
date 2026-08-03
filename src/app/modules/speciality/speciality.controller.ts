
import { Request, Response } from "express";
import { specialityService } from "./speciality.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";


// const createSpeciality = async (req: Request, res: Response) => {
//   try {
//     const payload  = req.body;


//     const speciality = await specialityService.createSpeciality(payload);
 
//     res.status(201).json({
//         success: true,
//         message: "Speciality created successfully",
//         data: speciality,
//     })
//   } catch (error) {
//     console.error("Error creating speciality:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

const createSpeciality = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const speciality = await specialityService.createSpeciality(payload);

sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Speciality created successfully",
    data: speciality
  }); 
});
const getSpecialities = catchAsync(async (req: Request, res: Response) => {
  const specialities = await specialityService.getSpecialities();
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Specialities retrieved successfully",
    data: specialities
  });
});
  

const deleteSpeciality = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedSpeciality = await specialityService.deleteSpeciality(id as string); ;
sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Speciality deleted successfully",
    data: deletedSpeciality
  }); 
});

export const specialityController = { createSpeciality , getSpecialities , deleteSpeciality };