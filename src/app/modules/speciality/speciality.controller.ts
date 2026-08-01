
import { Request, Response } from "express";
import { specialityService } from "./speciality.service";


const createSpeciality = async (req: Request, res: Response) => {
  try {
    const payload  = req.body;


    const speciality = await specialityService.createSpeciality(payload);
 
    res.status(201).json({
        success: true,
        message: "Speciality created successfully",
        data: speciality,
    })
  } catch (error) {
    console.error("Error creating speciality:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const specialityController = { createSpeciality };