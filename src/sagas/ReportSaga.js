import { call, put, takeLeading } from "@redux-saga/core/effects";
import { combineRootSagas } from "@protego/sdk/sagas/utils";
import {
  ADD_KYC_REPORT,
  ADD_KYB_REPORT,
  ADD_KYT_REPORT,
  ADD_DJ_KYC_REPORT,
} from "actions/ReportAction";
import {
  kycReportService,
  kybReportService,
  kytReportService,
  kycDJReportService,
} from "../services/ReportService";
//KYC
function* addKycReport({ payload }) {
  try {
    const { status, data } = yield call(kycReportService, payload);
    if (status === 200) {
      yield put(ADD_KYC_REPORT.success(data));
    }
  } catch (err) {
    yield put(ADD_KYC_REPORT.error(err));
  }
}

export function* addKycReportSaga() {
  yield takeLeading(ADD_KYC_REPORT, addKycReport);
}
//KYB
function* addKybReport({ payload }) {
  try {
    const { status, data } = yield call(kybReportService, payload);
    if (status === 200) {
      yield put(ADD_KYB_REPORT.success(data));
    }
  } catch (err) {
    yield put(ADD_KYB_REPORT.error(err));
  }
}

export function* addKybReportSaga() {
  yield takeLeading(ADD_KYB_REPORT, addKybReport);
}
//KYT
function* addKytReport({ payload }) {
  try {
    const { status, data } = yield call(kytReportService, payload);
    if (status === 200) {
      yield put(ADD_KYT_REPORT.success(data));
    }
  } catch (err) {
    yield put(ADD_KYT_REPORT.error(err));
  }
}

export function* addKytReportSaga() {
  yield takeLeading(ADD_KYT_REPORT, addKytReport);
}

//DJ KYC
function* addDJKycReport({ payload }) {
  try {
    const { status, data } = yield call(kycDJReportService, payload);
    if (status === 200) {
      yield put(ADD_DJ_KYC_REPORT.success(data));
    }
  } catch (err) {
    yield put(ADD_DJ_KYC_REPORT.error(err));
  }
}

export function* addDJKycReportSaga() {
  yield takeLeading(ADD_DJ_KYC_REPORT, addDJKycReport);
}
export default function* SettingSaga() {
  yield combineRootSagas(
    addKycReportSaga,
    addKybReportSaga,
    addKytReportSaga,
    addDJKycReportSaga
  );
}
