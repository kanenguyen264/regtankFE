import ApiService from "./ApiService";

export const fetchCustomerCreditFromApi = (params) => {
  return ApiService.get(`/customer/credit`);
};
export const fetchCreditBundleFromApi = (params) => {
  return ApiService.get(`/credit/bundles`);
};
export const setBillingTopFromApi = (id) => {
  const body = id ? JSON.stringify(id) : "";
  return ApiService.post(`/billing/top?bundleId=${body}`);
};
export const setBillingRenewFromApi = () => {
  return ApiService.post(`/billing/renew`);
};
