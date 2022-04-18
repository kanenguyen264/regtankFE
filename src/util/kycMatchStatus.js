import { KYC_MATCHES } from "constants/KycMatchStatus";
import { RISK_LEVEL_TEXT } from "constants/RiskLevelType";

const getMatchStatusTranslate = (status) => {
  if (!status) {
    return;
  }
  switch (status) {
    case KYC_MATCHES.FALSE:
      return "status.resolution.button.false";
    case KYC_MATCHES.POSITIVE:
      return "status.resolution.button.positive";
    case KYC_MATCHES.UNRESOLVED:
      return "status.resolution.button.unresolved";
    case RISK_LEVEL_TEXT.HIGH:
      return "appModule.riskScoreLevel.high";
    case RISK_LEVEL_TEXT.MEDIUM:
      return "appModule.riskScoreLevel.medium";
    case RISK_LEVEL_TEXT.LOW:
      return "appModule.riskScoreLevel.low";
    default:
      return "";
  }
};

export { getMatchStatusTranslate };
