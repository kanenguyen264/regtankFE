import { combineRootSagas } from "@protego/sdk/sagas/utils";
import { call, put, takeLeading } from "@redux-saga/core/effects";
import {
  ADD_DEPARTMENT,
  ADD_NEW_BLACKLIST,
  ADD_NEW_CATEGORY,
  CHANGE_STATUS_BLACKLIST,
  checkValidateDepartmentNameSuccess,
  deleteDepartmentFailed,
  deleteDepartmentSuccess,
  fetchDepartmentListAllFailed,
  fetchDepartmentListAllSuccess,
  fetchDepartmentListFailed,
  fetchDepartmentListSuccess,
  fetchGeneralSettings,
  fetchWhitelistSuccess,
  FETCH_ACTION_GET_KYB_BLACKLIST,
  FETCH_ACTION_GET_KYC_BLACKLIST,
  FETCH_ACTION_GET_KYT_BLACKLIST,
  FETCH_ACTION_KYC_CATEGORY,
  getDepartmentListByUserIdFailed,
  getDepartmentListByUserIdSuccess,
  GET_LIVENESS_SETTING,
  KYC_ACTION_GET_KYC_BLACKLIST_BY_FILTER,
  REMOVE_BLACKLIST_BY_ID,
  submitGeneralSettings,
  SUBMIT_LIVENESS_SETTING,
  updateWhitelistFailed,
  updateWhitelistSuccess,
  UPDATE_CATEGORY_BLACKLIST,
  UPDATE_DEPARTMENT,
} from "actions/Setting";
import {
  CHECK_VALIDATE_DEPARTMENT_NAME,
  DELETE_DEPARTMENT,
  DEPARTMENT_LIST_BY_USER_ID,
  FETCH_DEPARTMENT_ALL,
  FETCH_DEPARTMENT_LIST,
  FETCH_GENERAL_SETTINGS,
  FETCH_WHITELIST,
  GENERAL_SETTINGS_SUBMIT,
  UPDATE_WHITELIST,
} from "constants/ActionTypes";
import {
  getLivenessSettingService,
  updateLivenessSettingService,
} from "services/Liveness";
import {
  addDepartmentService,
  addNewBlackListService,
  addNewCategoryService,
  changeStatusBlackListService,
  checkValidateDepartmentNameService,
  deleteDepartmentService,
  fetchAllKybBlacklistService,
  fetchAllKycBlacklistService,
  fetchAllKycCategoryService,
  fetchAllKytBlacklistService,
  fetchKycBlackListFilterService,
  GeneralSettingsGetServices,
  GeneralSettingsSaveServices,
  getDepartmentAllService,
  getDepartmentListByUserIdService,
  getDepartmentService,
  getWhitelistService,
  removeBlackListService,
  updateCategoryBlackListService,
  updateDepartmentService,
  updateWhitelistService,
} from "../services/SettingService";
import { paginationParams } from "../util/sagas";

function* getGeneralSettings() {
  const response = yield call(GeneralSettingsGetServices);
  yield put(fetchGeneralSettings.success(response));
}

export function* getGeneralSettingsData() {
  yield takeLeading(FETCH_GENERAL_SETTINGS, getGeneralSettings);
}

function* saveGeneralSettings({ payload }) {
  const response = yield call(GeneralSettingsSaveServices, payload);
  yield put(submitGeneralSettings.success(response));
}

export function* saveGeneralSettingsData() {
  yield takeLeading(GENERAL_SETTINGS_SUBMIT, saveGeneralSettings);
}
function* getWhitelist({ payload }) {
  try {
    const response = yield call(getWhitelistService, payload);
    yield put(fetchWhitelistSuccess(response.data));
  } catch (err) {}
}

export function* getWhitelistData() {
  yield takeLeading(FETCH_WHITELIST, getWhitelist);
}
function* saveWhitelist({ payload }) {
  try {
    const response = yield call(updateWhitelistService, payload);
    if (response.status === 200) {
      yield put(updateWhitelistSuccess(response.data));
    } else {
      yield put(updateWhitelistFailed());
    }
  } catch (err) {
    yield put(updateWhitelistFailed());
  }
}

export function* updateWhitelistData() {
  yield takeLeading(UPDATE_WHITELIST, saveWhitelist);
}
/**
 * Fetch all blacklist
 */
function* fetchAllKycBlacklist({ payload }) {
  try {
    const { data } = yield call(fetchAllKycBlacklistService, payload);
    yield put(FETCH_ACTION_GET_KYC_BLACKLIST.success(data));
  } catch (err) {
    yield put(FETCH_ACTION_GET_KYC_BLACKLIST.error());
  }
}

export function* fetchAllKycBacklistSaga() {
  yield takeLeading(FETCH_ACTION_GET_KYC_BLACKLIST, fetchAllKycBlacklist);
}

