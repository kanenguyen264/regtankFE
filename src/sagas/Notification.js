import {
  fetchAllNotificationFailed,
  fetchAllNotificationHeaderFailed,
  fetchAllNotificationHeaderSuccess,
  fetchAllNotificationSuccess,
  fetchAllNotificationIdReadSuccess,
  showMessage
} from "actions";
import {
  NOTIFICATION,
  NOTIFICATION_HEADER,
  NOTIFICATION_ID_READ
} from "constants/ActionTypes";
import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import {
  fetchNotificationAllFromApi,
  fetchNotificationIdReadFromApi
} from "../services/Notification";
function* getNotification({ payload }) {
  try {
    const response = yield call(fetchNotificationAllFromApi, payload);
    if (response.status === 200) {
      yield put(fetchAllNotificationSuccess(response));
    }
  } catch (error) {
    yield put(fetchAllNotificationFailed);
    yield put(showMessage(error.error_description));
  }
}
function* getNotificationHeader({ payload }) {
  try {
    const response = yield call(fetchNotificationAllFromApi, payload);
    if (response.status === 200) {
      yield put(fetchAllNotificationHeaderSuccess(response));
    }
  } catch (error) {
    yield put(fetchAllNotificationHeaderFailed);
    yield put(showMessage(error.error_description));
  }
}
function* getNotificationIdRead({ payload }) {
  try {
    const { data } = yield call(fetchNotificationIdReadFromApi, payload);
    if (data) {
      yield put(fetchAllNotificationIdReadSuccess(data));
    }
  } catch (error) {}
}

export function* watchNotification() {
  yield takeLatest(NOTIFICATION, getNotification);
}
export function* watchNotificationHeader() {
  yield takeLatest(NOTIFICATION_HEADER, getNotificationHeader);
}
export function* watchNotificationIdRead() {
  yield takeLatest(NOTIFICATION_ID_READ, getNotificationIdRead);
}
export default function* rootSaga() {
  yield all([
    fork(watchNotificationHeader),
    fork(watchNotification),
    fork(watchNotificationIdRead)
  ]);
}
