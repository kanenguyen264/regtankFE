import {
  CHANGE_DIRECTION,
  CHANGE_NAVIGATION_STYLE,
  DARK_THEME,
  DRAWER_TYPE,
  FETCH_ACTION_GET_KYB_BLACKLIST_SUCCESS,
  FETCH_ACTION_GET_KYC_BLACKLIST_SUCCESS,
  FETCH_ACTION_GET_KYT_BLACKLIST_SUCCESS,
  FETCH_ACTION_KYC_CATEGORY_SUCCESS,
  FETCH_GENERAL_SETTINGS_SUCCESS,
  FETCH_WHITELIST_SUCCESS,
  FIXED_DRAWER,
  FLAG_DRAWER_TYPE,
  GENERAL_SETTINGS_SUBMIT_SUCCESS,
  GET_CUSTOMER_ME_SUCCESS,
  HIDE_MESSAGE,
  HORIZONTAL_MENU_POSITION,
  INSIDE_THE_HEADER,
  SWITCH_LANGUAGE,
  THEME_COLOR,
  TOGGLE_COLLAPSED_NAV,
  UPDATE_COMPANY_TWO_FACTOR_AUTH_FAILED,
  UPDATE_COMPANY_TWO_FACTOR_AUTH_SUCCESS,
  UPDATE_WHITELIST_FAILED,
  UPDATE_WHITELIST_SUCCESS,
  VERTICAL_NAVIGATION,
  WINDOW_WIDTH,
  FETCH_DEPARTMENT_LIST_SUCCESS,
  DELETE_DEPARTMENT_SUCCESS,
  FETCH_DEPARTMENT_ALL_SUCCESS,
  UPDATE_DEPARTMENT_SUCCESS,
  ADD_DEPARTMENT_SUCCESS,
  DEPARTMENT_LIST_BY_USER_ID_SUCCESS,
} from "constants/ActionTypes";
import { INDIGO } from "constants/ThemeColors";
const rltLocale = ["ar"];
const setDefaultLanguageUs = () => {
  const currentLanguage = localStorage.getItem("lang_trans");
  if (currentLanguage) {
    localStorage.removeItem("lang_trans");
  }
  return {
    languageId: "english",
    locale: "en",
    name: "English",
    icon: "us",
  };
};
const initialSettings = {
  whitelist: {},
  navCollapsed: false,
  drawerType: FIXED_DRAWER,
  themeColor: INDIGO,
  darkTheme: false,
  width: window.innerWidth,
  isDirectionRTL: false,
  navigationStyle: VERTICAL_NAVIGATION,
  horizontalNavPosition: INSIDE_THE_HEADER,
  locale: setDefaultLanguageUs(),
  from: "",
  fragDrawerType: false,
  generalSettings: {
    kycSearchConfirmation: true,
    kybSearchConfirmation: true,
    kytSearchConfirmation: true,
    kycCost: 0,
    kybCost: 0,
    kytCost: 0,
  },
  alertMessage: "",
  showMessage: false,
  errorMessage: false,
  customerMe: {
    disabledKytModule: null,
  },
  kycBlackList: {},
  kybBlackList: {},
  kytBlackList: {},
  kycCategory: [],
  ACLList: [],
  ACLDetail: null,
  departmentList: {},
  departmentListAll: [],
  departmentListByCurrentUser: [],
  validateDepartmentName: false,
};

