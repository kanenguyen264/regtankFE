import ApiService from "./ApiService";

export const fetchPackagesAllFromApi = () => {
  return ApiService.get(`/package/all`);
};
export const packageUpgrade = (data) => {
  return ApiService.post(`/package/upgrade/${data.id}?period=${data.type}`);
};
