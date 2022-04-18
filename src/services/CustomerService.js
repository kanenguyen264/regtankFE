import ApiService from "./ApiService";

export const customerMe = () => {
  return ApiService.get(`/customer/me`);
};
export const updateCustomerAuthService = (params) => {
  return ApiService.post(
    `/customer/auth/save?enabled=${params.enabled}&allowedToTurnOff=${params.allowedToTurnOff}`
  );
};
