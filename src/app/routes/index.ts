import { Router } from "express";
import { specialityRouter } from "../modules/speciality/speciality.router";


const router = Router();

router.use("/specialities" ,specialityRouter)

export const indexRouter = router;