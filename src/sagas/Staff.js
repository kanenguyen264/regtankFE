import { combineRootSagas } from "@protego/sdk/sagas/utils";
import { takeLeading } from "@redux-saga/core/effects";
import {
  addNewStaffUserFailed,
  addNewStaffUserSuccess,
  deleteStaffUserFailed,
  deleteStaffUserSuccess,
  EDIT_STAFF,
  FETCH_STAFF,
  getListAdminFailed,
  getListAdminSuccess,
  GET_AVAILABLE_ASSIGN,
  setStaffLockedFailed,
  setStaffLockedSuccess,
  showMessage,
  staffActiveAllListSuccess,
  staffAllListSuccess,
  STAFF_DETAIL,
  userResendActivationFailed,
  userResendActivationSuccess,
} from "actions/Staff";
import {
  ADD_STAFF,
  DELETE_STAFF,
  FETCH_ALL_ADMIN,
  FETCH_ALL_STAFF,
  FETCH_ALL_STAFF_ACTIVE,
  SEARCH_STAFF_USER,
  SET_STAFF_LOCKED,
  STAFF_RESEND_ACTIVATION_LINK,
} from "constants/ActionTypes";
import { call, put, select, takeEvery } from "redux-saga/effects";
import {
  addStaffService,
  deleteStaffService,
  editStaffService,
  getAllListStaffActiveService,
  getAllListStaffService,
  getAvailableAssignService,
  getListAdminService,
  getListStaffService,
  searchStaffService,
  setStaffLockedService,
  staffDetailService,
  staffResendActivationService,
} from "../services/staff";

/**
 *  Get list staff
 */
function* getStaff({ payload }) {
  try {
    const { data } = yield call(getListStaffService, payload);
    yield put(FETCH_STAFF.success(data));
  } catch (err) {
    yield put(FETCH_STAFF.error(err));
  }
}

export function* getListStaff() {
  yield takeLeading(FETCH_STAFF, getStaff);
}
/**
 *  Get all list staff
 */
function* getAllStaff({ payload }) {
  try {
    const response = yield call(getAllListStaffService, payload);
    yield put(staffAllListSuccess(response.data));
  } catch (err) {
    let jsonParse = JSON.parse(
      JSON.stringify(err.response ? err.response.data : "")
    );
    yield put(showMessage(jsonParse.message ? jsonParse.message : ""));
  }
}

export function* getAllListStaff() {
  yield takeLeading(FETCH_ALL_STAFF, getAllStaff);
}
/**
 *  Get all list staff active
 */
function* getAllStaffActive({ payload }) {
  try {
    const response = yield call(getAllListStaffActiveService, payload);
    yield put(staffActiveAllListSuccess(response.data));
  } catch (err) {
    let jsonParse = JSON.parse(
      JSON.stringify(err.response ? err.response.data : "")
    );
    yield put(showMessage(jsonParse.message ? jsonParse.message : ""));
  }
}

export function* getAllListStaffActive() {
  yield takeLeading(FETCH_ALL_STAFF_ACTIVE, getAllStaffActive);
}
/**
 *  Add new staff
 */
function* addStaffUser({ payload, page, offset }) {
  try {
    const response = yield call(addStaffService, payload);
    if (response.status === 200) {
      yield put(FETCH_STAFF());
      yield put(addNewStaffUserSuccess());
      yield put(showMessage());
    }
  } catch (err) {
    let jsonParse = JSON.parse(
      JSON.stringify(err.response ? err.response.data : "")
    );
    yield put(
      addNewStaffUserFailed(jsonParse.message ? jsonParse.message : "")
    );
    yield put(showMessage());
  }
}

export function* addStaffSaga() {
  yield takeEvery(ADD_STAFF, addStaffUser);
}

/**
 * Staff detail
 */

function* staffDetailUser({ payload }) {
  try {
    const response = yield call(staffDetailService, payload);
    yield put(STAFF_DETAIL.success(response));
  } catch (err) {
    let jsonParse = JSON.parse(
      JSON.stringify(err.response ? err.response.data : "")
    );
    yield put(STAFF_DETAIL.error(jsonParse?.message));
  }
}

