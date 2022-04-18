import { combineRootSagas } from "@protego/sdk/sagas/utils";
import { call, put, takeLatest } from "@redux-saga/core/effects";
import {
  FETCH_CASE_MANAGEMENT,
  FETCH_DASHBOARD_CREDIT,
  FETCH_DASHBOARD_KYC,
  FETCH_DASHBOARD_KYT,
  FETCH_DASHBOARD_STAFF_ASSIGN,
  FETCH_DASHBOARD_KYB,
  FETCH_PERCENTAGE_CHART,
  FETCH_STATUS_CHART,
  FETCH_SUMMARY_REQUEST_CHART,
} from "constants/ActionTypes";
import {
  fetchCaseManagementFailed,
  fetchCaseManagementSuccess,
  fetchCreditFailed,
  fetchCreditSuccess,
  fetchDashboardKYCFailed,
  fetchDashboardKYCSuccess,
  fetchDashboardKYTFailed,
  fetchDashboardKYTSuccess,
  fetchStaffAssignmentFailed,
  fetchStaffAssignmentSuccess,
  fetchDashboardKYBSuccess,
  fetchDashboardKYBFailed,
  /**
   * Liveness
   */
  fetchPercentageChartFailed,
  fetchPercentageChartSuccess,
  fetchStatusChartFailed,
  fetchStatusChartSuccess,
  fetchSummaryRequestChartFailed,
  fetchSummaryRequestChartSuccess,
  showMessage,
} from "../actions/DashboardAction";
import {
  fetchCaseManagementService,
  fetchCreditService,
  fetchKYCService,
  fetchKYTService,
  fetchStaffAssignService,
  fetchKYBService,
  /**
   * Liveness
   */
  percentageChartReportFromApi,
  statusChartReportFromApi,
  summaryRequestReportFromApi,
} from "../services/DashboardService";
function* dashboardCase() {
  try {
    const { data } = yield call(fetchCaseManagementService);
    yield put(fetchCaseManagementSuccess(data));
  } catch (error) {
    yield put(fetchCaseManagementFailed());
  }
}

function* fetchDashboardCase() {
  yield takeLatest(FETCH_CASE_MANAGEMENT, dashboardCase);
}
/**
 * Fetch kyc
 */
function* dashboardKyc() {
  try {
    const { data } = yield call(fetchKYCService);
    yield put(fetchDashboardKYCSuccess(data));
  } catch (error) {
    yield put(fetchDashboardKYCFailed());
  }
}

function* fetchDashboardKYC() {
  yield takeLatest(FETCH_DASHBOARD_KYC, dashboardKyc);
}

/**
 * Fetch kyb
 */
function* dashboardKyb() {
  try {
    const { data } = yield call(fetchKYBService);
    yield put(fetchDashboardKYBSuccess(data));
  } catch (error) {
    yield put(fetchDashboardKYBFailed());
  }
}

function* fetchDashboardKYB() {
  yield takeLatest(FETCH_DASHBOARD_KYB, dashboardKyb);
}
/**
 * Fetch kyt
 */
function* dashboardKyt() {
  try {
    const { data } = yield call(fetchKYTService);
    yield put(fetchDashboardKYTSuccess(data));
  } catch (error) {
    yield put(fetchDashboardKYTFailed());
  }
}

function* fetchDashboardKYT() {
  yield takeLatest(FETCH_DASHBOARD_KYT, dashboardKyt);
}
/**
 * Fetch staff assign
 */
function* dashboardStaffAssign() {
  try {
    const { data } = yield call(fetchStaffAssignService);
    yield put(fetchStaffAssignmentSuccess(data));
  } catch (error) {
    yield put(fetchStaffAssignmentFailed());
  }
}

function* fetchDashboardStaffAssign() {
  yield takeLatest(FETCH_DASHBOARD_STAFF_ASSIGN, dashboardStaffAssign);
}
/**
 * Fetch case
 */
function* dashboardCredit() {
  try {
    const { data } = yield call(fetchCreditService);
    yield put(fetchCreditSuccess(data));
  } catch (error) {
    yield put(fetchCreditFailed());
  }
}

function* fetchDashboardCredit() {
  yield takeLatest(FETCH_DASHBOARD_CREDIT, dashboardCredit);
}
/**
 * Liveness
 */
function* getSummaryRequestChart({ payload }) {
  try {
    const response = yield call(summaryRequestReportFromApi, payload);
    if (response.status === 200) {
      yield put(fetchSummaryRequestChartSuccess(response));
    }
  } catch (error) {
    yield put(fetchSummaryRequestChartFailed);
    yield put(showMessage(error.error_description));
  }
}
export function* watchSummaryRequestChart() {
  yield takeLatest(FETCH_SUMMARY_REQUEST_CHART, getSummaryRequestChart);
}

function* getPercentageChartReport({ payload }) {
  try {
    const response = yield call(percentageChartReportFromApi, payload);
    if (response.status === 200) {
      yield put(fetchPercentageChartSuccess(response));
    }
  } catch (error) {
    yield put(fetchPercentageChartFailed);
    yield put(showMessage(error.error_description));
  }
}
export function* watchPercentageChartReport() {
  yield takeLatest(FETCH_PERCENTAGE_CHART, getPercentageChartReport);
}

function* getStatusChartReport({ payload }) {
  try {
    const response = yield call(statusChartReportFromApi, payload);
    if (response.status === 200) {
      yield put(fetchStatusChartSuccess(response));
    }
  } catch (error) {
    yield put(fetchStatusChartFailed);
    yield put(showMessage(error.error_description));
  }
}
export function* watchStatusChartReport() {
  yield takeLatest(FETCH_STATUS_CHART, getStatusChartReport);
}

export default function* rootSaga() {
  yield combineRootSagas(
    fetchDashboardCase,
    fetchDashboardKYC,
    fetchDashboardKYT,
    fetchDashboardStaffAssign,
    fetchDashboardCredit,
    fetchDashboardKYB,
    watchStatusChartReport,
    watchPercentageChartReport,
    watchSummaryRequestChart
  );
}
