import {
  FETCH_CASE_MANAGEMENT_SUCCESS,
  FETCH_DASHBOARD_CREDIT_SUCCESS,
  FETCH_DASHBOARD_KYC_SUCCESS,
  FETCH_DASHBOARD_KYT_SUCCESS,
  FETCH_DASHBOARD_STAFF_ASSIGN_SUCCESS,
  FETCH_DASHBOARD_KYB_SUCCESS,
  /**
   * Liveness
   */
  FETCH_PERCENTAGE_CHART,
  FETCH_PERCENTAGE_CHART_SUCCESS,
  FETCH_STATUS_CHART,
  FETCH_STATUS_CHART_SUCCESS,
  FETCH_SUMMARY_REQUEST_CHART,
  FETCH_SUMMARY_REQUEST_CHART_SUCCESS,
} from "constants/ActionTypes";
const INIT_STATE = {
  caseManagement: {},
  kyc: {},
  kyt: {},
  kyb: {},
  credit: {},
  staffAssign: {},
  summaryRequestReport: {
    loader: false,
    data: {},
  },
  statusReport: {
    loader: false,
    data: {},
  },
  percentageReport: {
    loader: false,
    data: {},
  },
};
export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case FETCH_DASHBOARD_CREDIT_SUCCESS: {
      return {
        ...state,
        credit: action.payload,
      };
    }
    case FETCH_CASE_MANAGEMENT_SUCCESS: {
      return {
        ...state,
        caseManagement: action.payload,
      };
    }
    case FETCH_DASHBOARD_KYT_SUCCESS: {
      return {
        ...state,
        kyt: action.payload,
      };
    }
    case FETCH_DASHBOARD_KYC_SUCCESS: {
      return {
        ...state,
        kyc: action.payload,
      };
    }
    case FETCH_DASHBOARD_KYB_SUCCESS: {
      return {
        ...state,
        kyb: action.payload,
      };
    }
    case FETCH_DASHBOARD_STAFF_ASSIGN_SUCCESS: {
      return {
        ...state,
        staffAssign: action.payload,
      };
    }
    /**
     * Liveness
     */
    case FETCH_SUMMARY_REQUEST_CHART: {
      return {
        ...state,
        summaryRequestReport: {
          ...state.summaryRequestReport,
          loader: true,
        },
      };
    }
    case FETCH_SUMMARY_REQUEST_CHART_SUCCESS: {
      return {
        ...state,
        summaryRequestReport: {
          data: action.payload.data,
          loader: false,
        },
      };
    }

    case FETCH_PERCENTAGE_CHART: {
      return {
        ...state,
        percentageReport: {
          ...state.percentageReport,
          loader: true,
        },
      };
    }
    case FETCH_PERCENTAGE_CHART_SUCCESS: {
      return {
        ...state,
        percentageReport: {
          data: action.payload.data,
          loader: false,
        },
      };
    }

    case FETCH_STATUS_CHART: {
      return {
        ...state,
        statusReport: {
          ...state.statusReport,
          loader: true,
        },
      };
    }
    case FETCH_STATUS_CHART_SUCCESS: {
      return {
        ...state,
        statusReport: {
          data: action.payload.data,
          loader: false,
        },
      };
    }
    default:
      return state;
  }
};
