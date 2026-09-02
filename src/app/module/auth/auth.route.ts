import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { AuthController } from "./auth.controller";
import { ForgotPasswordZodSchema, PatientRegisZodSchema, ResetPasswordZodSchema, UserLoginZodSchema } from "./auth.validation";
import { validationRequest } from "../../middleware/validationRequest";

const router = Router();

router.post("/register", validationRequest(PatientRegisZodSchema), AuthController.registerPatient);
router.post("/login", validationRequest(UserLoginZodSchema), AuthController.loginUser);
router.get(
	"/me",
	auth(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPER_ADMIN),
	AuthController.getMe,
);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/google", AuthController.googleLogin);
router.post("/forgot-password", validationRequest(ForgotPasswordZodSchema), AuthController.forgotPassword);
router.post("/reset-password", validationRequest(ResetPasswordZodSchema), AuthController.resetPassword);
export const AuthRoutes = router;
