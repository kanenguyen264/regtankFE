import {
  fetchAllPackageFailed,
  fetchAllPackageSuccess,
  packageUpgradeSuccess,
  showMessage
} from "actions";
import { FETCH_ALL_PACKAGE, PACKAGE_UPGRADE } from "constants/ActionTypes";
import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { fetchPackagesAllFromApi, packageUpgrade } from "../services/Package";

function* getPackagesALL({ payload }) {
  try {
    const response = yield call(fetchPackagesAllFromApi);
    yield put(fetchAllPackageSuccess(response));
  } catch (error) {
    yield put(fetchAllPackageFailed);
    yield put(showMessage(error.error_description));
  }
}
function* upgrade({ payload }) {
  try {
    const response = yield call(packageUpgrade, payload);
    yield put(packageUpgradeSuccess(response));
  } catch (error) {
    // yield put(fetchCreditBundleFailed);
    console.error(error);
    yield put(showMessage(error.error_description));
  }
}
export function* watchFetchPackagesAll() {
  yield takeLatest(FETCH_ALL_PACKAGE, getPackagesALL);
}
export function* watchPackageUpgrade() {
  yield takeLatest(PACKAGE_UPGRADE, upgrade);
}

export default function* rootSaga() {
  yield all([fork(watchFetchPackagesAll), fork(watchPackageUpgrade)]);
}
