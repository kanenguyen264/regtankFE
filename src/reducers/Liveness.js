import {
  FETCH_ALL_LIVENESS,
  FETCH_ALL_LIVENESS_SUCCESS,
  HIDE_TOAST_MESSAGE,
  LIVENESS_REQUEST_DETAIL_SUCCESS,
  SHOW_TOAST_MESSAGE,
  LIVENESS_REQUEST_DETAIL,
} from "../constants/ActionTypes";
const initialState = {
  liveness: { records: [] },
  loader: false,
  showMessage: false,
  toastMessage: {
    isOpen: false,
    content: "",
    type: "success",
  },
  livenessDetail: null,
};
export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ALL_LIVENESS: {
      return {
        ...state,
        loader: true,
      };
    }
    case FETCH_ALL_LIVENESS_SUCCESS: {
      return {
        ...state,
        liveness: {
          records: action.payload.data.items,
          total_pages: action.payload.data.totalPages,
          total_records: action.payload.data.totalRecords,
        },
        loader: false,
      };
    }
    case LIVENESS_REQUEST_DETAIL: {
      return {
        ...state,
        loader: true,
      };
    }
    case LIVENESS_REQUEST_DETAIL_SUCCESS: {
      return {
        ...state,
        livenessDetail: action.payload.data,
        loader: false,
      };
    }
    case HIDE_TOAST_MESSAGE:
      return {
        ...state,
        toastMessage: {
          content: "",
          isOpen: false,
        },
      };
    case SHOW_TOAST_MESSAGE:
      return {
        ...state,
        toastMessage: {
          content: action.payload.content,
          isOpen: true,
          type: action.payload.type,
        },
      };
    default:
      return state;
  }
};
