import IntlMessages from "@protego/sdk/UI/IntlMessages";
import JRCard from "@protego/sdk/UI/JRCard/JRCard";
import styles from "app/routes/Dashboard/Dashboard.module.scss";
import PieChartComponent from "app/routes/Dashboard/PieChart";
import React from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";

const KytRiskScoreAnalysis = () => {
  const { formatMessage } = useIntl();
  const [listChart, setListChart] = React.useState([]);
  const { kyt } = useSelector((state) => state.dashboard);
  const lang = useSelector((state) => state.settings.locale);
  React.useEffect(() => {
    let newList = createTable(kyt.risk);
    setListChart(newList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kyt, lang]);

  const listCaption = [
    { label: "appModule.riskScoreLabel.low", color: ThemeColors.dashboard.kytLowRisk },
    { label: "appModule.riskScoreLabel.medium", color: ThemeColors.dashboard.kytMediumRisk },
    { label: "appModule.riskScoreLabel.high", color: ThemeColors.dashboard.kytHighRisk },
  ];

  const createTable = (risk) => {
    if (risk) {
      let objLow = {
        name: formatMessage({ id: "appModule.riskScoreLabel.low" }),
        value: risk.lowRisk,
        label: risk.lowRiskPercent,
        color: ThemeColors.dashboard.kytLowRisk,
        colorTextTooltip: ThemeColors.white,
        colorTooltip: ThemeColors.dashboard.kytMediumRisk,
      };

      let objMedium = {
        name: formatMessage({ id: "appModule.riskScoreLabel.medium" }),
        value: risk.mediumRisk,
        label: risk.mediumRiskPercent,
        color: ThemeColors.dashboard.kytMediumRisk,
        colorTextTooltip: ThemeColors.white,
        colorTooltip: ThemeColors.dashboard.kytHighRisk,
      };

      let objHight = {
        name: formatMessage({ id: "appModule.riskScoreLabel.high" }),
        value: risk.highRisk,
        label: risk.highRiskPercent,
        color: ThemeColors.dashboard.kytHighRisk,
        colorTextTooltip: ThemeColors.white,
        colorTooltip: ThemeColors.dashboard.kytScore,
      };
      let newList = [objLow, objMedium, objHight];
      return newList;
    }
    return [];
  };

  return (
    <JRCard disableShadow className={styles.cardDashBoard}>
      <div className={styles.scoreTitle}>
        <IntlMessages id={"dashboard.kytRiskScoreAnalysis"} />
      </div>
      <PieChartComponent data={listChart} listCaption={listCaption} />
    </JRCard>
  );
};

export default KytRiskScoreAnalysis;
