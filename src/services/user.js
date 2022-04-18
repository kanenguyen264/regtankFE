import ApiService from "./ApiService";

export const fetchAllUserFromApi = () => {
  return ApiService.get(`/user/all`);
};
export const fetchMeFromApi = () => {
  return ApiService.get(`/user/me`);
};

export const getMfaProfileService = () => {
  return ApiService.get("user/mfa-info");
};
export const getMfaVerifyService = (param) => {
  return ApiService.post("/user/verify-password", param);
};
export const updateTwoFactorService = (param) => {
  let newParam = {
    enabled_two_factor_auth: param.enabled_two_factor_auth,
    mfa_key: param.mfa_key,
    verify_code: param.verify_code
  };
  return ApiService.post(
    `/user/update-two-factor-auth?userId=${param.userId}`,
    newParam
  );
};

export const updateMyProfileFromApi = (body) => {
  const params = {
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    phone: body.phone,
    bio: body.bio,
    password: body.password,
    colorCode: body.colorCode
  };
  delete body.firstName;
  delete body.lastName;
  delete body.email;
  delete body.phone;
  delete body.bio;
  delete body.password;
  delete body.colorCode;
  const url = "/user/me";
  return ApiService.put(url, params);
};
