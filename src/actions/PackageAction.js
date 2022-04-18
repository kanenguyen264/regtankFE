import {
  FETCH_ALL_PACKAGE,
  FETCH_ALL_PACKAGE_FAILED,
  FETCH_ALL_PACKAGE_SUCCESS,
  PACKAGE_UPGRADE,
  PACKAGE_UPGRADE_SUCCESS,
  SHOW_MESSAGE
} from "constants/ActionTypes";

export const fetchAllPackage = (data) => {
  return {
    type: FETCH_ALL_PACKAGE,
    payload: data
  };
};

export const fetchAllPackageSuccess = (response) => {
  return {
    type: FETCH_ALL_PACKAGE_SUCCESS,
    payload: response
  };
};

export const fetchAllPackageFailed = () => {
  return {
    type: FETCH_ALL_PACKAGE_FAILED
  };
};

export const showMessage = (message) => {
  return {
    type: SHOW_MESSAGE,
    payload: message
  };
};
export const packageUpgrade = (params) => {
  return {
    type: PACKAGE_UPGRADE,
    payload: params
  };
};

export const packageUpgradeSuccess = (response) => {
  return {
    type: PACKAGE_UPGRADE_SUCCESS,
    payload: response
  };
};
