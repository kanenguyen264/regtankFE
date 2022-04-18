import {
  fetchCustomerCreditFailed,
  fetchCustomerCreditSuccess,
  fetchCreditBundleSuccess,
  fetchCreditBundleFailed,
  updateSetBillingTopSuccess,
  updateSetBillingRenewSuccess,
  showMessage
} from "actions";
import {
  FETCH_CUSTOMER_CREDIT,
  FETCH_CREDIT_BUNDLE,
  SET_BILLING_TOP,
  SET_BILLING_RENEW
} from "constants/ActionTypes";
import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import {
  fetchCustomerCreditFromApi,
  fetchCreditBundleFromApi,
  setBillingTopFromApi,
  setBillingRenewFromApi
} from "../services/Credit";

function* getCustomerCredit({ payload }) {
  try {
    const response = yield call(fetchCustomerCreditFromApi, payload);
    yield put(fetchCustomerCreditSuccess(response));
  } catch (error) {
    yield put(fetchCustomerCreditFailed);
    console.error(error);
    yield put(showMessage(error.error_description));
  }
}

function* getCreditBundle({ payload }) {
  try {
    const response = yield call(fetchCreditBundleFromApi, payload);
    yield put(fetchCreditBundleSuccess(response));
  } catch (error) {
    yield put(fetchCreditBundleFailed);
    console.error(error);
    yield put(showMessage(error.error_description));
  }
}
function* setBillingTop({ payload }) {
  try {
    const response = yield call(setBillingTopFromApi, payload);
    if (response.status === 200) {
      yield put(updateSetBillingTopSuccess(response));
    }
  } catch (error) {
    console.log("Error");
  }
}
function* setBillingRenew({ payload }) {
  try {
    const response = yield call(setBillingRenewFromApi, payload);
    if (response.status === 200) {
      yield put(updateSetBillingRenewSuccess(response));
    }
  } catch (error) {
    console.log("Error");
  }
}

export function* watchUpdateSetBillingTop() {
  yield takeLatest(SET_BILLING_TOP, setBillingTop);
}
export function* watchUpdateSetBillingRenew() {
  yield takeLatest(SET_BILLING_RENEW, setBillingRenew);
}

export function* watchFetchCustomerCredit() {
  yield takeLatest(FETCH_CUSTOMER_CREDIT, getCustomerCredit);
}
export function* watchFetchCreditBundle() {
  yield takeLatest(FETCH_CREDIT_BUNDLE, getCreditBundle);
}
export default function* rootSaga() {
  yield all([
    fork(watchFetchCustomerCredit),
    fork(watchFetchCreditBundle),
    fork(watchUpdateSetBillingTop),
    fork(watchUpdateSetBillingRenew)
  ]);
}
