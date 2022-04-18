import IntlMessages from "@protego/sdk/UI/IntlMessages";
import JRCard from "@protego/sdk/UI/JRCard/JRCard";
import styles from "app/routes/Dashboard/Dashboard.module.scss";
import PieChartComponent from "app/routes/Dashboard/PieChart";
import React, { Fragment, useEffect } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";

const KybRiskScoreAnalysis = () => {
  const { formatMessage } = useIntl();
  const [listChart, setListChart] = React.useState([]);
  const { kyb } = useSelector((state) => state.dashboard);
  const lang = useSelector((state) => state.settings.locale);

  useEffect(() => {
    let newList = createTable(kyb.risk);
    setListChart(newList);
    // eslint-disable-next-line
  }, [kyb, lang]);

  const listCaption = [
    { label: "appModule.riskScoreLabel.low", color: ThemeColors.dashboard.kybLowRisk },
    { label: "appModule.riskScoreLabel.medium", color: ThemeColors.dashboard.kybMediumRisk },
    { label: "appModule.riskScoreLabel.high", color: ThemeColors.dashboard.kybHighRisk }
  ];

  const createTable = (risk) => {
    if (risk) {
      let objLow = {
        name: formatMessage({ id: "appModule.riskScoreLabel.low" }),
        value: risk.lowRisk,
        label: risk.lowRiskPercent,
        color: ThemeColors.dashboard.kybLowRisk,
        colorTextTooltip: ThemeColors.white,
        colorTooltip: ThemeColors.dashboard.kybMediumRisk
      };

      let objMedium = {
        name: formatMessage({ id: "appModule.riskScoreLabel.medium" }),
        value: risk.mediumRisk,
        label: risk.mediumRiskPercent,
        color: ThemeColors.dashboard.kybMediumRisk,
        colorTextTooltip: ThemeColors.white,
        colorTooltip: ThemeColors.dashboard.kybHighRisk
      };

      let objHight = {
        name: formatMessage({ id: "appModule.riskScoreLabel.high" }),
        value: risk.highRisk,
        label: risk.highRiskPercent,
        color: ThemeColors.dashboard.kybHighRisk,
        colorTextTooltip: ThemeColors.white,
        colorTooltip: ThemeColors.dashboard.kybScore,
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
          <IntlMessages id={"dashboard.kybRiskScoreAnalysis"} />
        </div>
        <PieChartComponent data={listChart} listCaption={listCaption} />
      </JRCard>
    </Fragment>
  );
};

export default KybRiskScoreAnalysis;
