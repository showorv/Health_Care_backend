import { Router } from "express";
import { specialityRouter } from "../modules/speciality/speciality.router";
import { authRouter } from "../modules/auth/auth.router";
import { userRouter } from "../modules/user/user.router";
import { doctorRouter } from "../modules/doctor/doctor.router";
import { scheduleRouter } from "../modules/schedule/schedule.route";
import { DoctorScheduleRoutes } from "../modules/doctorSchedule/doctorScedule.route";
import { AppointmentRoutes } from "../modules/appointment/appointment.route";
import { PatientRoutes } from "../modules/patient/patient.route";
import { ReviewRoutes } from "../modules/review/review.route";
import { PrescriptionRoutes } from "../modules/prescription/prescription.route";


const router = Router();
router.use("/auth" ,authRouter)
router.use("/specialities" ,specialityRouter)
router.use("/users" ,userRouter)
router.use("/doctors" ,doctorRouter)
router.use("/patients" ,PatientRoutes)
router.use("/schedule" ,scheduleRouter)
router.use("/doctor-schedule" ,DoctorScheduleRoutes)
router.use("/appointments" ,AppointmentRoutes)
router.use("/review" ,ReviewRoutes)
router.use("/prescription" ,PrescriptionRoutes)

export const indexRouter = router;