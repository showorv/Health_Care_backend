import { Router } from "express";
import { specialityRouter } from "../modules/speciality/speciality.router";
import { authRouter } from "../modules/auth/auth.router";
import { userRouter } from "../modules/user/user.router";
import { doctorRouter } from "../modules/doctor/doctor.router";
import { scheduleRouter } from "../modules/schedule/schedule.route";


const router = Router();
router.use("/auth" ,authRouter)
router.use("/specialities" ,specialityRouter)
router.use("/users" ,userRouter)
router.use("/doctors" ,doctorRouter)
router.use("/schedule" ,scheduleRouter)

export const indexRouter = router;