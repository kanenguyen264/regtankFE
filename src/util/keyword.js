import {
  AM,
  AM_COLOR,
  AM_TEXT_COLOR,
  DEFAULT_COLOR,
  DEFAULT_TEXT_COLOR,
  FR,
  FR_COLOR,
  FR_TEXT_COLOR,
  LF,
  LF_COLOR,
  LF_TEXT_COLOR,
  PEP,
  PEP_COLOR,
  PEP_TEXT_COLOR,
  SA,
  SAN,
  SAN_COLOR,
  SAN_TEXT_COLOR,
  SA_COLOR,
  SA_TEXT_COLOR,
  RISK_SCORE,
  TRANSACTION,
  RISK_SCORE_COLOR,
  TRANSACTION_COLOR,
  RISK_SCORE_TEXT_COLOR,
  TRANSACTION_TEXT_COLOR,
  RCA,
  RCA_COLOR,
  RCA_TEXT_COLOR,
  OOL,
  OOL_COLOR,
  OOL_TEXT_COLOR,
  SI,
  SI_COLOR,
  SI_TEXT_COLOR,
  SI_LT,
  SI_LT_COLOR,
  SI_LT_TEXT_COLOR,
  SAN_PERSON,
} from "constants/Keywords";

const colorKeywordMap = {
  [PEP]: [PEP_TEXT_COLOR, PEP_COLOR, `component.keyword.${PEP}`],
  [LF]: [LF_TEXT_COLOR, LF_COLOR, `component.keyword.${LF}`],
  [AM]: [AM_TEXT_COLOR, AM_COLOR, `component.keyword.${AM}`],
  [FR]: [FR_TEXT_COLOR, FR_COLOR, `component.keyword.${FR}`],
  [SA]: [SA_TEXT_COLOR, SA_COLOR, `component.keyword.${SA}`],
  [SAN]: [SAN_TEXT_COLOR, SAN_COLOR, `component.keyword.${SAN}`],
  [RCA]: [RCA_TEXT_COLOR, RCA_COLOR, `component.keyword.${RCA}`],
  [OOL]: [OOL_TEXT_COLOR, OOL_COLOR, `component.keyword.${OOL}`],
  [SI]: [SI_TEXT_COLOR, SI_COLOR, `component.keyword.${SI}`],
  [SI_LT]: [SI_LT_TEXT_COLOR, SI_LT_COLOR, `component.keyword.${SI_LT}`],
  [RISK_SCORE]: [
    RISK_SCORE_TEXT_COLOR,
    RISK_SCORE_COLOR,
    `component.keyword.${RISK_SCORE}`,
  ],
  [TRANSACTION]: [
    TRANSACTION_TEXT_COLOR,
    TRANSACTION_COLOR,
    `component.keyword.${TRANSACTION}`,
  ],
  [SAN_PERSON]: [SAN_TEXT_COLOR, SAN_COLOR, `component.keyword.${SAN_PERSON}`],
};

const colorDJKeywordMap = {
  [PEP]: [PEP_TEXT_COLOR, PEP_COLOR, `component.dj.keyword.${PEP}`],
  [SAN]: [SAN_TEXT_COLOR, SAN_COLOR, `component.dj.keyword.${SAN}`],
  [RCA]: [RCA_TEXT_COLOR, RCA_COLOR, `component.keyword.${RCA}`],
  [OOL]: [OOL_TEXT_COLOR, OOL_COLOR, `component.keyword.${OOL}`],
  [SI]: [SI_TEXT_COLOR, SI_COLOR, `component.keyword.${SI}`],
  [SI_LT]: [SI_LT_TEXT_COLOR, SI_LT_COLOR, `component.keyword.${SI_LT}`],
  [SAN_PERSON]: [SAN_TEXT_COLOR, SAN_COLOR, `component.keyword.${SAN_PERSON}`],
};

const getColorTextKeyWord = (text) => {
  if (text) {
    return colorKeywordMap[text.toUpperCase()]?.[0] ?? DEFAULT_TEXT_COLOR;
  }
  return DEFAULT_TEXT_COLOR;
};

const getColorKeyWord = (text) => {
  if (text) {
    return (
      colorKeywordMap[text.toUpperCase().replace("-", "_")]?.[1] ??
      DEFAULT_COLOR
    );
  }
  return DEFAULT_COLOR;
};

const getTextTranslate = (text, screen) => {
  if (text) {
    /**
     * If DJ check render name
     */
    if (screen === "DJ") {
      return (
        colorDJKeywordMap[text.toUpperCase().replace("-", "_")]?.[2] ?? text
      );
    }
    return colorKeywordMap[text.toUpperCase().replace("-", "_")]?.[2] ?? text;
  }
  return text;
};

const getTextKeyWork = (text) => {
  /**
   * Convert keywork
   * SAN-PERSON to SAN
   */
  if (text === SAN_PERSON.replace("_", "-")) {
    return SAN;
  }
  return text;
};

export {
  getColorKeyWord,
  getColorTextKeyWord,
  getTextTranslate,
  getTextKeyWork,
};
