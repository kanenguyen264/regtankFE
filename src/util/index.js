import IntlMessages from "@protego/sdk/UI/IntlMessages";
import { APPROVED, COMPLETED, REJECTED } from "constants/ViewLogType";
import React from "react";
const colorCode = [
  "#F74E60",
  "#20C5BE",
  "#8950FC",
  "#1EB4FD",
  "#426AB4",
  "#FAC02C",
  "#FF9800",
];

const getRoleText = (string) => {
  if (string === "STAFF") {
    return <IntlMessages id="role.user" />;
  }
  if (string === "USER") {
    return <IntlMessages id="role.user" />;
  }
  if (string === "ADMIN") {
    return <IntlMessages id="role.admin" />;
  }
  if (string === "SUPERADMIN") {
    return <IntlMessages id="role.admin" />;
  }
  if (string === "ADMINISTRATOR") {
    return <IntlMessages id="role.admin" />;
  }
  return "";
};

const getColorCodeWithIndex = (index) => {
  return colorCode[index] ? colorCode[index] : colorCode[0];
};

export function injectService(serviceObj) {
  for (let [key, value] of Object.entries(serviceObj)) window[key] = value;
}

const isNumeric = (value) => {
  var regex = /^[+]*[0-9]*$/;
  if (isNaN(value / 2) && !regex.test(value)) {
    return false;
  }
  return true;
};

const getContentMessage = (error, fallback) => {
  let jsonParse = JSON.parse(
    JSON.stringify(error?.response ? error?.response.data : "")
  );
  if (jsonParse) {
    /**
     * Handler error message from staff
     */
    if (jsonParse?.status === 500 && jsonParse?.path.includes("update")) {
      return <IntlMessages id={"staff.edit.invalid"} />;
    }
    switch (jsonParse?.message) {
      case "INSUFFICIENT_CREDIT":
        return <IntlMessages id={"notification.message.insufficient"} />;
      case "DATA_DUPLICATED":
        return <IntlMessages id={"notification.message.DATA_DUPLICATED"} />;
      case "INVALID_PARAMETERS": {
        return <IntlMessages id={"notification.message.INVALID_PARAMETERS"} />;
      }
      default:
        return (
          fallback || <IntlMessages id={"appModule.generic.errorMessage"} />
        );
    }
  }
  return fallback || <IntlMessages id={"appModule.generic.errorMessage"} />;
};

const isCompletedStatus = (status) => {
  switch (status) {
    case COMPLETED: {
      return true;
    }
    case APPROVED: {
      return true;
    }
    case REJECTED: {
      return true;
    }
    default:
      return false;
  }
};

const numberOnlyInput = (val) => {
  if (!val) {
    return true;
  }
  var numbers = /^[0-9]+$/;
  if (val.match(numbers)) {
    return true;
  }
  return false;
};

// eslint-disable-next-line import/no-anonymous-default-export
export {
  getRoleText,
  getColorCodeWithIndex,
  getContentMessage,
  isNumeric,
  isCompletedStatus,
  numberOnlyInput,
};
