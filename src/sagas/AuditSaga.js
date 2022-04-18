import {
  fetchAllAuditFailed,
  fetchAllAuditSuccess,
  filterAuditSuccess,
  showMessage
} from "actions";
import { FETCH_ALL_AUDIT, FILTER_AUDIT } from "constants/ActionTypes";
import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { fetchAllAuditFromApi, filterAuditService } from "../services/Audit";
function* getAllAudit({ payload }) {
  try {
    const response = yield call(fetchAllAuditFromApi, payload);
    if (response.status === 200) {
      yield put(fetchAllAuditSuccess(response));
    }
  } catch (error) {
    yield put(fetchAllAuditFailed);
    yield put(showMessage(error.error_description));
  }
}
export function* watchAllAudit() {
  yield takeLatest(FETCH_ALL_AUDIT, getAllAudit);
}
/**
 * Get filter data
 */

function* fetFilterAudit({ payload }) {
  try {
    const response = yield call(filterAuditService, payload);
    if (response.status === 200) {
      yield put(filterAuditSuccess(response));
    }
  } catch (error) {
    yield put(filterAuditSuccess());
  }
}
export function* fetFilterAuditRequest() {
  yield takeLatest(FILTER_AUDIT, fetFilterAudit);
}

export default function* rootSaga() {
  yield all([fork(watchAllAudit), fork(fetFilterAuditRequest)]);
}
