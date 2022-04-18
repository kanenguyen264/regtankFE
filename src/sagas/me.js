import {
  fetchMeFailed,
  fetchMeSuccess,
  getMFAProfileFailed,
  getMFAProfileSuccess,
  getMFAVerifyFailed,
  getMFAVerifySuccess,
  showMessage,
  updateMyProfileSuccess,
  updateTwoFactorAuthFailed,
  updateTwoFactorAuthSuccess,
} from "actions";
import { STAFF_DETAIL } from "actions/Staff";
import {
  FETCH_ME,
  GET_MFA_INFO,
  UPDATE_MY_PROFILE,
  UPDATE_TWO_FACTOR_AUTH,
} from "constants/ActionTypes";
import { all, call, fork, put, takeLatest, select } from "redux-saga/effects";
import {
  fetchMeFromApi,
  getMfaProfileService,
  getMfaVerifyService,
  updateMyProfileFromApi,
  updateTwoFactorService,
} from "services/user";
import { GET_MFA_VERIFY } from "../constants/ActionTypes";

function* getMe() {
  try {
    const response = yield call(fetchMeFromApi);
    yield put(fetchMeSuccess(response));
  } catch (error) {
    yield put(fetchMeFailed);
    yield put(showMessage(error.error_description));
  }
}
function* updateMyProfile({ payload }) {
  try {
    const response = yield call(updateMyProfileFromApi, payload);
    if (response.status === 200) {
      yield put(updateMyProfileSuccess(response));
    }
  } catch (error) {}
}
export function* watchMyProfile() {
  yield takeLatest(UPDATE_MY_PROFILE, updateMyProfile);
}
export function* watchFetchMe() {
  yield takeLatest(FETCH_ME, getMe);
}

/**
 * MFA Profile
 */

function* getMfaInfo({ payload }) {
  try {
    const response = yield call(getMfaProfileService, payload);
    if (response.status === 200) {
      yield put(getMFAProfileSuccess(response));
    }
  } catch (error) {
    yield put(getMFAProfileFailed(error));
  }
}
export function* getMfaInfoRequest() {
  yield takeLatest(GET_MFA_INFO, getMfaInfo);
}

function* getMFAVerifySaga({ payload }) {
  try {
    const response = yield call(getMfaVerifyService, payload);
    if (response?.data) {
      yield put(getMFAVerifySuccess(response?.data));
      const profile = yield call(getMfaProfileService, payload);
      if (profile.status === 200) {
        yield put(getMFAProfileSuccess(profile));
      } else {
        yield put(getMFAProfileFailed(profile));
      }
    } else {
      yield put(getMFAVerifyFailed(false));
    }
  } catch (error) {
    yield put(getMFAVerifyFailed(error));
  }
}
export function* getMfaVerifyRequest() {
  yield takeLatest(GET_MFA_VERIFY, getMFAVerifySaga);
}

function* updateTwoAuthSaga({ payload }) {
  try {
    const response = yield call(updateTwoFactorService, payload);
    if (response?.status === 200) {
      const { me } = yield select();
      if (me?.me?.id === response?.data?.id) {
        /**
         *  profile user
         */
        yield put(updateTwoFactorAuthSuccess(response));
      } else {
        /**
         *  staff user
         */
        yield put(STAFF_DETAIL.success(response));
      }
    } else {
      yield put(updateTwoFactorAuthFailed(""));
    }
  } catch (error) {
    yield put(updateTwoFactorAuthFailed(error));
  }
}
export function* updateTwoAuthRequest() {
  yield takeLatest(UPDATE_TWO_FACTOR_AUTH, updateTwoAuthSaga);
}

export default function* rootSaga() {
  yield all([
    fork(watchFetchMe),
    fork(watchMyProfile),
    fork(getMfaInfoRequest),
    fork(getMfaVerifyRequest),
    fork(updateTwoAuthRequest),
  ]);
}
