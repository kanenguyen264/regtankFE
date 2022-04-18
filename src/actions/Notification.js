import {
  NOTIFICATION,
  NOTIFICATION_FAILED,
  NOTIFICATION_SUCCESS,
  SHOW_MESSAGE,
  NOTIFICATION_HEADER,
  NOTIFICATION_HEADER_SUCCESS,
  NOTIFICATION_HEADER_FAILED,
  NOTIFICATION_ID_READ,
  NOTIFICATION_ID_READ_SUCCESS,
  NOTIFICATION_ID_READ_FAILED
} from "constants/ActionTypes";
//Notification header
export const fetchAllNotificationHeader = (data) => {
  return {
    type: NOTIFICATION_HEADER,
    payload: data
  };
};

export const fetchAllNotificationHeaderSuccess = (response) => {
  return {
    type: NOTIFICATION_HEADER_SUCCESS,
    payload: response
  };
};

export const fetchAllNotificationHeaderFailed = () => {
  return {
    type: NOTIFICATION_HEADER_FAILED
  };
};

//Notification
export const fetchAllNotification = (data) => {
  return {
    type: NOTIFICATION,
    payload: data
  };
};

export const fetchAllNotificationSuccess = (response) => {
  return {
    type: NOTIFICATION_SUCCESS,
    payload: response
  };
};

export const fetchAllNotificationFailed = () => {
  return {
    type: NOTIFICATION_FAILED
  };
};
//Notification  Id read
export const fetchAllNotificationIdRead = (data) => {
  return {
    type: NOTIFICATION_ID_READ,
    payload: data
  };
};

export const fetchAllNotificationIdReadSuccess = (response) => {
  return {
    type: NOTIFICATION_ID_READ_SUCCESS,
    payload: response
  };
};

export const fetchAllNotificationIdReadFailed = () => {
  return {
    type: NOTIFICATION_ID_READ_FAILED
  };
};

export const showMessage = (message) => {
  return {
    type: SHOW_MESSAGE,
    payload: message
  };
};
