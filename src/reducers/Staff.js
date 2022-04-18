import IntlMessages from "@protego/sdk/UI/IntlMessages";
import {
  ADD_STAFF_FAILED,
  ADD_STAFF_SUCCESS,
  DELETE_STAFF_FAILED,
  DELETE_STAFF_SUCCESS,
  EDIT_STAFF_SUCCESS,
  FETCH_ALL_ADMIN_FAILED,
  FETCH_ALL_ADMIN_SUCCESS,
  FETCH_ALL_STAFF_ACTIVE_SUCCESS,
  FETCH_ALL_STAFF_SUCCESS,
  FETCH_STAFF_FAILED,
  FETCH_STAFF_SUCCESS,
  GET_AVAILABLE_ASSIGN_FAILED,
  GET_AVAILABLE_ASSIGN_SUCCESS,
  HIDE_MESSAGE,
  SEARCH_STAFF_USER_SUCCESS,
  SET_STAFF_LOCKED,
  SET_STAFF_LOCKED_FAILED,
  SET_STAFF_LOCKED_SUCCESS,
  SHOW_MESSAGE,
  STAFF_DETAIL_FAILED,
  STAFF_DETAIL_SUCCESS,
  STAFF_RESEND_ACTIVATION_LINK_FAILED,
  STAFF_RESEND_ACTIVATION_LINK_SUCCESS,
} from "constants/ActionTypes";
import React from "react";
import { FormattedHTMLMessage } from "react-intl";
const INIT_STATE = {
  loader: false,
  alertMessage: "",
  showMessage: false,
  errorMessage: false,
  listStaff: [],
  detail: "",
  search: "",
  isFetch: false,
  listAllStaff: [],
  showModal: false,
  listAllStaffActive: [],
  listAllAdmin: [],
  userAvailableAssign: null,
  loading: false,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case FETCH_ALL_STAFF_ACTIVE_SUCCESS: {
      return {
        ...state,
        listAllStaffActive: action.payload,
      };
    }
    case FETCH_ALL_STAFF_SUCCESS: {
      return {
        ...state,
        listAllStaff: action.payload,
      };
    }
    case FETCH_STAFF_SUCCESS: {
      const { records, total_pages, total_records } = action.payload;
      return {
        ...state,
        listStaff: records,
        total_pages: total_pages,
        total_records: total_records,
      };
    }
    case FETCH_STAFF_FAILED: {
      return {
        ...state,
        loader: false,
        loggedIn: true,
        listStaff: [],
        alertMessage: <IntlMessages id={"notification.error"}></IntlMessages>,
      };
    }
    case ADD_STAFF_SUCCESS: {
      return {
        ...state,
        alertMessage: <IntlMessages id={"notification.success"}></IntlMessages>,
        isFetch: true,
      };
    }
    case ADD_STAFF_FAILED: {
      return {
        ...state,
        errorMessage: true,
        alertMessage: action.payload,
      };
    }
    case STAFF_DETAIL_SUCCESS: {
      return {
        ...state,
        detail: action.payload.data,
      };
    }
    case STAFF_DETAIL_FAILED: {
      return {
        ...state,
        showMessage: true,
        alertMessage: "",
        errorMessage: true,
        showModal: true,
      };
    }
    case EDIT_STAFF_SUCCESS: {
      return {
        ...state,
        showMessage: true,
        detail: action.payload.data,
      };
    }

    case HIDE_MESSAGE: {
      return {
        ...state,
        loader: false,
        showMessage: false,
        errorMessage: false,
        alertMessage: "",
        isFetch: false,
        showModal: false,
      };
    }
    case SHOW_MESSAGE: {
      return {
        ...state,
        loader: false,
        showMessage: true,
      };
    }
    case DELETE_STAFF_SUCCESS: {
      return {
        ...state,
        alertMessage: <IntlMessages id={"notification.success"}></IntlMessages>,
      };
    }
    case DELETE_STAFF_FAILED: {
      return {
        ...state,
        errorMessage: true,
        alertMessage: action.payload,
      };
    }
    case SET_STAFF_LOCKED: {
      return {
        ...state,
       loading: true,
      };
    }
    case SET_STAFF_LOCKED_FAILED: {
      return {
        ...state,
        errorMessage: true,
        alertMessage: action.payload,
        loading: false,
      };
    }
    case SET_STAFF_LOCKED_SUCCESS: {
      return {
        ...state,
        listStaff: action.payload,
        loading: false,
      };
    }
    case SEARCH_STAFF_USER_SUCCESS: {
      return {
        ...state,
        search: action.payload ? action.payload : "",
      };
    }
    case STAFF_RESEND_ACTIVATION_LINK_SUCCESS: {
      return {
        ...state,
        showMessage: true,
        alertMessage: (
          <FormattedHTMLMessage
            id="staff.newActivationLinkResentTo"
            values={{
              firstName: action.payload.firstName,
              lastName: action.payload.lastName,
            }}
          />
        ),
      };
    }
    case STAFF_RESEND_ACTIVATION_LINK_FAILED: {
      return {
        ...state,
        showMessage: true,
        errorMessage: true,
        alertMessage: (
          <IntlMessages id={"appModule.linkResendFailed"}></IntlMessages>
        ),
      };
    }

    case FETCH_ALL_ADMIN_SUCCESS: {
      return {
        ...state,
        listAllAdmin: action.payload?.data,
      };
    }

    case FETCH_ALL_ADMIN_FAILED: {
      return {
        ...state,
        listAllAdmin: [],
      };
    }
    case GET_AVAILABLE_ASSIGN_SUCCESS: {
      return {
        ...state,
        userAvailableAssign: action?.payload,
      };
    }
    case GET_AVAILABLE_ASSIGN_FAILED: {
      return {
        ...state,
        userAvailableAssign: [],
      };
    }
    default:
      return state;
  }
};
