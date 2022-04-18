import {
  API_ACTION_ERROR,
  API_ACTION_GET,
  API_ACTION_POST,
  API_ACTION_SUCCESS
} from "../constants/ActionTypes";
import {
  WAIT_FOR_ACTION,
  ERROR_ACTION,
  CALLBACK_ARGUMENT
} from "redux-wait-for-action";

export const ApiActionGet = (url, auth = true) => ({
  type: API_ACTION_GET,
  url,
  auth,
  [WAIT_FOR_ACTION]: API_ACTION_SUCCESS,
  [CALLBACK_ARGUMENT]: (action) => action.data
});

export const ApiActionPost = (url, body, auth = true) => ({
  type: API_ACTION_POST,
  url,
  auth,
  body,
  [WAIT_FOR_ACTION]: API_ACTION_SUCCESS,
  [ERROR_ACTION]: API_ACTION_ERROR,
  [CALLBACK_ARGUMENT]: (action) => action.data
});
