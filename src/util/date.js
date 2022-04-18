// Format a date value with enumerated formats
import { get, isNaN } from "lodash";
import moment from "moment";
import momentTz from "moment-timezone";

export const TIME = "HH:mm";
export const TIME_SECOND = "HH:mm:ss";
export const MONTH_YEAR_DATE = "MMM YYYY";
export const LONG_DATE = "DD MMM YYYY";
export const LONG_DATE_TIME = "DD MMM YYYY HH:mm";
export const YEAR = "YYYY";
export const YEAR_MONTH_DATE = "YYYY-MM-DD";
// export const LONG_DATE_TIME_SECOND = "DD MMM YYYY HH:mm:ss";

function formatDate(value, format = LONG_DATE) {
  if (!value) {
    return null;
  }
  let dateValue;
  if (moment(value).isValid()) {
    dateValue = value;
  } else {
    dateValue = new Date(value);
    if (isNaN(dateValue)) {
      return null;
    }
  }

  return moment(dateValue).format(format);
}

function getFullDateTime(val, format = LONG_DATE) {
  if (!val) {
    return "";
  }
  const day =
    get(val, "day") ||
    get(val, "dateOfBirth") ||
    get(val, "dayOfBirth") ||
    get(val, "dayOfDeath") ||
    "";
  const month =
    get(val, "month") ||
    get(val, "monthOfBirth") ||
    get(val, "monthOfDeath") ||
    "";
  const year =
    get(val, "year") ||
    get(val, "yearOfBirth") ||
    get(val, "yearOfDeath") ||
    "";
  if (!day && !month && !year) {
    return;
  }
  return [
    day,
    month
      ? moment()
          .month(month - 1)
          .format("MMM")
      : "",
    year,
  ].join(" ");
}

function getCurrentTimeZone() {
  return momentTz.tz.guess();
}

const getCurrentTime = () => {
  return new Date(`${moment().year()}`);
};

/**
 * check date in range of startDate and Endate
 *
 * @param {string} startDate
 * @param {string} endDate
 * @param {number} date : milisecond
 * @returns true if date in range, false if date not in range
 */
export const checkDateInRangeDate = (date, startDate, endDate) => {
  const from = new Date(startDate).getTime();
  const to = new Date(endDate).getTime();
  if (date >= from && date <= to) {
    return true;
  }
  return false;
};

export { formatDate, getCurrentTimeZone, getFullDateTime, getCurrentTime };