function* fetchAllKybBlacklist({ payload }) {
  try {
    const { data } = yield call(fetchAllKybBlacklistService, payload);
    yield put(FETCH_ACTION_GET_KYB_BLACKLIST.success(data));
  } catch (err) {
    yield put(FETCH_ACTION_GET_KYB_BLACKLIST.error());
  }
}

export function* fetchAllKybBacklistSaga() {
  yield takeLeading(FETCH_ACTION_GET_KYB_BLACKLIST, fetchAllKybBlacklist);
}

function* fetchAllKytBlacklist({ payload }) {
  try {
    const { data } = yield call(fetchAllKytBlacklistService, payload);
    yield put(FETCH_ACTION_GET_KYT_BLACKLIST.success(data));
  } catch (err) {
    yield put(FETCH_ACTION_GET_KYT_BLACKLIST.error());
  }
}

export function* fetchAllKytBacklistSaga() {
  yield takeLeading(FETCH_ACTION_GET_KYT_BLACKLIST, fetchAllKytBlacklist);
}
/**
 * Fetch kyc category
 */

function* fetchAllKycCategory() {
  try {
    const { data } = yield call(fetchAllKycCategoryService);
    yield put(FETCH_ACTION_KYC_CATEGORY.success(data));
  } catch (err) {
    yield put(FETCH_ACTION_KYC_CATEGORY.error());
  }
}

export function* fetchAllKycCategorySaga() {
  yield takeLeading(FETCH_ACTION_KYC_CATEGORY, fetchAllKycCategory);
}
/**
 * Kyc filter
 */

function* fetchKycBlackListFilter({ payload }) {
  try {
    const { data } = yield call(fetchKycBlackListFilterService, payload);
    yield put(KYC_ACTION_GET_KYC_BLACKLIST_BY_FILTER.success(data));
  } catch (err) {
    yield put(KYC_ACTION_GET_KYC_BLACKLIST_BY_FILTER.error());
  }
}

export function* fetchKycBlackListFilterSaga() {
  yield takeLeading(
    KYC_ACTION_GET_KYC_BLACKLIST_BY_FILTER,
    fetchKycBlackListFilter
  );
}
/**
 * add new black list
 */
function* addNewBlackList({ payload }) {
  try {
    const { data } = yield call(addNewBlackListService, payload);
    yield put(ADD_NEW_BLACKLIST.success(data));
  } catch (err) {
    // let jsonParse = JSON.parse(
    //   JSON.stringify(err.response ? err.response.data : "")
    // );
    yield put(ADD_NEW_BLACKLIST.error(err));
  }
}

export function* addNewBlackListSaga() {
  yield takeLeading(ADD_NEW_BLACKLIST, addNewBlackList);
}

/**
 * Remove black list
 */
function* removeBlackList({ payload }) {
  try {
    const pagination = yield paginationParams();
    const { data } = yield call(removeBlackListService, payload);
    yield put(REMOVE_BLACKLIST_BY_ID.success(data));
    yield put(FETCH_ACTION_GET_KYC_BLACKLIST(pagination));
  } catch (err) {
    yield put(REMOVE_BLACKLIST_BY_ID.error());
  }
}

export function* removeBlackListSaga() {
  yield takeLeading(REMOVE_BLACKLIST_BY_ID, removeBlackList);
}
/**
 * Change status black list
 */
function* changeStatusBlackList({ payload }) {
  try {
    const pagination = yield paginationParams();
    const { data } = yield call(changeStatusBlackListService, payload);
    yield put(CHANGE_STATUS_BLACKLIST.success(data));
    yield put(FETCH_ACTION_GET_KYC_BLACKLIST(pagination));
  } catch (err) {
    yield put(CHANGE_STATUS_BLACKLIST.error());
  }
}

export function* changeStatusBlackListSaga() {
  yield takeLeading(CHANGE_STATUS_BLACKLIST, changeStatusBlackList);
}
/**
 * Update category blacklist
 */

function* updateCategoryBlacklist({ payload }) {
  try {
    const pagination = yield paginationParams();
    const { data } = yield call(updateCategoryBlackListService, payload);
    yield put(UPDATE_CATEGORY_BLACKLIST.success(data));
    yield put(FETCH_ACTION_GET_KYC_BLACKLIST(pagination));
  } catch (err) {
    yield put(UPDATE_CATEGORY_BLACKLIST.error());
  }
}

export function* updateCategoryBlacklistSaga() {
  yield takeLeading(UPDATE_CATEGORY_BLACKLIST, updateCategoryBlacklist);
}

/**
 * On press add new category
 */
function* addNewCategory({ payload }) {
  try {
    const { data } = yield call(addNewCategoryService, payload);
    yield put(ADD_NEW_CATEGORY.success(data));
    yield put(FETCH_ACTION_KYC_CATEGORY());
  } catch (err) {
    yield put(ADD_NEW_CATEGORY.error(err));
  }
}

