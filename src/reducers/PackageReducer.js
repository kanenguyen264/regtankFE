import { FETCH_ALL_PACKAGE_SUCCESS } from "constants/ActionTypes";
import { find } from "lodash";
const initialState = {
  loader: false,
  showMessage: false,
  packages: [],
  currentPackage: null
};
export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ALL_PACKAGE_SUCCESS: {
      return {
        ...state,
        packages: action.payload.data,
        currentPackage: find(action.payload.data, function (o) {
          return o.isCurrent === true;
        })
      };
    }
    default:
      return state;
  }
};
