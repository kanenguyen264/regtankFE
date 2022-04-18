import {
  FETCH_ME_SUCCESS,
  FETCH_ME_FAILED,
  UPDATE_MY_PROFILE_SUCCESS,
  GET_MFA_VERIFY_SUCCESS,
  HIDE_MESSAGE,
  GET_MFA_INFO_SUCCESS,
  UPDATE_TWO_FACTOR_AUTH_SUCCESS,
  UPDATE_TWO_FACTOR_AUTH_FAILED
} from "constants/ActionTypes";
import {
  GET_MFA_INFO_FAILED,
  GET_MFA_VERIFY_FAILED
} from "../constants/ActionTypes";
const initialState = {
  loader: false,
  me: {},
  mfaVerify: false,
  mfaKey: "",
  otpAuthUri: "",
  verifyCodeStatus: false,
  customerMe: {}
};
export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ME_SUCCESS: {
      return {
        ...state,
        me: action.payload.data,
        errorMessage: ""
      };
    }
    case FETCH_ME_FAILED: {
      return {
        ...state,
        loader: false,
        loggedIn: true
      };
    }
    case UPDATE_MY_PROFILE_SUCCESS: {
      return {
        ...state,
        me: action.payload.data
      };
    }
    case GET_MFA_VERIFY_SUCCESS: {
      return {
        ...state,
        mfaVerify: action.payload,
        errorMessage: ""
      };
    }

    case GET_MFA_VERIFY_FAILED: {
      return {
        ...state,
        mfaVerify: action.payload,
        errorMessage: "profile.2af.mobile.password.failed"
      };
    }

    case GET_MFA_INFO_SUCCESS: {
      return {
        ...state,
        mfaKey: action.payload?.data?.mfaKey,
        otpAuthUri: action.payload?.data?.otpAuthUri
      };
    }
    case GET_MFA_INFO_FAILED: {
      return {
        ...state,
        mfaKey: "",
        otpAuthUri: ""
      };
    }

    case UPDATE_TWO_FACTOR_AUTH_SUCCESS: {
      return {
        ...state,
        me: action.payload?.data,
        verifyCodeStatus: true
      };
    }
    case UPDATE_TWO_FACTOR_AUTH_FAILED: {
      return {
        ...state,
        verifyCodeStatus: false,
        errorMessage: action.payload
      };
    }
    case HIDE_MESSAGE: {
      return {
        ...state,
        errorMessage: "",
        mfaVerify: false,
        verifyCodeStatus: false
      };
    }
    default:
      return state;
  }
};
