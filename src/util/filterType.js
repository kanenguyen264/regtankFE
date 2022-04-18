import {
  ACTIVE,
  AM,
  APPROVED,
  COMPLETED,
  DISABLED,
  FEMALE,
  FR,
  HIGH,
  INACTIVE,
  LF,
  LOW,
  MALE,
  MEDIUM,
  PENDING,
  PEP,
  REJECTED,
  RISK_SCORE,
  SAN,
  TRANSACTION,
  UNRESOLVED,
  UNSPECIFIED,
  NULL,
  ENABLED
} from "constants/ActionTypes";
import { BCH, BNB, BTC, ETH, LTC } from "constants/AssetType";

export const getFilterActionText = (key, data) => {
  if (key) {
    /**
     * Change text status in kyb filter
     */
    if (data?.valueType === "KybRequestStatus") {
      return `appModule.kyb.filter.${key}`;
    }
    return `appModule.filter.${key}`;
  }
  return "";
};

export const getFilterActionStatusText = (key) => {
  if (key) {
    return `appModule.filter.status.${key}`;
  }
  return "";
};

export const getKeyFromKeywordData = (val) => {
  /**
   * Can change filterValue before submit filter
   */
  let data = val?.map((item) => {
    if (item && typeof item === "string") {
      if (item?.includes("DJ")) {
        if (item?.split("/")[1]) {
          return item?.split("/")[1];
        }
      } else if (item === "NULL") {
        return null;
      }
      return item;
    }
    return item;
  });
  return data;
};

export const filterActionList = {
  GENDER: [MALE, FEMALE, UNSPECIFIED, NULL],
  KEYWORDS: [PEP, SAN, LF, FR, AM],
  STATUS: [UNRESOLVED, COMPLETED, PENDING, APPROVED, REJECTED],
  ACTIVE_DISABLED: [ACTIVE, DISABLED],
  ACTIVE_INACTIVE: [ACTIVE, INACTIVE],
  ENABLED_DISABLED: [ENABLED, DISABLED],
  RISK_LEVEL: [LOW, MEDIUM, HIGH],
  ASSET: [BCH, BTC, ETH, LTC, BNB],
  RISK_SCORE: Array.from(Array(11).keys()),
  KYT_MONITORING_TYPE: [RISK_SCORE, TRANSACTION],
  STATUS_SHORT: [UNRESOLVED, PENDING, COMPLETED],
};