export function* getStaffDetail() {
  yield takeEvery(STAFF_DETAIL, staffDetailUser);
}

/**
 * Staff edit
 */

function* editStaffUser({ payload }) {
  try {
    const response = yield call(editStaffService, payload);
    if (response.status === 200) {
      yield put(EDIT_STAFF.success(response));
    }
  } catch (err) {
    yield put(EDIT_STAFF.error(err));
  }
}

export function* editStaff() {
  yield takeEvery(EDIT_STAFF, editStaffUser);
}
/**
 *  Delete staff
 */
function* deleteStaffUser({ payload, query }) {
  try {
    const response = yield call(deleteStaffService, payload);
    yield put(FETCH_STAFF(query));
    yield put(deleteStaffUserSuccess(response));
    if (response.status === 200) {
      yield put(showMessage());
    }
  } catch (err) {
    let jsonParse = JSON.parse(
      JSON.stringify(err.response ? err.response.data : "")
    );
    yield put(
      deleteStaffUserFailed(jsonParse.message ? jsonParse.message : "")
    );
    yield put(showMessage());
  }
}

export function* deleteStaff() {
  yield takeEvery(DELETE_STAFF, deleteStaffUser);
}

function* setStaffLockedUser({ payload }) {
  try {
    const response = yield call(setStaffLockedService, payload);
    const state = yield select();
    if (response.status === 200) {
      const { staff } = state;
      let newListStaff = staff.listStaff.map((item) => {
        return item.id === response.data.id ? response.data : item;
      });
      yield put(setStaffLockedSuccess(newListStaff));
    }
  } catch (error) {
    let jsonParse = JSON.parse(JSON.stringify(error));
    yield put(setStaffLockedFailed(jsonParse.message ? jsonParse.message : ""));
    yield put(showMessage());
  }
}

export function* setStaffLocked() {
  yield takeEvery(SET_STAFF_LOCKED, setStaffLockedUser);
}

function* searchStaffUser({ payload, page, size }) {
  if (payload.length > 0) {
    const response = yield call(searchStaffService, {
      page,
      size,
      sort: "",
      search: payload,
    });
    yield put(FETCH_STAFF.success(response.data));
  } else {
    yield put(FETCH_STAFF({ page: page, size: size, sort: "", search: "" }));
  }
}

export function* searchStaff() {
  yield takeEvery(SEARCH_STAFF_USER, searchStaffUser);
}
/**
 * Staff edit
 */

function* userResendActivation({ payload }) {
  try {
    yield call(staffResendActivationService, payload.id);
    yield put(userResendActivationSuccess(payload));
  } catch (err) {
    yield put(userResendActivationFailed(err));
  }
}

export function* staffResendActivation() {
  yield takeEvery(STAFF_RESEND_ACTIVATION_LINK, userResendActivation);
}
/**
 * Get list admin
 */

function* getListAdminRequest({ payload: { params } }) {
  try {
    const response = yield call(getListAdminService, params);
    yield put(getListAdminSuccess(response));
  } catch (err) {
    yield put(getListAdminFailed(err));
  }
}

export function* getListAdminSaga() {
  yield takeEvery(FETCH_ALL_ADMIN, getListAdminRequest);
}

/**
 * Get available assign
 */

function* getAvailableAssign({ payload: { params } }) {
  try {
    const { data } = yield call(getAvailableAssignService, params);
    yield put(GET_AVAILABLE_ASSIGN.success(data));
  } catch (e) {
    yield put(GET_AVAILABLE_ASSIGN.error(e));
  }
}

export function* getAvailableAssignSaga() {
  yield takeLeading(GET_AVAILABLE_ASSIGN, getAvailableAssign);
}

export default function* rootSaga() {
  yield combineRootSagas(
    getListStaff,
    addStaffSaga,
    getStaffDetail,
    editStaff,
    deleteStaff,
    setStaffLocked,
    searchStaff,
    getAllListStaff,
    staffResendActivation,
    getAllListStaffActive,
    getListAdminSaga,
    getAvailableAssignSaga
  );
}
