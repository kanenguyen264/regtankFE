import {
  SUPPORT_ACTION_SUBMIT,
  SUPPORT_ACTION_SUBMIT_ERROR,
  SUPPORT_ACTION_SUBMIT_SUCCESS
} from "../constants/ActionTypes";
import { ERROR_ACTION, WAIT_FOR_ACTION } from "redux-wait-for-action/src";

export const SupportActionSubmit = (payload) => ({
  type: SUPPORT_ACTION_SUBMIT,
  payload,
  [WAIT_FOR_ACTION]: SUPPORT_ACTION_SUBMIT_SUCCESS,
  [ERROR_ACTION]: SUPPORT_ACTION_SUBMIT_ERROR
});
