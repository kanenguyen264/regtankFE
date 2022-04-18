import {
  FETCH_ALL_AUDIT_SUCCESS,
  FILTER_AUDIT_SUCCESS
} from "constants/ActionTypes";
const initialState = {
  audits: { records: [] },
  loader: false,
  showMessage: false,
  filterData: []
};
export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ALL_AUDIT_SUCCESS: {
      return {
        ...state,
        audits: action.payload.data
      };
    }
    case FILTER_AUDIT_SUCCESS: {
      return {
        ...state,
        audits: action.payload.data
      };
    }
    default:
      return state;
  }
};
