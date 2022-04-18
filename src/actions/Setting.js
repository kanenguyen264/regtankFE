import {
  CHANGE_DIRECTION,
  CHANGE_NAVIGATION_STYLE,
  DARK_THEME,
  DRAWER_TYPE,
  HORIZONTAL_MENU_POSITION,
  SWITCH_LANGUAGE,
  THEME_COLOR,
  TOGGLE_COLLAPSED_NAV,
  WINDOW_WIDTH,
  FLAG_DRAWER_TYPE,
  FETCH_GENERAL_SETTINGS,
  FETCH_GENERAL_SETTINGS_SUCCESS,
  GENERAL_SETTINGS_SUBMIT,
  GENERAL_SETTINGS_SUBMIT_SUCCESS,
  FETCH_WHITELIST,
  FETCH_WHITELIST_SUCCESS,
  FETCH_WHITELIST_FAILED,
  UPDATE_WHITELIST,
  UPDATE_WHITELIST_SUCCESS,
  UPDATE_WHITELIST_FAILED,
  HIDE_MESSAGE,
  FETCH_ALL_ACL,
  FETCH_ALL_ACL_SUCCESS,
  FETCH_ACL,
  FETCH_ACL_SUCCESS,
  FETCH_DEPARTMENT_LIST,
  FETCH_DEPARTMENT_LIST_SUCCESS,
  FETCH_DEPARTMENT_LIST_FAILED,
  DELETE_DEPARTMENT,
  DELETE_DEPARTMENT_SUCCESS,
  DELETE_DEPARTMENT_FAILED,
  FETCH_DEPARTMENT_ALL,
  FETCH_DEPARTMENT_ALL_SUCCESS,
  FETCH_DEPARTMENT_ALL_FAILED,
  DETAIL_DEPARTMENT,
  DETAIL_DEPARTMENT_SUCCESS,
  DETAIL_DEPARTMENT_FAILED,
  DEPARTMENT_LIST_BY_USER_ID,
  DEPARTMENT_LIST_BY_USER_ID_SUCCESS,
  DEPARTMENT_LIST_BY_USER_ID_FAILED,
  CHECK_VALIDATE_DEPARTMENT_NAME,
  CHECK_VALIDATE_DEPARTMENT_NAME_SUCCESS,
  CHECK_VALIDATE_DEPARTMENT_NAME_FAILED,
} from "constants/ActionTypes";
import { createAwaitAction } from "@protego/sdk/actions/utils";

export function toggleCollapsedNav(isNavCollapsed) {
  return { type: TOGGLE_COLLAPSED_NAV, isNavCollapsed };
}

export function setDrawerType(drawerType, from) {
  return { type: DRAWER_TYPE, drawerType, from };
}
export function setFlagDrawer(current) {
  return { type: FLAG_DRAWER_TYPE, current };
}

export function updateWindowWidth(width) {
  return { type: WINDOW_WIDTH, width };
}

export function setThemeColor(color) {
  return { type: THEME_COLOR, color };
}

export function setDarkTheme() {
  return { type: DARK_THEME };
}

export function changeDirection() {
  return { type: CHANGE_DIRECTION };
}

export function changeNavigationStyle(layoutType) {
  return {
    type: CHANGE_NAVIGATION_STYLE,
    payload: layoutType,
  };
}

export function setHorizontalMenuPosition(navigationPosition) {
  return {
    type: HORIZONTAL_MENU_POSITION,
    payload: navigationPosition,
  };
}

export function switchLanguage(locale) {
  return {
    type: SWITCH_LANGUAGE,
    payload: locale,
  };
}

export const fetchGeneralSettings = createAwaitAction(FETCH_GENERAL_SETTINGS);

export const fetchGeneralSettingsSuccess = (response) => {
  return {
    type: FETCH_GENERAL_SETTINGS_SUCCESS,
    payload: response,
  };
};

export const fetchAllACL = createAwaitAction(FETCH_ALL_ACL);

export const fetchAllACLSuccess = (response) => {
  return {
    type: FETCH_ALL_ACL_SUCCESS,
    payload: response,
  };
};

export const fetchACL = (id) => {
  return {
    type: FETCH_ACL,
    payload: id,
  };
};

export const fetchACLSuccess = (response) => {
  return {
    type: FETCH_ACL_SUCCESS,
    payload: response,
  };
};

export const submitGeneralSettings = createAwaitAction(GENERAL_SETTINGS_SUBMIT);

export const submitGeneralSettingsSuccess = (response) => {
  return {
    type: GENERAL_SETTINGS_SUBMIT_SUCCESS,
    payload: response,
  };
};
export const fetchWhitelist = (whitelist) => {
  return {
    type: FETCH_WHITELIST,
    payload: whitelist,
  };
};

export const fetchWhitelistSuccess = (response) => {
  return {
    type: FETCH_WHITELIST_SUCCESS,
    payload: response,
  };
};

export const fetchWhitelistListFailed = () => {
  return {
    type: FETCH_WHITELIST_FAILED,
  };
};

export const updateWhitelist = (whitelist) => {
  return {
    type: UPDATE_WHITELIST,
    payload: whitelist,
  };
};

