import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { tokenUtils } from "../../utils/token";
import { authService } from "./auth.service";


const registerPatient = catchAsync(async (req, res) => {
    const { name, email, password } = req.body;

    const data = await authService.registerPatient({ name, email, password });
     const { accessToken, refreshToken, token, ...rest } = data;

        tokenUtils.setAccessTokenCookie(res, accessToken);
        tokenUtils.setRefreshTokenCookie(res, refreshToken);
        tokenUtils.setBetterAuthSessionCookie(res, token as string);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Patient registered successfully",
    data: {
      ...rest,
      accessToken,
      refreshToken,
      token
    }
  });
})

const loginPatient = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    const data = await authService.loginPatient(email, password);

    const{accessToken, refreshToken, token, ...rest}= data;

   tokenUtils.setAccessTokenCookie(res, accessToken);
   tokenUtils.setRefreshTokenCookie(res, refreshToken);
     tokenUtils.setBetterAuthSessionCookie(res, token);  

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Patient logged in successfully",
    data: {
      ...rest,
      accessToken,
      refreshToken,
      token 
    }
  });
})
export const authController = { registerPatient, loginPatient
}