import { GET, POST } from "./ApiLivenessService";
import ApiService from "./ApiService";

export const fetchAllRequestFromApi = (params) => {
  return GET(`/admin/verify-status/search`, params);
};
export const fetchRequestDetailFromApi = (requestId) => {
  return ApiService.get(`/v1/onboarding/liveness/${requestId}`);
};
export const resentRequestFromApi = (requestId) => {
  return POST(`/admin/verify/re-check/${requestId}`);
};
export const updateRequestStatusFromApi = (params) => {
  return ApiService.post(`/v1/onboarding/verify/status`, params);
};
export const deleteRequestFromApi = (params) => {
  return ApiService.post(`/v1/onboarding/liveness/delete`, params);
};
export const fetchLivenessSetting = () => {
  return GET(`/v1/onboarding/setting`);
};

/**
 * Liveness setting
 */
export function getLivenessSettingService(data) {
  return ApiService.get(`/v1/onboarding/setting`, data);
}
export function updateLivenessSettingService(data) {
  return ApiService.post(`/v1/onboarding/setting`, data);
}
