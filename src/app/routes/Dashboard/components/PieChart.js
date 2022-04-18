import { Typography } from "@material-ui/core";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import { toRem } from "@protego/sdk/utils/measurements";
import React, { Fragment } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import styles from "../components/Dashboard.module.scss";

function DashboardChartPie(props) {
  const { data } = props;
  const screenObj = window.screen;
  const labelLine = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, outerRadius, stroke, margin = 10, strokeWidth = 1 } = props;
    const midAngle = props.midAngle;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + outerRadius * cos;
    const sy = cy + outerRadius * sin;
    const tx = cx + (outerRadius + margin) * cos;
    const ty = cy + (outerRadius + margin) * sin;
    if (props.value > 0) {
      return (
        <path
          d={`M${sx},${sy}L${tx},${ty}`}
          stroke={stroke}
          strokeWidth={strokeWidth}
          fill="none"
        />
      );
    }
  };

  const checkMidAngle = (midAngle) => {
    if (screenObj.width <= 1366) {
      if (midAngle > 0 && midAngle <= 75) return true;
      if (midAngle > 140 && midAngle < 190) return true;
      if (midAngle > 310 && midAngle < 360) return true;
      return false;
    }
    return false;
  };

  const getLineWidth = (midAngle) => {
    if (midAngle > 0 && midAngle <= 40) return 10;
    if (midAngle > 40 && midAngle <= 55) return 0;
    if (midAngle > 55 && midAngle <= 90) return 6;
    if (midAngle > 90 && midAngle <= 140) return 0;
    if (midAngle > 140 && midAngle <= 190) return 0;
    if (midAngle > 190 && midAngle <= 220) return -2;
    if (midAngle > 220 && midAngle <= 240) return 8;
    if (midAngle > 240 && midAngle <= 270) return 10;
    if (midAngle > 270 && midAngle <= 300) return 8;
    if (midAngle > 300 && midAngle <= 340) return 6;
    if (midAngle > 340 && midAngle <= 360) return 0;
    if (midAngle > 315 && midAngle <= 340) return 6;
    return 8;
  };

  const LabelRender = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      margin = 10,
      textPadding = 4,
      strokeWidth = 1,
      textStyle = {}
    } = props;

    const { cx, cy, outerRadius, fill, payload } = props;
    const midAngle = props.midAngle;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + margin) * cos;
    const sy = cy + (outerRadius + margin) * sin;
    const ex = sx + (cos >= 0 ? 1 : -1) * getLineWidth(midAngle);
    const ey = sy;
    const textAnchor = cos >= 0 ? "start" : "end";
    if (props.value > 0) {
      let labelLength = props.label ? parseFloat(props.label).toFixed(1) : 0;
      return (
        <g>
          <path
            d={`M${sx},${sy}L${ex},${ey}`}
            stroke={fill}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <text
            x={ex + (cos >= 0 ? 1 : -1) * getLineWidth(midAngle)}
            y={ey - 12}
            textAnchor={textAnchor}
            className={styles.textLabelChart}
            fill="#9A9A9A"
            style={{
              fontSize: labelLength.length > 3 ? toRem(14) : toRem(15)
            }}
            dominantBaseline="central"
            {...textStyle}
          >
            {props.value ? props.value : 0}
          </text>
          {payload.name === "Medium" || checkMidAngle(midAngle) ? (
            <>
              <text
                x={ex + (cos >= 0 ? 1 : -1) * textPadding}
                y={ey}
                textAnchor={textAnchor}
                style={{
                  fontSize: labelLength.length > 3 ? toRem(14) : toRem(15)
                }}
                className={styles.textLabelNameChart}
                fill="#333"
                dominantBaseline="central"
                {...textStyle}
              >
                {props.label ? parseFloat(props.label).toFixed(1) : 0}%
              </text>
              <text
                x={ex + (cos >= 0 ? 1 : -1) * getLineWidth(midAngle)}
                y={ey + 12}
                textAnchor={textAnchor}
                style={{
                  fontSize: labelLength.length > 3 ? toRem(14) : toRem(15)
                }}
                className={styles.textLabelNameChart}
                fill="#333"
                dominantBaseline="central"
                {...textStyle}
              >
                {`${payload.name}`}
              </text>
            </>
          ) : (
            <text
              x={ex + (cos >= 0 ? 1 : -1) * textPadding}
              y={ey}
              textAnchor={textAnchor}
              style={{
                fontSize: labelLength.length > 3 ? toRem(14) : toRem(15)
              }}
              className={styles.textLabelNameChart}
              fill="#333"
              dominantBaseline="central"
              {...textStyle}
            >
              {props.label ? parseFloat(props.label).toFixed(1) : 0}%
              {`${payload.name}`}
            </text>
          )}
        </g>
      );
    }
    return null;
  };

  const getValueFromScreenSize = () => {
    if (screenObj.width >= 1280 && screenObj.width < 1366) {
      return 38;
    }
    if (screenObj.width <= 1920 && screenObj.width >= 1680) {
      return 52;
    }
    if (screenObj.width >= 1366 && screenObj.width < 1920) {
      return 38;
    }
    if (screenObj.width > 1920) {
      return 56;
    }
    return 37;
  };

  const getValueHeightChartFromScreenSize = (value) => {
    if (screenObj.width > 1280 && screenObj.width < 1680) {
      /**
       * 15in
       */
      return value;
    }
    if (screenObj.width <= 1366 && screenObj.width > 1280) {
      //1366 x 768:
      return value;
    }
    if (screenObj.width <= 1920 && screenObj.width >= 1680) {
      /**
       * monitor >1680
       */
      return value + 8;
    }
    if (screenObj.width > 1920 && screenObj.width <= 2056) {
      /**
       * monitor <2056
       */
      return value + 30;
    }
    /**
     * 13in
     */
    return value - 20;
  };

  const dataDefault = [
    {
      color: "#F4F4F4",
      label: "No Value",
      name: "No Value",
      value: 136
    },
    {
      color: "#D8D8D8",
      label: "No Value",
      name: "No Value",
      value: 136
    },
    { color: "#EBEBEB", label: "No Value", name: "No Value", value: 136 }
  ];

  return (
    <Fragment>
      <div className={"flex-center"}>
        <Typography className={styles.dashBoardTitle}>
          <IntlMessages id="dashboard.risk.score.analysis" />
        </Typography>
      </div>
      <ResponsiveContainer
        width={"100%"}
        height={getValueHeightChartFromScreenSize(160)}
      >
        <PieChart>
          {data && data.length > 0 ? (
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              isAnimationActive={false}
              cx="50%"
              cy="50%"
              outerRadius={getValueFromScreenSize()}
              fill="#8884d8"
              label={<LabelRender {...props} />}
              labelLine={labelLine}
            >
              {data?.map((entry, index) => {
                if (parseInt(entry.value) > 0) {
                  return <Cell key={`cell-${index}`} fill={entry.color} />;
                }
                return null;
              })}
            </Pie>
          ) : (
            <Pie
              data={dataDefault}
              dataKey="value"
              nameKey="name"
              isAnimationActive={false}
              cx="50%"
              cy="50%"
              outerRadius={getValueFromScreenSize()}
            >
              {dataDefault?.map((entry, index) => {
                if (parseInt(entry.value) > 0) {
                  return <Cell key={`cell-${index}`} fill={entry.color} />;
                }
                return null;
              })}
            </Pie>
          )}
        </PieChart>
      </ResponsiveContainer>
    </Fragment>
  );
}

export default DashboardChartPie;
