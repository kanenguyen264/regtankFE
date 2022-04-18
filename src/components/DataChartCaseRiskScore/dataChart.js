import { RISK_LEVEL_COLOR, RISK_LEVEL_TEXT } from "constants/RiskLevelType";
import { filter, get, map, round } from "lodash";

const fontFamily = "Arial";
const countPercent = (records) => {
  function percentage(partialValue, totalValue) {
    return {
      total: partialValue,
      percent: totalValue > 0 ? round((100 * partialValue) / totalValue) : 0
    };
  }

  const length = records.length;
  const high = filter(records, function (o) {
    return o.riskLevel === RISK_LEVEL_TEXT.HIGH;
  });

  const medium = filter(records, function (o) {
    return o.riskLevel === RISK_LEVEL_TEXT.MEDIUM;
  });

  const low = filter(records, function (o) {
    return o.riskLevel === RISK_LEVEL_TEXT.LOW;
  });
  const pending = filter(records, function (o) {
    return o.riskLevel === RISK_LEVEL_TEXT.PENDING;
  });
  return [
    percentage(high.length, length),
    percentage(medium.length, length),
    percentage(low.length, length),
    percentage(pending.length, length),
    percentage(length > 0 ? 0 : 1, length > 0 ? 0 : 1)
  ];
};

const dataChartKYT = (data, intl) => {
  if (data) {
    const records = data.map((item) => {
      const risk = get(item, "addressDetails.risk");
      return {
        riskLevel: risk?.riskLevel || RISK_LEVEL_TEXT.LOW
      };
    });
    const countPercentArr = countPercent(records);

    return {
      isEmpty: records.length > 0 ? false : true,
      labels: [
        intl.formatMessage({ id: "appModule.riskScoreLevel.high" }),
        intl.formatMessage({ id: "appModule.riskScoreLevel.medium" }),
        intl.formatMessage({ id: "appModule.riskScoreLevel.low" })
      ],
      labelTooltips: map(countPercentArr, (item) => {
        let transactionKey = "case.component.caseRiskLevel.transaction";
        if (item.total > 1) {
          transactionKey = "case.component.caseRiskLevel.transactions";
        }
        return `(${item.total} ${intl.formatMessage({ id: transactionKey })})`;
      }),
      datasets: [
        {
          data: map(countPercentArr, "percent"),
          backgroundColor: [
            RISK_LEVEL_COLOR.HIGH,
            RISK_LEVEL_COLOR.MEDIUM,
            RISK_LEVEL_COLOR.LOW,
            RISK_LEVEL_COLOR.DEFAULT
          ],
          borderWidth: 0,
          hoverBackgroundColor: [
            RISK_LEVEL_COLOR.HIGH,
            RISK_LEVEL_COLOR.MEDIUM,
            RISK_LEVEL_COLOR.LOW,
            RISK_LEVEL_COLOR.DEFAULT
          ]
        }
      ],
      centerText: {
        textNumber: records.length,
        colorNumber: "#252525",
        text: [
          intl.formatMessage({
            id: "case.component.caseRiskLevel.total"
          }),
          records.length > 1
            ? intl.formatMessage({
                id: "case.component.caseRiskLevel.transactions"
              })
            : intl.formatMessage({
                id: "case.component.caseRiskLevel.transaction"
              })
        ],
        colorText: "#A3A3A3",
        fontFamily: fontFamily
      }
    };
  }
};
const dataChartKYC = (data, intl) => {
  if (data) {
    const records = data.map((item) => {
      const risk = get(item, "individualRiskScore");
      return {
        riskLevel: risk?.riskLevel || RISK_LEVEL_TEXT.PENDING
      };
    });
    const countPercentArr = countPercent(records);

    return {
      isEmpty: records.length > 0 ? false : true,
      labels: [
        intl.formatMessage({ id: "appModule.riskScoreLevel.high" }),
        intl.formatMessage({ id: "appModule.riskScoreLevel.medium" }),
        intl.formatMessage({ id: "appModule.riskScoreLevel.low" }),
        intl.formatMessage({ id: "appModule.riskScoreLevel.pending" })
      ],
      labelTooltips: map(countPercentArr, (item) => {
        let transactionKey = "case.component.caseRiskLevel.transaction";
        if (item.total > 1) {
          transactionKey = "case.component.caseRiskLevel.transactions";
        }
        return `(${item.total} ${intl.formatMessage({ id: transactionKey })})`;
      }),
      datasets: [
        {
          data: map(countPercentArr, "percent"),
          backgroundColor: [
            RISK_LEVEL_COLOR.HIGH,
            RISK_LEVEL_COLOR.MEDIUM,
            RISK_LEVEL_COLOR.LOW,
            RISK_LEVEL_COLOR.PENDING,
            RISK_LEVEL_COLOR.DEFAULT
          ],
          borderWidth: 0,
          hoverBackgroundColor: [
            RISK_LEVEL_COLOR.HIGH,
            RISK_LEVEL_COLOR.MEDIUM,
            RISK_LEVEL_COLOR.LOW,
            RISK_LEVEL_COLOR.PENDING,
            RISK_LEVEL_COLOR.DEFAULT
          ]
        }
      ],
      centerText: {
        textNumber: records.length,
        colorNumber: "#252525",
        text: [
          intl.formatMessage({
            id: "case.component.caseRiskLevel.total"
          }),
          records.length > 1
            ? intl.formatMessage({
                id: "case.component.caseRiskLevel.transactions"
              })
            : intl.formatMessage({
                id: "case.component.caseRiskLevel.transaction"
              })
        ],
        colorText: "#A3A3A3",
        fontFamily: fontFamily
      }
    };
  }
};
export { dataChartKYT, dataChartKYC };
