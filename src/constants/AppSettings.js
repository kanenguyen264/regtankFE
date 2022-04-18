export const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
export const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
export const TIMER_LOGOUT = 30; //30 s
// export const USER_TIME_OUT = 1000 * 60 * 15; //15 minus
export const USER_TIME_OUT = 1000 * 60 * 5; // about 5 minus

export const MODE_VIEW = "view";
export const MODE_ADD = "new";
export const MODE_EDIT = "edit";
export const MODE_DUPLICATION = "duplication";
export const RANGE_CALENDAR = {
  min: new Date("1930"),
  max: new Date(),
};