const settings = (state = initialSettings, action) => {
  switch (action.type) {
    case "@@router/LOCATION_CHANGE":
      return {
        ...state,
        navCollapsed: false,
      };
    case TOGGLE_COLLAPSED_NAV:
      return {
        ...state,
        navCollapsed: !state.navCollapsed,
      };
    case DRAWER_TYPE:
      return {
        ...state,
        drawerType: action.drawerType,
        from: action.from,
      };
    case WINDOW_WIDTH:
      return {
        ...state,
        width: action.width,
      };
    case THEME_COLOR:
      return {
        ...state,
        darkTheme: false,
        themeColor: action.color,
      };
    case DARK_THEME:
      return {
        ...state,
        darkTheme: !state.darkTheme,
      };
    case SWITCH_LANGUAGE:
      return {
        ...state,
        locale: action.payload,
        isDirectionRTL: rltLocale.includes(action.payload.locale),
      };
    case CHANGE_DIRECTION:
      return {
        ...state,
        isDirectionRTL: !state.isDirectionRTL,
      };

    case CHANGE_NAVIGATION_STYLE:
      return {
        ...state,
        navigationStyle: action.payload,
      };

    case HORIZONTAL_MENU_POSITION:
      return {
        ...state,
        horizontalNavPosition: action.payload,
      };
    case FLAG_DRAWER_TYPE:
      return {
        ...state,
        fragDrawerType: action.payload,
      };
    case FETCH_GENERAL_SETTINGS_SUCCESS:
      return {
        ...state,
        generalSettings: action.payload,
      };
    case GENERAL_SETTINGS_SUBMIT_SUCCESS:
      return {
        ...state,
        generalSettings: action.payload,
        showMessage: true,
      };
    case FETCH_WHITELIST_SUCCESS:
      return {
        ...state,
        whitelist: action.payload,
      };
    case UPDATE_WHITELIST_FAILED:
      return {
        ...state,
        showMessage: true,
        errorMessage: true,
      };

    case UPDATE_WHITELIST_SUCCESS:
      return {
        ...state,
        whitelist: action.payload,
        showMessage: true,
        errorMessage: false,
      };
    case UPDATE_COMPANY_TWO_FACTOR_AUTH_FAILED:
      return {
        ...state,
        showMessage: true,
        errorMessage: true,
      };

    case UPDATE_COMPANY_TWO_FACTOR_AUTH_SUCCESS:
      return {
        ...state,
        showMessage: true,
        errorMessage: false,
      };
    case HIDE_MESSAGE:
      return {
        ...state,
        showMessage: false,
        errorMessage: false,
      };
    case GET_CUSTOMER_ME_SUCCESS: {
      return {
        ...state,
        customerMe: action.payload.data,
      };
    }
    case FETCH_ACTION_GET_KYC_BLACKLIST_SUCCESS: {
      return {
        ...state,
        kycBlackList: action.payload,
      };
    }
    case FETCH_ACTION_GET_KYB_BLACKLIST_SUCCESS: {
      return {
        ...state,
        kybBlackList: action.payload,
      };
    }
    case FETCH_ACTION_GET_KYT_BLACKLIST_SUCCESS: {
      return {
        ...state,
        kytBlackList: action.payload,
      };
    }
    case FETCH_ACTION_KYC_CATEGORY_SUCCESS: {
      return {
        ...state,
        kycCategory: action.payload,
      };
    }
    case "KYC_ACTION_GET_KYC_BLACKLIST_BY_FILTER/success": {
      return {
        ...state,
        kycBlackList: action.payload,
      };
    }
    case FETCH_DEPARTMENT_LIST_SUCCESS: {
      return {
        ...state,
        departmentList: action.payload,
      };
    }
    case FETCH_DEPARTMENT_ALL_SUCCESS: {
      return {
        ...state,
        departmentListAll: action.payload,
      };
    }
    case DEPARTMENT_LIST_BY_USER_ID_SUCCESS: {
      return {
        ...state,
        departmentListByCurrentUser: action.payload,
      };
    }
    case DELETE_DEPARTMENT_SUCCESS: {
      return {
        ...state,
        showMessage: true,
        errorMessage: false,
        alertMessage: "notification.success",
      };
    }
    case ADD_DEPARTMENT_SUCCESS:
    case UPDATE_DEPARTMENT_SUCCESS: {
      return {
        ...state,
        showMessage: true,
        errorMessage: false,
        alertMessage: "notification.success",
      };
    }

    default:
      return state;
  }
};

export default settings;
