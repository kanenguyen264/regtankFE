import {
  fetchAllLivenessFailed,
  fetchAllLivenessSuccess,
  getRequestDetailSuccess,
  showMessage,
} from "../actions";
import {
  FETCH_ALL_LIVENESS,
  LIVENESS_RESENT_REQUEST,
  LIVENESS_REQUEST_DETAIL,
} from "constants/ActionTypes";
import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import {
  fetchAllRequestFromApi,
  resentRequestFromApi,
  fetchRequestDetailFromApi,
} from "../services/Liveness";
import { LIVENESS_ROUTE_LIVENESS_CHECK } from "constants/routes";
function* getAllRequest({ payload }) {
  try {
    const response = yield call(fetchAllRequestFromApi, payload);
    if (response.status === 200) {
      yield put(fetchAllLivenessSuccess(response));
    }
  } catch (error) {
    yield put(fetchAllLivenessFailed);
    yield put(showMessage(error.error_description));
  }
}
function* getRequestDetail({ payload, history }) {
  try {
    const response = yield call(fetchRequestDetailFromApi, payload);
    if (response.status === 200) {
      yield put(getRequestDetailSuccess(response));
    }
  } catch (error) {
    history?.push(LIVENESS_ROUTE_LIVENESS_CHECK);
  }
}
function* resendRequest({ payload }) {
  try {
    const response = yield call(resentRequestFromApi, payload);
    if (response.status === 200) {
      yield put(null);
    }
  } catch (error) {}
}
export function* watchAllLiveness() {
  yield takeLatest(FETCH_ALL_LIVENESS, getAllRequest);
}
export function* watchAllRequestDetail() {
  yield takeLatest(LIVENESS_REQUEST_DETAIL, getRequestDetail);
}
export function* watchAllResentRequest() {
  yield takeLatest(LIVENESS_RESENT_REQUEST, resendRequest);
}
export default function* rootSaga() {
  yield all([fork(watchAllLiveness)]);
  yield all([fork(watchAllRequestDetail)]);
  yield all([fork(watchAllResentRequest)]);
}
