import { combineRootSagas } from "@protego/sdk/sagas/utils";
import { call, put, takeLatest, takeLeading } from "@redux-saga/core/effects";
import { push } from "connected-react-router";
import { generatePath } from "@protego/sdk/utils/router";
import { SETTING_ACL_LIST } from "constants/routes";
import {
  SETTING_ACL_GET_ALL,
  SETTING_ACL_GET_ONE,
  SETTING_ACL_UPDATE_ROLE,
} from "actions/SettingACLAction";
import {
  getAllACLService,
  getACLService,
  updateACL,
} from "../services/SettingService";

function* getAllACL({ payload }) {
  try {
    const response = yield call(getAllACLService, payload);
    yield response |> SETTING_ACL_GET_ALL.success |> put;
  } catch (e) {
    yield e |> SETTING_ACL_GET_ALL.error |> put;
  }
}

function* getAllACLData() {
  yield takeLeading(SETTING_ACL_GET_ALL, getAllACL);
}

function* getACL({ payload: id }) {
  try {
    const response = yield call(getACLService, id);
    yield response |> SETTING_ACL_GET_ONE.success |> put;
  } catch (e) {
    yield e |> SETTING_ACL_GET_ONE.error |> put;
  }
}

function* getACLData() {
  yield takeLatest(SETTING_ACL_GET_ONE, getACL);
}

function* updateRole({ payload }) {
  try {
    const response = yield call(updateACL, payload);
    yield response |> SETTING_ACL_UPDATE_ROLE.success |> put;
    yield push(generatePath(SETTING_ACL_LIST)) |> put;
  } catch (e) {
    yield e |> SETTING_ACL_UPDATE_ROLE.error |> put;
  }
}

function* updateRoleRequest() {
  yield takeLatest(SETTING_ACL_UPDATE_ROLE, updateRole);
}

export default function* rootSaga() {
  yield combineRootSagas(getAllACLData, getACLData, updateRoleRequest);
}
