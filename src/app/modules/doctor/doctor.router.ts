import { Router } from "express";

import { doctorController } from "./doctor.controller";
import { Role } from "../../../generated/prisma/browser";
import { checkAuth } from "../../middleware/checkAuth";

const router = Router();

router.get("/", checkAuth(Role.ADMIN, Role.SUPERADMIN), doctorController.getAllDoctors);
router.get("/:id", checkAuth(Role.ADMIN, Role.SUPERADMIN), doctorController.getDoctorById);
router.put("/:id", checkAuth(Role.ADMIN, Role.SUPERADMIN), doctorController.updateDoctor);
router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPERADMIN), doctorController.deleteDoctor);

export const doctorRouter = router;