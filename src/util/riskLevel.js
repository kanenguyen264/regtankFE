import { RISK_LEVEL_COLOR, RISK_LEVEL_TEXT } from "constants/RiskLevelType";
import { upperFirst, lowerCase } from "lodash";

const getRiskLevel = (enumLevel) => {
  switch (enumLevel) {
    case RISK_LEVEL_TEXT.LOW:
      return {
        textNormal: RISK_LEVEL_TEXT.LOW,
        textUpperFirst: upperFirst(lowerCase(RISK_LEVEL_TEXT.LOW)),
        textLowerCase: lowerCase(RISK_LEVEL_TEXT.LOW),
        color: RISK_LEVEL_COLOR.LOW,
      };
    case RISK_LEVEL_TEXT.MEDIUM:
      return {
        textNormal: RISK_LEVEL_TEXT.MEDIUM,
        textUpperFirst: upperFirst(lowerCase(RISK_LEVEL_TEXT.MEDIUM)),
        textLowerCase: lowerCase(RISK_LEVEL_TEXT.MEDIUM),
        color: RISK_LEVEL_COLOR.MEDIUM,
      };
    case RISK_LEVEL_TEXT.HIGH:
      return {
        textNormal: RISK_LEVEL_TEXT.HIGH,
        textUpperFirst: upperFirst(lowerCase(RISK_LEVEL_TEXT.HIGH)),
        textLowerCase: lowerCase(RISK_LEVEL_TEXT.HIGH),
        color: RISK_LEVEL_COLOR.HIGH,
      };

    default:
      return {
        textNormal: "",
        textUpperFirst: "",
        textLowerCase: "",
        color: RISK_LEVEL_COLOR.DEFAULT,
      };
  }
};

const getTextTranslateRisk = (enumLevel) => {
  switch (enumLevel) {
    case RISK_LEVEL_TEXT.LOW:
      return "appModule.riskScoreLevel.low";
    case RISK_LEVEL_TEXT.MEDIUM:
      return "appModule.riskScoreLevel.medium";
    case RISK_LEVEL_TEXT.HIGH:
      return "appModule.riskScoreLevel.high";
    default:
      return "appModule.riskScoreLevel.low";
  }
};

const getTextTranslateRiskKey = (enumLevel) => {
  switch (enumLevel) {
    case RISK_LEVEL_TEXT.LOW:
      return "appModule.riskLevel.low";
    case RISK_LEVEL_TEXT.MEDIUM:
      return "appModule.riskLevel.medium";
    case RISK_LEVEL_TEXT.HIGH:
      return "appModule.riskLevel.high";
    default:
      return "appModule.riskLevel.low";
  }
};

export { getRiskLevel, getTextTranslateRisk, getTextTranslateRiskKey };
