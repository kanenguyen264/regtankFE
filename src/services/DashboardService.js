import ApiService from "./ApiService";
import { GET } from "./ApiLivenessService";

export const fetchCaseManagementService = () => {
  return ApiService.get(`dashboard/case-numbers`);
};

export const fetchKYCService = () => {
  return ApiService.get(`dashboard/kyc-statistics`);
};
export const fetchKYBService = () => {
  return ApiService.get(`dashboard/kyb-statistics`);
};
export const fetchKYTService = () => {
  return ApiService.get(`dashboard/kyt-statistics`);
};

export const fetchStaffAssignService = () => {
  return ApiService.get(`dashboard/staff-assignment`);
};
export const fetchCreditService = () => {
  return ApiService.get(`dashboard/credit-usage`);
};
/**
 * Liveness
 */
export const summaryRequestReportFromApi = (params) => {
  return GET(`/admin/report/summary-request`, params);
};
export const percentageChartReportFromApi = (params) => {
  return GET(`/admin/report/percentage-chart`, params);
};
export const statusChartReportFromApi = (params) => {
  return GET(`/admin/report/status-chart`, params);
};
