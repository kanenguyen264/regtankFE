import {
  NOTIFICATION_HEADER_SUCCESS,
  NOTIFICATION_ID_READ_SUCCESS,
  NOTIFICATION_SUCCESS
} from "constants/ActionTypes";
const initialState = {
  notificationsPopup: {},
  notifications: { records: [] },
  loader: false,
  showMessage: false
};
export default (state = initialState, action) => {
  switch (action.type) {
    case NOTIFICATION_SUCCESS: {
      return {
        ...state,
        notifications: action.payload.data
      };
    }
    case NOTIFICATION_HEADER_SUCCESS: {
      return {
        ...state,
        notificationsPopup: action.payload.data
      };
    }
    case NOTIFICATION_ID_READ_SUCCESS: {
      let notificationUpdate = state.notificationsPopup;
      let objUpdate = action.payload;

      /**
       * Only update item with type reassign
       */
      let listCurrent = state.notificationsPopup?.records;
      let objIndex = listCurrent?.findIndex((obj) => obj?.id === objUpdate?.id);
      if (objIndex >= 0) {
        let notificationItem = { ...listCurrent[objIndex], read: true };
        listCurrent[objIndex] = notificationItem;
        notificationUpdate = {
          ...state.notificationsPopup,
          records: listCurrent
        };
      }
      return {
        ...state,
        notificationsPopup: notificationUpdate
      };
    }
    default:
      return state;
  }
};