export const updateWhitelistSuccess = (response) => {
  return {
    type: UPDATE_WHITELIST_SUCCESS,
    payload: response,
  };
};

export const updateWhitelistFailed = () => {
  return {
    type: UPDATE_WHITELIST_FAILED,
  };
};
export const hideMessage = () => {
  return {
    type: HIDE_MESSAGE,
  };
};
/**
 * department
 */
export const fetchDepartmentList = (staff) => {
  return {
    type: FETCH_DEPARTMENT_LIST,
    payload: staff,
  };
};

export const fetchDepartmentListSuccess = (response) => {
  return {
    type: FETCH_DEPARTMENT_LIST_SUCCESS,
    payload: response,
  };
};

export const fetchDepartmentListFailed = () => {
  return {
    type: FETCH_DEPARTMENT_LIST_FAILED,
  };
};

export const deleteDepartment = (data) => {
  return {
    type: DELETE_DEPARTMENT,
    payload: data,
  };
};

export const deleteDepartmentSuccess = (response) => {
  return {
    type: DELETE_DEPARTMENT_SUCCESS,
    payload: response,
  };
};

export const deleteDepartmentFailed = () => {
  return {
    type: DELETE_DEPARTMENT_FAILED,
  };
};

export const fetchDepartmentListAll = (data) => {
  return {
    type: FETCH_DEPARTMENT_ALL,
    payload: data,
  };
};

export const fetchDepartmentListAllSuccess = (response) => {
  return {
    type: FETCH_DEPARTMENT_ALL_SUCCESS,
    payload: response,
  };
};

export const fetchDepartmentListAllFailed = () => {
  return {
    type: FETCH_DEPARTMENT_ALL_FAILED,
  };
};

export const ADD_DEPARTMENT = createAwaitAction("ADD_DEPARTMENT");
export const UPDATE_DEPARTMENT = createAwaitAction("UPDATE_DEPARTMENT");

export const detailDepartment = (data) => {
  return {
    type: DETAIL_DEPARTMENT,
    payload: data,
  };
};
export const detailDepartmentSuccess = (response) => {
  return {
    type: DETAIL_DEPARTMENT_SUCCESS,
    payload: response,
  };
};

export const detailDepartmentFailed = () => {
  return {
    type: DETAIL_DEPARTMENT_FAILED,
  };
};

export const getDepartmentListByUserId = (data) => {
  return {
    type: DEPARTMENT_LIST_BY_USER_ID,
    payload: data,
  };
};
export const getDepartmentListByUserIdSuccess = (response) => {
  return {
    type: DEPARTMENT_LIST_BY_USER_ID_SUCCESS,
    payload: response,
  };
};

export const getDepartmentListByUserIdFailed = () => {
  return {
    type: DEPARTMENT_LIST_BY_USER_ID_FAILED,
  };
};

export const checkValidateDepartmentName = (data) => {
  return {
    type: CHECK_VALIDATE_DEPARTMENT_NAME,
    payload: data,
  };
};
export const checkValidateDepartmentNameSuccess = (response) => {
  return {
    type: CHECK_VALIDATE_DEPARTMENT_NAME_SUCCESS,
    payload: response,
  };
};

export const checkValidateDepartmentNameFailed = () => {
  return {
    type: CHECK_VALIDATE_DEPARTMENT_NAME_FAILED,
  };
};

/**
 * Black list
 */

export const FETCH_ACTION_GET_KYC_BLACKLIST = createAwaitAction(
  "FETCH_ACTION_GET_KYC_BLACKLIST"
);

export const FETCH_ACTION_GET_KYB_BLACKLIST = createAwaitAction(
  "FETCH_ACTION_GET_KYB_BLACKLIST"
);

export const FETCH_ACTION_GET_KYT_BLACKLIST = createAwaitAction(
  "FETCH_ACTION_GET_KYT_BLACKLIST"
);

export const FETCH_ACTION_KYC_CATEGORY = createAwaitAction(
  "FETCH_ACTION_KYC_CATEGORY"
);
export const KYC_ACTION_GET_KYC_BLACKLIST_BY_FILTER = createAwaitAction(
  "KYC_ACTION_GET_KYC_BLACKLIST_BY_FILTER"
);
export const ADD_NEW_BLACKLIST = createAwaitAction("ADD_NEW_BLACKLIST");
export const REMOVE_BLACKLIST_BY_ID = createAwaitAction(
  "REMOVE_BLACKLIST_BY_ID"
);

export const CHANGE_STATUS_BLACKLIST = createAwaitAction(
  "CHANGE_STATUS_BLACKLIST"
);
export const UPDATE_CATEGORY_BLACKLIST = createAwaitAction(
  "UPDATE_CATEGORY_BLACKLIST"
);

export const ADD_NEW_CATEGORY = createAwaitAction("ADD_NEW_CATEGORY");
export const SUBMIT_LIVENESS_SETTING = createAwaitAction(
  "SUBMIT_LIVENESS_SETTING"
);

export const GET_LIVENESS_SETTING = createAwaitAction("GET_LIVENESS_SETTING");
