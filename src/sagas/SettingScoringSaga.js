import { combineRootSagas } from "@protego/sdk/sagas/utils";
import { call, put, takeLatest } from "@redux-saga/core/effects";
import {
  SETTING_KYC_DETAIL,
  SETTING_KYC_DETAIL_SAVE,
  SETTING_KYT_DETAIL,
  SETTING_KYT_DETAIL_SAVE,
  SETTING_SCORING_ACTION_DETAIL,
  SETTING_SCORING_ACTION_FETCH_ALL,
  SETTING_SCORING_ACTION_SAVE,
  SETTING_SCORING_ACTION_SEARCH,
  SETTING_KYC_ACTIVITY,
  SETTING_KYB_DETAIL,
  SETTING_KYB_DETAIL_SAVE,
  SETTING_DJ_KYC_DETAIL,
  SETTING_DJ_KYC_DETAIL_SAVE,
  SETTING_DJ_SCORING_ACTION_FETCH_ALL,
  SETTING_DJ_SCORING_ACTION_DETAIL,
  SETTING_DJ_SCORING_ACTION_SAVE,
} from "actions/SettingScoringAction";
import {
  SettingKycDetailSaveService,
  SettingKycDetailService,
  SettingKytDetailSaveService,
  SettingKytDetailService,
  SettingScoringService_Detail,
  SettingScoringService_RequestList,
  SettingScoringService_Save,
  SettingScoringService_Search,
  SettingKycActivityService,
  SettingScoringArchiveAdapter,
  SettingKybDetailService,
  SettingKybDetailSaveService,
  SettingDjKycDetailService,
  SettingDjKycDetailSaveService,
  SettingDJScoringService_RequestList,
  SettingDJScoringArchiveAdapter,
  SettingDjScoringService_Detail,
  SettingDJScoringService_Save
} from "../services/SettingService";

function* requestList({ payload }) {
  try {
    const { data } = yield call(SettingScoringService_RequestList, payload);
    yield data |> SETTING_SCORING_ACTION_FETCH_ALL.success |> put;
  } catch (e) {
    yield e |> SETTING_SCORING_ACTION_FETCH_ALL.error |> put;
  }
}
function* SettingScoringRequestList() {
  yield takeLatest(SETTING_SCORING_ACTION_FETCH_ALL, requestList);
}

function* requestListSearch({ payload: { search, params = {} } = {} }) {
  try {
    const { data } = yield call(SettingScoringService_Search, search, params);
    yield data |> SETTING_SCORING_ACTION_SEARCH.success |> put;
  } catch (e) {
    yield e |> SETTING_SCORING_ACTION_SEARCH.error |> put;
  }
}
function* SettingScoringRequestSearch() {
  yield takeLatest(SETTING_SCORING_ACTION_SEARCH, requestListSearch);
}

function* requestDetail({ payload: id }) {
  try {
    const { data } = yield call(SettingScoringService_Detail, id);
    yield data |> SETTING_SCORING_ACTION_DETAIL.success |> put;
  } catch (e) {
    yield e |> SETTING_SCORING_ACTION_DETAIL.error |> put;
  }
}
function* SettingScoringRequestDetail() {
  yield takeLatest(SETTING_SCORING_ACTION_DETAIL, requestDetail);
}

function* requestSave({ payload: setting }) {
  try {
    const { data } = yield call(SettingScoringService_Save, setting);
    yield data |> SETTING_SCORING_ACTION_SAVE.success |> put;
  } catch (e) {
    yield e |> SETTING_SCORING_ACTION_SAVE.error |> put;
  }
}
function* SettingScoringRequestSave() {
  yield takeLatest(SETTING_SCORING_ACTION_SAVE, requestSave);
}
/**
 * Setting kyc detail
 */
function* settingKyc({ payload }) {
  try {
    const { data } = yield call(SettingKycDetailService);
    yield data |> SETTING_KYC_DETAIL.success |> put;
  } catch (e) {
    yield e |> SETTING_KYC_DETAIL.error |> put;
  }
}
function* SettingKYCDetailRequest() {
  yield takeLatest(SETTING_KYC_DETAIL, settingKyc);
}
/**
 * Setting dj kyc detail
 */
function* settingDJKyc({ payload }) {
  try {
    const { data } = yield call(SettingDjKycDetailService);
    yield data |> SETTING_DJ_KYC_DETAIL.success |> put;
  } catch (e) {
    yield e |> SETTING_DJ_KYC_DETAIL.error |> put;
  }
}
function* SettingDJKYCDetailRequest() {
  yield takeLatest(SETTING_DJ_KYC_DETAIL, settingDJKyc);
}

function* settingKycSave({ payload }) {
  try {
    const { data } = yield call(SettingKycDetailSaveService, payload);
    yield data |> SETTING_KYC_DETAIL_SAVE.success |> put;
  } catch (e) {
    yield e |> SETTING_KYC_DETAIL_SAVE.error |> put;
  }
}
function* SettingKYCDetailRequestSave() {
  yield takeLatest(SETTING_KYC_DETAIL_SAVE, settingKycSave);
}

