import { call, takeLatest, select, put } from "redux-saga/effects";
import { AUTH_ACTION_LOGIN_SUCCESS } from "@protego/sdk/consts/actions";
import { logout } from "services/AuthCPService";
import {
  customerMe,
  updateCustomerAuthService,
} from "../services/CustomerService";
import AuthService from "services/AuthService";
import { combineRootSagas } from "@protego/sdk/sagas/utils";
import { LOG_OUT, UPDATE_COMPANY_TWO_FACTOR_AUTH } from "constants/ActionTypes";
import {
  getCustomerMeSuccess,
  updateCompanyTwoFactorAuthSuccess,
  REFRESH_TOKEN,
} from "actions/Auth";
function* signOutFunction() {
  try {
    const { access_token, refresh_token } = yield select((state) => state.auth.authUser);
    yield call(logout(access_token, refresh_token));
  } catch (error) {}
}
export function* logOutAccount() {
  yield takeLatest(LOG_OUT, signOutFunction);
}

function* watchLoginSuccess() {
  yield takeLatest(
    [AUTH_ACTION_LOGIN_SUCCESS, "persist/REHYDRATE"],
    function* loginSuccess() {
      const user = yield select((state) => state.auth.authUser);
      if (user !== null && typeof user.access_token === "string") {
        const response = yield call(customerMe);
        yield put(getCustomerMeSuccess(response));
        window.localStorage.setItem(
          "doc:company",
          JSON.stringify(response.data)
        );
      }
    }
  );
}
function* WatchUpdateCustomerAuth({ payload }) {
  try {
    const response = yield call(updateCustomerAuthService, payload);
    if (response.status === 200) {
      yield put(updateCompanyTwoFactorAuthSuccess());
      const responseCustomerMe = yield call(customerMe);
      yield put(getCustomerMeSuccess(responseCustomerMe));
    }
  } catch (err) {}
}
function* updateCustomerAuth() {
  yield takeLatest(UPDATE_COMPANY_TWO_FACTOR_AUTH, WatchUpdateCustomerAuth);
}

function* refreshTokenAction() {
  try {
    const { refresh_token } = yield select((state) => state.auth.authUser);

    const response = yield call(AuthService.refreshToken(refresh_token));
  } catch (err) {}
}
function* refreshTokenSaga() {
  yield takeLatest(REFRESH_TOKEN, refreshTokenAction);
}

export default function* rootSaga() {
  yield combineRootSagas(
    logOutAccount,
    watchLoginSuccess,
    updateCustomerAuth,
    refreshTokenSaga
  );
}
