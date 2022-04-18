import { createAwaitAction } from "@protego/sdk/actions/utils";
import {
  ADD_STAFF,
  ADD_STAFF_FAILED,
  ADD_STAFF_SUCCESS,
  DELETE_STAFF,
  DELETE_STAFF_FAILED,
  DELETE_STAFF_SUCCESS,
  FETCH_ALL_ADMIN,
  FETCH_ALL_ADMIN_FAILED,
  FETCH_ALL_ADMIN_SUCCESS,
  FETCH_ALL_STAFF,
  FETCH_ALL_STAFF_ACTIVE,
  FETCH_ALL_STAFF_ACTIVE_SUCCESS,
  FETCH_ALL_STAFF_FAILED,
  FETCH_ALL_STAFF_SUCCESS,
  FETCH_STAFF_FAILED,
  FETCH_STAFF_SUCCESS,
  HIDE_MESSAGE,
  SEARCH_STAFF_USER,
  SEARCH_STAFF_USER_FAILED,
  SEARCH_STAFF_USER_SUCCESS,
  SET_STAFF_LOCKED,
  SET_STAFF_LOCKED_FAILED,
  SET_STAFF_LOCKED_SUCCESS,
  SHOW_MESSAGE,
  STAFF_RESEND_ACTIVATION_LINK,
  STAFF_RESEND_ACTIVATION_LINK_FAILED,
  STAFF_RESEND_ACTIVATION_LINK_SUCCESS,
} from "constants/ActionTypes";

export const FETCH_STAFF = createAwaitAction("fetch_staff");

export const staffList = (staff) => {
  return {
    type: FETCH_STAFF,
    payload: staff,
  };
};

export const staffListSuccess = (response) => {
  return {
    type: FETCH_STAFF_SUCCESS,
    payload: response,
  };
};

export const staffListFailed = () => {
  return {
    type: FETCH_STAFF_FAILED,
  };
};

export const staffAllList = (staff) => {
  return {
    type: FETCH_ALL_STAFF,
    payload: staff,
  };
};

export const staffAllListSuccess = (response) => {
  return {
    type: FETCH_ALL_STAFF_SUCCESS,
    payload: response,
  };
};

export const staffAllListFailed = () => {
  return {
    type: FETCH_ALL_STAFF_FAILED,
  };
};

export const addNewStaffUser = (response, page, offset) => {
  return {
    type: ADD_STAFF,
    payload: response,
    page: page,
    offset: offset,
  };
};
export const addNewStaffUserSuccess = (response) => {
  return {
    type: ADD_STAFF_SUCCESS,
    payload: response,
  };
};
export const addNewStaffUserFailed = (response) => {
  return {
    type: ADD_STAFF_FAILED,
    payload: response,
  };
};

export const showMessage = (message) => {
  return {
    type: SHOW_MESSAGE,
    payload: message,
  };
};

export const STAFF_DETAIL = createAwaitAction("staff_detail");
export const EDIT_STAFF = createAwaitAction("staff_edit");
export const hideMessage = () => {
  return {
    type: HIDE_MESSAGE,
  };
};
export const deleteStaffUser = (response, query) => {
  return {
    type: DELETE_STAFF,
    payload: response,
    query,
  };
};
export const deleteStaffUserSuccess = (response) => {
  return {
    type: DELETE_STAFF_SUCCESS,
    payload: response,
  };
};
export const deleteStaffUserFailed = (response) => {
  return {
    type: DELETE_STAFF_FAILED,
    payload: response,
  };
};
export const setStaffLocked = (response, page, offset) => {
  return {
    type: SET_STAFF_LOCKED,
    payload: response,
    page: page,
    offset: offset,
  };
};
export const setStaffLockedSuccess = (response) => {
  return {
    type: SET_STAFF_LOCKED_SUCCESS,
    payload: response,
  };
};
export const setStaffLockedFailed = (response) => {
  return {
    type: SET_STAFF_LOCKED_FAILED,
    payload: response,
  };
};
export const searchStaffUser = (response, page, size) => {
  return {
    type: SEARCH_STAFF_USER,
    payload: response,
    page: page,
    size: size,
  };
};
export const searchStaffUserSuccess = (response) => {
  return {
    type: SEARCH_STAFF_USER_SUCCESS,
    payload: response,
  };
};

export const searchStaffUserFailed = (response) => {
  return {
    type: SEARCH_STAFF_USER_FAILED,
    payload: response,
  };
};
export const userResendActivation = (response) => {
  return {
    type: STAFF_RESEND_ACTIVATION_LINK,
    payload: response,
  };
};
export const userResendActivationSuccess = (response) => {
  return {
    type: STAFF_RESEND_ACTIVATION_LINK_SUCCESS,
    payload: response,
  };
};
export const userResendActivationFailed = (response) => {
  return {
    type: STAFF_RESEND_ACTIVATION_LINK_FAILED,
    payload: response,
  };
};
export const staffActiveAllList = (staff) => {
  return {
    type: FETCH_ALL_STAFF_ACTIVE,
    payload: staff,
  };
};

export const staffActiveAllListSuccess = (response) => {
  return {
    type: FETCH_ALL_STAFF_ACTIVE_SUCCESS,
    payload: response,
  };
};
/**
 * Get list admin
 */
export const getListAdmin = (staff) => {
  return {
    type: FETCH_ALL_ADMIN,
    payload: staff,
  };
};

export const getListAdminSuccess = (response) => {
  return {
    type: FETCH_ALL_ADMIN_SUCCESS,
    payload: response,
  };
};

export const getListAdminFailed = (response) => {
  return {
    type: FETCH_ALL_ADMIN_FAILED,
    payload: response,
  };
};
/**
 * Get list user assign
 */
export const GET_AVAILABLE_ASSIGN = createAwaitAction("GET_AVAILABLE_ASSIGN");
