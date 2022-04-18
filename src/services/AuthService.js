//@flow
import ApiService from "./ApiService";
import type AuthServiceBase, {
  ServiceResponse
} from "@protego/sdk/core/AuthService.d.ts";
import { SupportServiceSubmit } from "./SupportService";

const AuthService: AuthServiceBase = {
  login: (username, password) =>
    ApiService.post("/user/login", { username, password }),
  loginMfa(mfaToken, mfaCode) {
    return ApiService.post("/user/login/mfa", {
      mfaToken: mfaToken,
      mfaCode: mfaCode
    });
  },
  firstTimeVerify(verifyCode) {
    return ApiService.get(`/user/first-time/${verifyCode}`);
  },
  firstTimeActivate(verifyCode, password, mfaCode) {
    return ApiService.post(`/user/first-time/activate/${verifyCode}`, {
      password,
      mfaCode
    });
  },
  forgotPassword(email: string): ServiceResponse<{ statusCode: string }> {
    return ApiService.post(`/user/forget-password`, { email });
  },
  resetPasswordVerify(code: string): ServiceResponse<any> {
    return ApiService.get(`/user/forget-password/${code}`);
  },
  resetPassword(
    code: string,
    password: string
  ): ServiceResponse<{ statusCode: string }> {
    return ApiService.post(`/user/forget-password/activate/${code}`, {
      password
    });
  },
  refreshToken(
    refresh_token: string
  ): ServiceResponse<{ access_token: string, refresh_token: string }> {
    return ApiService.refresh("/user/refresh", { refresh_token });
  },
  sendSupportForm(body): ServiceResponse<any> {
    return SupportServiceSubmit(body);
  },
  renewFirstTimeCode(code: string): ServiceResponse<any> {
    return ApiService.post(`/user/first-time/renew/${code}`);
  },
  getMfaInfoForSetup(code: string): ServiceResponse<any> {
    return ApiService.get(`/user/mfa-info-without-auth/${code}`);
  },
  setupMfa(mfaCode, mfaKey, verifyCode) {
    return ApiService.post(`/user/mfa/setup/${mfaCode}`, {
      mfa_key: mfaKey,
      verify_code: verifyCode
    });
  }
};

export default AuthService;
