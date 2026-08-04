import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { authService } from "./auth.service";


const registerPatient = catchAsync(async (req, res) => {
    const { name, email, password } = req.body;

    const data = await authService.registerPatient({ name, email, password });

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Patient registered successfully",
    data,
  });
})

const loginPatient = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    const data = await authService.loginPatient(email, password);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Patient logged in successfully",
    data,
  });
})
export const authController = { registerPatient, loginPatient
}