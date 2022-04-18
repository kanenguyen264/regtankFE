import {
  SHOW_MESSAGE,
  FETCH_ALL_AUDIT,
  FETCH_ALL_AUDIT_SUCCESS,
  FETCH_ALL_AUDIT_FAILED,
  FILTER_AUDIT
} from "constants/ActionTypes";
import {
  FILTER_AUDIT_FAILED,
  FILTER_AUDIT_SUCCESS
} from "../constants/ActionTypes";
export const fetchAllAudit = (data) => {
  return {
    type: FETCH_ALL_AUDIT,
    payload: data
  };
};

export const fetchAllAuditSuccess = (response) => {
  return {
    type: FETCH_ALL_AUDIT_SUCCESS,
    payload: response
  };
};

export const fetchAllAuditFailed = () => {
  return {
    type: FETCH_ALL_AUDIT_FAILED
  };
};
export const showMessage = (message) => {
  return {
    type: SHOW_MESSAGE,
    payload: message
  };
};

export const filterAudit = (payload) => {
  return {
    type: FILTER_AUDIT,
    payload: payload
  };
};
export const filterAuditSuccess = (payload) => {
  return {
    type: FILTER_AUDIT_SUCCESS,
    payload: payload
  };
};

export const filterAuditFailed = (payload) => {
  return {
    type: FILTER_AUDIT_FAILED,
    payload: payload
  };
};
