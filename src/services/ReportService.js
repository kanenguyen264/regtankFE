import ApiService from "./ApiService";
import { getCurrentTimeZone } from "util/date";
const tz = getCurrentTimeZone();
export const kycReportService = (data) => {
  return ApiService.post(`/report/KYC_SCREENING?timeZone=${tz}`, data);
};
export const kybReportService = (data) => {
  return ApiService.post(`/report/KYB_SCREENING?timeZone=${tz}`, data);
};
export const kytReportService = (data) => {
  return ApiService.post(`/report/KYT_SCREENING?timeZone=${tz}`, data);
};
export const kycDJReportService = (data) => {
  return ApiService.post(`/report/DJ_KYC_SCREENING?timeZone=${tz}`, data);
};
