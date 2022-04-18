//@flow
import { createReducer } from "@reduxjs/toolkit";
import {
  SETTING_ACL_GET_ALL,
  SETTING_ACL_GET_ONE,
  SETTING_ACL_UPDATE_ROLE
} from "actions/SettingACLAction";

const initialState = {
  ACLList: [],
  ACLDetail: null,
  loading: false
};

const regExp = new RegExp(
    "^(" + ["get-all", "get-one", "update-role"].map((s) => `setting-acl/${s}`).join("|") + ")"
  ),
  resolveRegExp = /\/(success|error)$/;

function isLoadableAction(action) {
  return regExp.test(action.type);
}

const SettingACLReducer =
  // main reducer
  createReducer(initialState, (builder) => {
    builder
      .addCase(SETTING_ACL_GET_ALL.success, (state, { payload }) => {
        state.ACLList = payload.data;
      })
      .addCase(SETTING_ACL_GET_ONE.success, (state, { payload }) => {
        state.ACLDetail = payload.data;
      })
      .addCase(SETTING_ACL_UPDATE_ROLE.success, (state, { payload }) => {
        state.ACLDetail = payload.data;
      })
      .addMatcher(isLoadableAction, (state, { type }) => {
        state.loading = !resolveRegExp.test(type);
      });
  });

export default SettingACLReducer;