export function* addNewCategorySaga() {
  yield takeLeading(ADD_NEW_CATEGORY, addNewCategory);
}
/**
 * Liveness setting
 */
function* updateLivenessSetting({ payload }) {
  try {
    const { data } = yield call(updateLivenessSettingService, payload);
    yield put(SUBMIT_LIVENESS_SETTING.success(data));
  } catch (err) {
    yield put(SUBMIT_LIVENESS_SETTING.error(err));
  }
}

export function* updateLivenessSettingSaga() {
  yield takeLeading(SUBMIT_LIVENESS_SETTING, updateLivenessSetting);
}
/**
 * Get Liveness setting
 */
function* getLivenessSetting({ payload }) {
  try {
    const { data } = yield call(getLivenessSettingService, payload);
    yield put(GET_LIVENESS_SETTING.success(data));
  } catch (err) {
    yield put(GET_LIVENESS_SETTING.error(err));
  }
}

export function* getLivenessSettingSaga() {
  yield takeLeading(GET_LIVENESS_SETTING, getLivenessSetting);
}
/**
 * Department setting
 */
function* getDepartmentList({ payload }) {
  try {
    const { data } = yield call(getDepartmentService, payload);
    yield put(fetchDepartmentListSuccess(data));
  } catch (err) {
    yield put(fetchDepartmentListFailed(err));
  }
}

export function* getDepartmentSaga() {
  yield takeLeading(FETCH_DEPARTMENT_LIST, getDepartmentList);
}

function* deleteDepartment({ payload }) {
  try {
    const { data } = yield call(deleteDepartmentService, payload);
    yield put(deleteDepartmentSuccess(data));
  } catch (err) {
    yield put(deleteDepartmentFailed(err));
  }
}

export function* deleteDepartmentSaga() {
  yield takeLeading(DELETE_DEPARTMENT, deleteDepartment);
}

function* getDepartmentListAll({ payload }) {
  try {
    const { data } = yield call(getDepartmentAllService, payload);
    yield put(fetchDepartmentListAllSuccess(data));
  } catch (err) {
    yield put(fetchDepartmentListAllFailed(err));
  }
}

export function* getDepartmentAllSaga() {
  yield takeLeading(FETCH_DEPARTMENT_ALL, getDepartmentListAll);
}

function* updateDepartment({ payload }) {
  try {
    const { status, data } = yield call(updateDepartmentService, payload);
    if (status === 200) {
      yield put(UPDATE_DEPARTMENT.success(data));
    }
  } catch (err) {
    yield put(UPDATE_DEPARTMENT.error(err));
  }
}

export function* updateDepartmentSaga() {
  yield takeLeading(UPDATE_DEPARTMENT, updateDepartment);
}
function* addDepartment({ payload }) {
  try {
    const { status, data } = yield call(addDepartmentService, payload);
    if (status === 200) {
      yield put(ADD_DEPARTMENT.success(data));
    }
  } catch (err) {
    yield put(ADD_DEPARTMENT.error(err));
  }
}

export function* addDepartmentSaga() {
  yield takeLeading(ADD_DEPARTMENT, addDepartment);
}

function* getDepartmentListByUserId({ payload }) {
  try {
    const { data } = yield call(getDepartmentListByUserIdService, payload);
    yield put(getDepartmentListByUserIdSuccess(data));
  } catch (err) {
    yield put(getDepartmentListByUserIdFailed(err));
  }
}

export function* getDepartmentListByUserIdSaga() {
  yield takeLeading(DEPARTMENT_LIST_BY_USER_ID, getDepartmentListByUserId);
}

function* checkValidateDepartmentName({ payload }) {
  try {
    const { data } = yield call(checkValidateDepartmentNameService, payload);
    yield put(checkValidateDepartmentNameSuccess(data));
  } catch (err) {}
}

export function* checkValidateDepartmentNameSaga() {
  yield takeLeading(
    CHECK_VALIDATE_DEPARTMENT_NAME,
    checkValidateDepartmentName
  );
}

export default function* SettingSaga() {
  yield combineRootSagas(
    getGeneralSettingsData,
    saveGeneralSettingsData,
    getWhitelistData,
    updateWhitelistData,
    fetchAllKybBacklistSaga,
    fetchAllKycBacklistSaga,
    fetchAllKytBacklistSaga,
    fetchAllKycCategorySaga,
    fetchKycBlackListFilterSaga,
    addNewBlackListSaga,
    removeBlackListSaga,
    changeStatusBlackListSaga,
    updateCategoryBlacklistSaga,
    addNewCategorySaga,
    updateLivenessSettingSaga,
    getLivenessSettingSaga,
    getDepartmentSaga,
    deleteDepartmentSaga,
    getDepartmentAllSaga,
    updateDepartmentSaga,
    addDepartmentSaga,
    getDepartmentListByUserIdSaga,
    checkValidateDepartmentNameSaga
  );
}
