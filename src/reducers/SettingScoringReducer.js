//@flow
import { createReducer } from "@reduxjs/toolkit";
import {
  SETTING_SCORING_ACTION_FETCH_ALL,
  SETTING_SCORING_ACTION_SEARCH,
  SETTING_SCORING_ACTION_DETAIL,
  SETTING_SCORING_ACTION_SAVE,
  SETTING_KYC_DETAIL,
  SETTING_KYT_DETAIL,
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
  SettingScoringArchiveAdapter,
  SettingDJScoringArchiveAdapter,
} from "../services/SettingService";
import { compose } from "redux";

const initialState = {
  archiveList: [],
  listSetting: [],
  detail: Object,
  detailUpdate: null,
  FATFDataCurrent: "",
  WeightSettingCurrent: "",
  OtherSettingCurrent: "",
  loading: false,
  settingKyc: null,
  settingKyt: null,
  settingKycActivity: null,
  settingKyb: {},
  settingKYCDJSearchType: {},
  listDJSetting: [],
  detailDj: Object,
};
const regExp = new RegExp(
    "^(" + ["djkyc-all"].map((s) => `setting/${s}`).join("|") + ")"
  ),
  resolveRegExp = /\/(success|error)$/;

function isLoadableAction(action) {
  return regExp.test(action.type);
}

const SettingScoringReducer = compose(
  SettingDJScoringArchiveAdapter.withArchiveReducer,
  SettingScoringArchiveAdapter.withArchiveReducer
)(
  createReducer(initialState, (builder) => {
    builder
      .addCase(SETTING_DJ_KYC_DETAIL_SAVE.success, (state, { payload }) => {
        state.settingKYCDJSearchType = payload;
      })
      .addCase(SETTING_DJ_KYC_DETAIL.success, (state, { payload }) => {
        state.settingKYCDJSearchType = payload;
      })
      .addCase(
        SETTING_SCORING_ACTION_FETCH_ALL.success,
        (state, { payload }) => {
          state.listSetting = payload;
        }
      )
      .addCase(SETTING_SCORING_ACTION_SAVE, (state, { payload }) => {
        state.detail = payload;
        state.loading = false;
      })
      .addCase(SETTING_SCORING_ACTION_SEARCH.success, (state, { payload }) => {
        state.listSetting = payload;
      })
      .addCase(SETTING_SCORING_ACTION_DETAIL.success, (state, { payload }) => {
        state.detail = payload;
      })
      .addCase(SETTING_KYC_DETAIL.success, (state, { payload }) => {
        state.settingKyc = payload;
      })
      .addCase(SETTING_KYB_DETAIL.success, (state, { payload }) => {
        state.settingKyb = payload;
      })
      .addCase(SETTING_KYT_DETAIL.success, (state, { payload }) => {
        state.settingKyt = payload;
      })
      .addCase(SETTING_KYC_ACTIVITY.success, (state, { payload }) => {
        state.settingKycActivity = payload.records;
      })
      .addCase(SETTING_KYB_DETAIL_SAVE.success, (state, { payload }) => {
        state.settingKyb = payload;
      })
      .addCase(
        SETTING_DJ_SCORING_ACTION_FETCH_ALL.success,
        (state, { payload }) => {
          state.listDJSetting = payload;
        }
      )
      .addCase(
        SETTING_DJ_SCORING_ACTION_DETAIL.success,
        (state, { payload }) => {
          state.detailDj = payload;
        }
      )
      .addCase(SETTING_DJ_SCORING_ACTION_SAVE, (state, { payload }) => {
        state.detailDj = payload;
        state.loading = false;
      })
      .addMatcher(isLoadableAction, (state, { type }) => {
        state.loading = !resolveRegExp.test(type);
      });
  })
);

export default SettingScoringReducer;
