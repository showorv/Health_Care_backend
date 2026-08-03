import { Router } from "express";
import { specialityController } from "./speciality.controller";


const router = Router();

router.post("/create" , specialityController.createSpeciality)
router.get("/" , specialityController.getSpecialities)
router.delete("/delete/:id" , specialityController.deleteSpeciality)

export const specialityRouter = router;