// dj KYC
function* settingDjKycSave({ payload }) {
  try {
    const { data } = yield call(SettingDjKycDetailSaveService, payload);
    yield data |> SETTING_DJ_KYC_DETAIL_SAVE.success |> put;
  } catch (e) {
    yield e |> SETTING_DJ_KYC_DETAIL_SAVE.error |> put;
  }
}
function* SettingDJKYCDetailRequestSave() {
  yield takeLatest(SETTING_DJ_KYC_DETAIL_SAVE, settingDjKycSave);
}
/**
 * Setting kyb detail
 */
function* settingKyb({ payload }) {
  try {
    const { data } = yield call(SettingKybDetailService);
    yield data |> SETTING_KYB_DETAIL.success |> put;
  } catch (e) {
    yield e |> SETTING_KYB_DETAIL.error |> put;
  }
}
function* SettingKYBDetailRequest() {
  yield takeLatest(SETTING_KYB_DETAIL, settingKyb);
}
function* settingKybSave({ payload }) {
  try {
    const { data } = yield call(SettingKybDetailSaveService, payload);
    yield data |> SETTING_KYB_DETAIL_SAVE.success |> put;
  } catch (e) {
    yield e |> SETTING_KYB_DETAIL_SAVE.error |> put;
  }
}
function* SettingKYBDetailRequestSave() {
  yield takeLatest(SETTING_KYB_DETAIL_SAVE, settingKybSave);
}
/**
 * Setting kyt detail
 */
function* settingKyt({ payload }) {
  try {
    const { data } = yield call(SettingKytDetailService);
    yield data |> SETTING_KYT_DETAIL.success |> put;
  } catch (e) {
    yield e |> SETTING_KYT_DETAIL.error |> put;
  }
}
function* SettingKYTDetailRequest() {
  yield takeLatest(SETTING_KYT_DETAIL, settingKyt);
}

function* settingKytSave({ payload }) {
  try {
    const data = yield call(
      SettingKytDetailSaveService,
      payload.settingKytSubmit
    );
    yield data |> SETTING_KYT_DETAIL_SAVE.success |> put;
  } catch (e) {
    yield e |> SETTING_KYT_DETAIL_SAVE.error |> put;
  }
}
function* SettingKYTDetailRequestSave() {
  yield takeLatest(SETTING_KYT_DETAIL_SAVE, settingKytSave);
}
/**
 * Setting kyc activity
 */
function* settingKycActivity({ payload }) {
  try {
    const { data } = yield call(SettingKycActivityService, payload);
    yield data |> SETTING_KYC_ACTIVITY.success |> put;
  } catch (e) {
    yield e |> SETTING_KYC_ACTIVITY.error |> put;
  }
}
function* SettingKYCActivityRequest() {
  yield takeLatest(SETTING_KYC_ACTIVITY, settingKycActivity);
}
/**
 * Setting scoring dj
 */
function* requestDJList({ payload }) {
  try {
    const { data } = yield call(SettingDJScoringService_RequestList, payload);
    yield put(SETTING_DJ_SCORING_ACTION_FETCH_ALL.success(data));
  } catch (e) {
    yield put(SETTING_DJ_SCORING_ACTION_FETCH_ALL.error, e);
  }
}
function* SettingDJScoringRequestList() {
  yield takeLatest(SETTING_DJ_SCORING_ACTION_FETCH_ALL, requestDJList);
}

 function* requestDjDetail({ payload: id }) {
  try {
    const { data } = yield call(SettingDjScoringService_Detail, id);
    yield data |> SETTING_DJ_SCORING_ACTION_DETAIL.success |> put;
  } catch (e) {
    yield e |> SETTING_DJ_SCORING_ACTION_DETAIL.error |> put;
  }
}
function* SettingDjScoringRequestDetail() {
  yield takeLatest(SETTING_DJ_SCORING_ACTION_DETAIL, requestDjDetail);
}

function* requestDjSave({ payload: setting }) {
  try {
    const { data } = yield call(SettingDJScoringService_Save, setting);
    yield data |> SETTING_DJ_SCORING_ACTION_SAVE.success |> put;
  } catch (e) {
    yield e |> SETTING_DJ_SCORING_ACTION_SAVE.error |> put;
  }
}
function* SettingDjScoringRequestSave() {
  yield takeLatest(SETTING_DJ_SCORING_ACTION_SAVE, requestDjSave);
}

export default function* rootSaga() {
  yield combineRootSagas(
    SettingScoringRequestList,
    SettingScoringRequestSearch,
    SettingScoringRequestDetail,
    SettingScoringRequestSave,
    SettingKYCDetailRequest,
    SettingKYTDetailRequest,
    SettingKYCDetailRequestSave,
    SettingKYTDetailRequestSave,
    SettingKYCActivityRequest,
    SettingScoringArchiveAdapter.saga,
    SettingKYBDetailRequest,
    SettingKYBDetailRequestSave,
    SettingDJKYCDetailRequest,
    SettingDjScoringRequestDetail,
    SettingDjScoringRequestSave,
    SettingDJKYCDetailRequestSave,
    SettingDJScoringRequestList,
    SettingDJScoringArchiveAdapter.saga
  );
}
