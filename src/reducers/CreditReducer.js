import {
  FETCH_CUSTOMER_CREDIT_SUCCESS,
  FETCH_CREDIT_BUNDLE_SUCCESS
} from "constants/ActionTypes";
const initialState = {
  loader: false,
  showMessage: false,
  customerCredit: {},
  creditBundles: []
};
export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CUSTOMER_CREDIT_SUCCESS: {
      return {
        ...state,
        customerCredit: action.payload.data
      };
    }
    case FETCH_CREDIT_BUNDLE_SUCCESS: {
      return {
        ...state,
        creditBundles: action.payload.data
      };
    }
    default:
      return state;
  }
};
