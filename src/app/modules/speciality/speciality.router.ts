import { Router } from "express";
import { specialityController } from "./speciality.controller";
import { Role } from "../../../generated/prisma/browser";
import { checkAuth } from "../../middleware/checkAuth";
import { multerUpload } from "../../config/multer";
import { validateRequest } from "../../middleware/validateRequest";
import { SpecialtyValidation } from "./speciality.validation";


const router = Router();

router.post("/create" ,
    checkAuth(Role.ADMIN, Role.SUPERADMIN), 
    multerUpload.single("file"),
    validateRequest(SpecialtyValidation.createSpecialtyZodSchema),

    specialityController.createSpeciality)
router.get("/" , specialityController.getSpecialities)
router.delete("/delete/:id" , checkAuth(Role.ADMIN, Role.SUPERADMIN),specialityController.deleteSpeciality)

export const specialityRouter = router;