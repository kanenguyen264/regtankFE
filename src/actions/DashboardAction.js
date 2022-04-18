import {
  FETCH_CASE_MANAGEMENT,
  FETCH_DASHBOARD_CREDIT,
  FETCH_DASHBOARD_STAFF_ASSIGN,
  FETCH_DASHBOARD_KYT,
  FETCH_DASHBOARD_KYC,
  FETCH_CASE_MANAGEMENT_SUCCESS,
  FETCH_CASE_MANAGEMENT_FAILED,
  FETCH_DASHBOARD_STAFF_ASSIGN_FAILED,
  FETCH_DASHBOARD_STAFF_ASSIGN_SUCCESS,
  FETCH_DASHBOARD_KYC_SUCCESS,
  FETCH_DASHBOARD_KYC_FAILED,
  FETCH_DASHBOARD_KYT_SUCCESS,
  FETCH_DASHBOARD_KYT_FAILED,
  FETCH_DASHBOARD_CREDIT_SUCCESS,
  FETCH_DASHBOARD_CREDIT_FAILED,
  FETCH_DASHBOARD_KYB,
  FETCH_DASHBOARD_KYB_SUCCESS,
  FETCH_DASHBOARD_KYB_FAILED,
  /**
   * Liveness
   */
  FETCH_SUMMARY_REQUEST_CHART,
  FETCH_PERCENTAGE_CHART,
  FETCH_STATUS_CHART,
  FETCH_SUMMARY_REQUEST_CHART_SUCCESS,
  FETCH_SUMMARY_REQUEST_CHART_FAILED,
  FETCH_PERCENTAGE_CHART_SUCCESS,
  FETCH_PERCENTAGE_CHART_FAILED,
  FETCH_STATUS_CHART_SUCCESS,
  FETCH_STATUS_CHART_FAILED,
  SHOW_MESSAGE,
} from "constants/ActionTypes";
/**
 * case
 */
export const fetchCaseManagement = () => {
  return {
    type: FETCH_CASE_MANAGEMENT,
  };
};
export const fetchCaseManagementSuccess = (response) => {
  return {
    type: FETCH_CASE_MANAGEMENT_SUCCESS,
    payload: response,
  };
};
export const fetchCaseManagementFailed = (response) => {
  return {
    type: FETCH_CASE_MANAGEMENT_FAILED,
    payload: response,
  };
};
/**
 * Assignment
 */

export const fetchStaffAssignment = (response) => {
  return {
    type: FETCH_DASHBOARD_STAFF_ASSIGN,
    payload: response,
  };
};
export const fetchStaffAssignmentSuccess = (response) => {
  return {
    type: FETCH_DASHBOARD_STAFF_ASSIGN_SUCCESS,
    payload: response,
  };
};
export const fetchStaffAssignmentFailed = (response) => {
  return {
    type: FETCH_DASHBOARD_STAFF_ASSIGN_FAILED,
    payload: response,
  };
};
/**
 * kyc
 */

export const fetchDashboardKYC = (response) => {
  return {
    type: FETCH_DASHBOARD_KYC,
    payload: response,
  };
};
export const fetchDashboardKYCSuccess = (response) => {
  return {
    type: FETCH_DASHBOARD_KYC_SUCCESS,
    payload: response,
  };
};
export const fetchDashboardKYCFailed = (response) => {
  return {
    type: FETCH_DASHBOARD_KYC_FAILED,
    payload: response,
  };
};
/**
 * kyb
 */

export const fetchDashboardKYB = (response) => {
  return {
    type: FETCH_DASHBOARD_KYB,
    payload: response,
  };
};
export const fetchDashboardKYBSuccess = (response) => {
  return {
    type: FETCH_DASHBOARD_KYB_SUCCESS,
    payload: response,
  };
};
export const fetchDashboardKYBFailed = (response) => {
  return {
    type: FETCH_DASHBOARD_KYB_FAILED,
    payload: response,
  };
};
/**
 * kyt
 */
export const fetchDashboardKYT = (response) => {
  return {
    type: FETCH_DASHBOARD_KYT,
    payload: response,
  };
};
export const fetchDashboardKYTSuccess = (response) => {
  return {
    type: FETCH_DASHBOARD_KYT_SUCCESS,
    payload: response,
  };
};

export const fetchDashboardKYTFailed = (response) => {
  return {
    type: FETCH_DASHBOARD_KYT_FAILED,
    payload: response,
  };
};
/**
 * Credit
 */
export const fetchCredit = (response) => {
  return {
    type: FETCH_DASHBOARD_CREDIT,
    payload: response,
  };
};

export const fetchCreditSuccess = (response) => {
  return {
    type: FETCH_DASHBOARD_CREDIT_SUCCESS,
    payload: response,
  };
};
export const fetchCreditFailed = (response) => {
  return {
    type: FETCH_DASHBOARD_CREDIT_FAILED,
    payload: response,
  };
};
/**
 * Liveness
 */
export const fetchSummaryRequestChart = (data) => {
  return {
    type: FETCH_SUMMARY_REQUEST_CHART,
    payload: data,
  };
};
export const fetchSummaryRequestChartSuccess = (response) => {
  return {
    type: FETCH_SUMMARY_REQUEST_CHART_SUCCESS,
    payload: response,
  };
};

export const fetchSummaryRequestChartFailed = () => {
  return {
    type: FETCH_SUMMARY_REQUEST_CHART_FAILED,
  };
};

export const fetchPercentageChart = (data) => {
  return {
    type: FETCH_PERCENTAGE_CHART,
    payload: data,
  };
};
export const fetchPercentageChartSuccess = (response) => {
  return {
    type: FETCH_PERCENTAGE_CHART_SUCCESS,
    payload: response,
  };
};

export const fetchPercentageChartFailed = () => {
  return {
    type: FETCH_PERCENTAGE_CHART_FAILED,
  };
};
export const fetchStatusChart = (data) => {
  return {
    type: FETCH_STATUS_CHART,
    payload: data,
  };
};
export const fetchStatusChartSuccess = (response) => {
  return {
    type: FETCH_STATUS_CHART_SUCCESS,
    payload: response,
  };
};
export const fetchStatusChartFailed = () => {
  return {
    type: FETCH_STATUS_CHART_FAILED,
  };
};
export const showMessage = (message) => {
  return {
    type: SHOW_MESSAGE,
    payload: message,
  };
};
