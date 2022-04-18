import { GET, PUT } from "./ApiService";
export const fetchNotificationAllFromApi = (params) => {
  return GET(`/notification/`, params);
};
export const fetchNotificationIdReadFromApi = (params) => {
  return PUT(`/notification/${params}/read?read=${true}`);
};
