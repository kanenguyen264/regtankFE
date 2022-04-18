import IntlMessages from "@protego/sdk/UI/IntlMessages";
import JRCard from "@protego/sdk/UI/JRCard/JRCard";
import styles from "app/routes/Dashboard/Dashboard.module.scss";
import PieChartComponent from "app/routes/Dashboard/PieChart";
import React, { Fragment, useEffect } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";

const KycRiskScoreAnalysis = () => {
  const { formatMessage } = useIntl();
  const [listChart, setListChart] = React.useState([]);
  const { kyc } = useSelector((state) => state.dashboard);
  const lang = useSelector((state) => state.settings.locale);

  useEffect(() => {
    let newList = createTable(kyc.risk);
    setListChart(newList);
    // eslint-disable-next-line
  }, [kyc, lang]);

  const listCaption = [
    { label: "appModule.riskScoreLabel.low", color: ThemeColors.dashboard.kycLowRisk },
    { label: "appModule.riskScoreLabel.medium", color: ThemeColors.dashboard.kycMediumRisk },
    { label: "appModule.riskScoreLabel.high", color: ThemeColors.dashboard.kycHighRisk }
  ];

  const createTable = (risk) => {
    if (risk) {
      let objLow = {
        name: formatMessage({ id: "appModule.riskScoreLabel.low" }),
        value: risk.lowRisk,
        label: risk.lowRiskPercent,
        color: ThemeColors.dashboard.kycLowRisk,
        colorTextTooltip: ThemeColors.white,
        colorTooltip:  ThemeColors.dashboard.kycMediumRisk
      };

      let objMedium = {
        name: formatMessage({ id: "appModule.riskScoreLabel.medium" }),
        value: risk.mediumRisk,
        label: risk.mediumRiskPercent,
        color: ThemeColors.dashboard.kycMediumRisk,
        colorTextTooltip: ThemeColors.white,
        colorTooltip: ThemeColors.dashboard.kycHighRisk
      };

      let objHight = {
        name: formatMessage({ id: "appModule.riskScoreLabel.high" }),
        value: risk.highRisk,
        label: risk.highRiskPercent,
        color: "#0080FF",
        colorTextTooltip: ThemeColors.white,
        colorTooltip: ThemeColors.dashboard.kycScore
      };
      let newList = [objLow, objMedium, objHight];
      return newList;
    }
    return [];
  };

  return (
    <Fragment>
      <JRCard disableShadow className={styles.cardDashBoard}>
        <div className={styles.scoreTitle}>
          <IntlMessages id={"dashboard.kycRiskScoreAnalysis"} />
        </div>
        <PieChartComponent data={listChart} listCaption={listCaption} />
      </JRCard>
    </Fragment>
  );
};

export default KycRiskScoreAnalysis;
