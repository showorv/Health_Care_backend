import { Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/browser";


const router = Router   ();

router.post("/register", authController.registerPatient);
router.post("/login", authController.loginPatient);
router.get("/me", checkAuth(Role.ADMIN,Role.DOCTOR,Role.PATIENT,Role.SUPERADMIN), authController.getMe);
router.get("/refresh-token", authController.getNewToken);
router.post("/change-password", checkAuth(Role.ADMIN,Role.DOCTOR,Role.PATIENT,Role.SUPERADMIN), authController.changePassword);
router.post("/logout", checkAuth(Role.ADMIN,Role.DOCTOR,Role.PATIENT,Role.SUPERADMIN), authController.logoutUser);

router.post("/verify-email", authController.verifyEmail);
router.post("/forget-password", authController.forgetPassword);
router.post("/reset-password", authController.resetPassword);

router.get("/login/google", authController.googleLogin);
router.get("/google/success", authController.googleLoginSuccess);
router.get("/oauth/error", authController.handleOAuthError);

export const authRouter = router;