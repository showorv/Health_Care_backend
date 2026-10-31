import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";

import status from "http-status";
import { RAGService } from "./rag.service";
import { sendResponse } from "../../shared/sendResponse";

const ragService = new RAGService()

const getStats = async (req: Request, res: Response) => {
  console.log("connected", req.query);
  res.status(200).json({ message: "connected rag apis" });
};

const ingestDoctors = catchAsync(async (req: Request, res: Response) => {
 const result = await ragService.ingestDoctorsData()

  sendResponse(res,{
    success: true,
    httpStatusCode: status.OK,
    message: "Doctors data ingestion completed",
    data: result
  })
});

export const RagController = {
  getStats,
  ingestDoctors,
};