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
import pieChartStyle from "../../PieChart.module.scss";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";
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

const MAX_PERCENT_NUMBER = 100;
const PERCENT_SUCCESS = 80;

const PercentChart = forwardRef(function RiskScorePieChart(props, ref) {
  const { formatMessage } = useIntl();
  const containerRef = useRef(null);
  const [radius, setRadius] = useState({ outer: 100, inner: 75 });
  const matches = useMediaQuery("(max-width:1440px)");

  const { percentNumber, cHeight, classes, levelTextPosition } = props;

  const [dataShow, setDataShow] = React.useState([]);

  const checkStatusPercent = () => {
    if (percentNumber > 0 && percentNumber < PERCENT_SUCCESS) {
      return "warning";
    } else if (percentNumber > PERCENT_SUCCESS || percentNumber === PERCENT_SUCCESS) {
      return "success";
    }
    return "default";
  };

  useEffect(() => {
    let dataTemp = [];

    for (let i = 0; i < MAX_PERCENT_NUMBER; i++) {
      dataTemp.push({
        value: 1,
        color: "#EEEEEE",
        key: i,
      });
    }
    setDataShow(dataTemp);

    if (percentNumber) {
      if (checkStatusPercent() === "warning") {
        for (let i = 0; i < percentNumber; i++) {
          if (dataTemp[i]["key"] === i) {
            dataTemp[i] = {
              value: 1,
              color: ThemeColors.warning,
              key: i,
            };
          }
        }
        setDataShow(dataTemp);
      } else if (checkStatusPercent() === "success") {
        for (let i = 0; i < percentNumber; i++) {
          if (dataTemp[i]["key"] === i) {
            dataTemp[i] = {
              value: 1,
              color: ThemeColors.successLight,
              key: i,
            };
          }
        }
        setDataShow(dataTemp);
      }
    }
  }, [percentNumber]);

  const fillColorPercentText = () => {
    if(checkStatusPercent()==="success") {
      return ThemeColors.successDark;
    } else if(checkStatusPercent()==="warning") {
      return ThemeColors.warningDark;
    } else {
      return ThemeColors.default;
    }
  }

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
              value={percentNumber + "%"}
              fill={fillColorPercentText()}
              position={levelTextPosition}
              className={classes.levelText}
            />
            {dataShow?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} data-cy={index} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </>
  );
});

PercentChart.propTypes = {
  cHeight: PropTypes.number,
  levelTextPosition: PropTypes.string,
};

PercentChart.defaultProps = {
  cHeight: 125,
  levelTextPosition: "centerBottom",
};

export default withStyles(styles)(PercentChart);
