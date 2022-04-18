import { RISK_COLOR, WHITE } from "constants/ThemeColors";

export const RISK_LEVEL_COLOR = {
  LOW: RISK_COLOR.success,
  MEDIUM: RISK_COLOR.warning,
  HIGH: RISK_COLOR.error,
  PENDING: RISK_COLOR.default,
  DEFAULT: RISK_COLOR.default,
};

export const RISK_LEVEL_TEXT = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  PENDING: "PENDING",
};
export const RISK_LEVEL_TEXT_COLOR = {
  LOW: WHITE,
  MEDIUM: RISK_COLOR.medium,
  HIGH: WHITE,
  PENDING: RISK_COLOR.medium,
};
export const INFINITY = "Infinity";
