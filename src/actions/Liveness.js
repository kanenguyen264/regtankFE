import {
  FETCH_ALL_LIVENESS,
  FETCH_ALL_LIVENESS_SUCCESS,
  FETCH_ALL_LIVENESS_FAILED,
  LIVENESS_RESENT_REQUEST,
  LIVENESS_REQUEST_DETAIL,
  LIVENESS_REQUEST_DETAIL_SUCCESS,
  SHOW_TOAST_MESSAGE,
  HIDE_TOAST_MESSAGE,
} from "../constants/ActionTypes";

export const fetchAllLivenessRequest = (data) => {
  return {
    type: FETCH_ALL_LIVENESS,
    payload: data,
  };
};

export const fetchAllLivenessSuccess = (response) => {
  return {
    type: FETCH_ALL_LIVENESS_SUCCESS,
    payload: response,
  };
};

export const fetchAllLivenessFailed = () => {
  return {
    type: FETCH_ALL_LIVENESS_FAILED,
  };
};

export const resentRequest = (id) => {
  return {
    type: LIVENESS_RESENT_REQUEST,
    payload: id,
  };
};

export const fetchLivenessRequestDetail = (requestId, history) => {
  return {
    type: LIVENESS_REQUEST_DETAIL,
    payload: requestId,
    history: history,
  };
};

export const getRequestDetailSuccess = (response) => {
  return {
    type: LIVENESS_REQUEST_DETAIL_SUCCESS,
    payload: response,
  };
};

export const showToastMessage = (content, type = "") => ({
  type: SHOW_TOAST_MESSAGE,
  payload: { content, type },
});

export const hideToastMessage = () => ({
  type: HIDE_TOAST_MESSAGE,
});
