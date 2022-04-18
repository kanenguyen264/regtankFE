import { call, put, takeLatest } from "@redux-saga/core/effects";
import {
  SUPPORT_ACTION_SUBMIT,
  SUPPORT_ACTION_SUBMIT_ERROR,
  SUPPORT_ACTION_SUBMIT_SUCCESS
} from "../constants/ActionTypes";
import { SupportServiceSubmit } from "../services/SupportService";

function* supportSubmit({ payload }) {
  try {
    yield call(SupportServiceSubmit, payload);
    yield put({ type: SUPPORT_ACTION_SUBMIT_SUCCESS });
  } catch (e) {
    yield put({ type: SUPPORT_ACTION_SUBMIT_ERROR });
  }
}

export default function* supportSaga() {
  yield takeLatest(SUPPORT_ACTION_SUBMIT, supportSubmit);
}
