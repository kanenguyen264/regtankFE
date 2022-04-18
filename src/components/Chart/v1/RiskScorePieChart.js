import { Typography } from "@mui/material";
import { withStyles } from "@mui/styles";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import clsx from "clsx";
import { RISK_LEVEL_TEXT } from "constants/RiskLevelType";
import * as PropTypes from "prop-types";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import {
  Cell,
  Label,
  Pie,
  PieChart,
  ResponsiveContainer,
  Text,
} from "recharts";

import {
  getRiskLevel,
  getTextTranslateRisk,
  getTextTranslateRiskKey,
} from "util/riskLevel";
import useMediaQuery from "@mui/material/useMediaQuery";
import pieChartStyle from "../PieChart.module.scss";
const styles = {
  KeywordWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  Root: {
    display: "flex",
    flexWrap: "nowrap",
    background: "#626262",
    borderRadius: toRem(18),
    color: "#ffffff",
    paddingTop: toRem(6),
    paddingBottom: toRem(6),
    paddingLeft: toRem(50),
    paddingRight: toRem(50),
    alignItems: "center",
  },
  container: {
    height: `${toRem(125)} !important`,
    width: "100%",
  },
  riskScoreContainer: {
    marginTop: toRem(13),
  },
  totalText: {
    width: "100%",
    fontSize: toRem(30),
    fontWeight: "700",
  },
  levelText: {
    fontSize: toRem(30),
    fontWeight: "700",
    fontFamily: "Montserrat",
  },
  riskLevelText: {
    fontSize: toRem(20),
    fontWeight: "600",
    fontFamily: "Montserrat",
  },
  sanctionText: {
    fontSize: toRem(20),
    lineHeight: 1.3,
    padding: "5px 25px",
    borderRadius: "40px",
    fontWeight: 300,
    background: "#ea2134",
    color: "#ffffff",
  },
  legendBullet: {
    display: "inline-block",
    width: toRem(8),
    height: toRem(8),
    borderRadius: "50%",
    marginRight: toRem(6),
  },
};

const RiskScorePieChart = forwardRef(function RiskScorePieChart(props, ref) {
  const { formatMessage } = useIntl();
  const containerRef = useRef(null);
  const [radius, setRadius] = useState({ outer: 100, inner: 75 });
  const [chartHeight, setChartHeight] = useState(125);
  const matches = useMediaQuery("(max-width:1440px)");

  const {
    scoring,
    showRiskScore,
    isSanction,
    levelTextPosition,
    sanctionText,
    cHeight,
    classes,
    showRiskLevel,
  } = props;

  const angleDefault = { value: 10, color: "#EEEEEE" };
  const dataDefault = [
    { value: 10, color: "#EEEEEE" },
    { value: 10, color: "#EEEEEE" },
    { value: 10, color: "#EEEEEE" },
    { value: 10, color: "#EEEEEE" },
    { value: 10, color: "#EEEEEE" },
    { value: 10, color: "#EEEEEE" },
    { value: 10, color: "#EEEEEE" },
    { value: 10, color: "#EEEEEE" },
    { value: 10, color: "#EEEEEE" },
    { value: 10, color: "#EEEEEE" },
  ];
  const [dataShow, setDataShow] = React.useState(dataDefault);
  const { risk, riskLevel } = scoring;
  const riskLevelStyleSets = getRiskLevel(
    isSanction ? RISK_LEVEL_TEXT.HIGH : riskLevel
  );
  const levelColor = riskLevelStyleSets.color;
  const STANDARD_WIDTH = 250;

  useEffect(() => {
    if (!isSanction) {
      const dataTemp = dataShow.map((item, index) => {
        switch (riskLevel) {
          case RISK_LEVEL_TEXT.HIGH:
            if (index > 6 && index < 10) {
              item.color = levelColor;
            } else {
              item = angleDefault;
            }
            break;
          case RISK_LEVEL_TEXT.MEDIUM:
            if (index >= 3 && index < 7) {
              item.color = levelColor;
            } else {
              item = angleDefault;
            }
            break;
          case RISK_LEVEL_TEXT.LOW:
            if (index >= 0 && index < 3) {
              item.color = levelColor;
            } else {
              item = angleDefault;
            }
            break;

          default:
            break;
        }
        return item;
      });
      setDataShow(dataTemp);
    } else {
      const dataTemp = dataShow.map((item, index) => {
        item.color = levelColor;
        return item;
      });
      setDataShow(dataTemp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scoring, isSanction]);

  useEffect(() => {
    const width = containerRef?.current?.state?.containerWidth;
    const ratio = width / STANDARD_WIDTH;
    if (width >= STANDARD_WIDTH) {
      setRadius({ outer: 145, inner: 115 });
    } else {
      setRadius({ outer: 145 * ratio, inner: 145 * ratio * 0.8 });
    }
  }, [containerRef, containerRef?.current?.state?.containerWidth]);

  const getLabel = (risk) => {
    if (showRiskScore)
      return !isSanction
        ? Math.round(risk)
        : formatMessage({ id: sanctionText });
    return;
  };

  return (
    <>
      <ResponsiveContainer
        className={classes.container}
        ref={containerRef}
        width="100%"
        height={matches ? cHeight - 30 : cHeight}
      >
        <PieChart ref={ref}>
          <Pie
            data={dataShow}
            cy={"70%"}
            startAngle={180}
            endAngle={0}
            innerRadius={`${radius.inner}%`}
            outerRadius={`${radius.outer}%`}
            fill="#8884d8"
            dataKey="value"
            isAnimationActive={true}
            blendStroke
          >
            <Label
              value={
                showRiskLevel
                  ? formatMessage({ id: getTextTranslateRiskKey(riskLevel) })
                  : getLabel(risk)
              }
              fill={levelColor}
              position={levelTextPosition}
              className={
                showRiskLevel ? classes.riskLevelText : classes.levelText
              }
            />
            {dataShow.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className={pieChartStyle.textRiskScore}>
        <span
          className={classes.legendBullet}
          style={{
            background: riskLevelStyleSets.color,
          }}
        />

        {formatMessage({ id: getTextTranslateRiskKey(riskLevel) })}
      </div>
    </>
  );
});

RiskScorePieChart.propTypes = {
  scoring: PropTypes.exact({
    risk: PropTypes.number,
    riskLevel: PropTypes.oneOf([
      RISK_LEVEL_TEXT.LOW,
      RISK_LEVEL_TEXT.MEDIUM,
      RISK_LEVEL_TEXT.HIGH,
    ]),
  }),
  showRiskScore: PropTypes.bool,
  isSanction: PropTypes.bool,
  cHeight: PropTypes.number,
};

RiskScorePieChart.defaultProps = {
  scoring: null,
  showRiskScore: true,
  levelTextPosition: "centerBottom",
  sanctionText: "appModule.totalRiskScore.sanction",
  isSanction: false,
  cHeight: 125,
};

export default withStyles(styles)(RiskScorePieChart);
