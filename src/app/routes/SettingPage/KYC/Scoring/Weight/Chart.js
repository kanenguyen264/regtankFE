import { List, ListItem } from "@material-ui/core";
import { isEmpty } from "lodash";
import React, { useState, useEffect, useCallback, forwardRef } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip
} from "recharts";
import { findIndex } from "lodash";
import styles from "../../../SettingsPage.module.scss";

const Chart = forwardRef((props, ref) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeShape, setActiveShape] = useState(false);
  const [listDataChart, setListDataChart] = useState([]);
  const [selectOption, setSelectOption] = useState(-1);
  const { data, listOption, width, height, fontFamily } = props;
  const screenObj = window.screen;
  useEffect(() => {
    setData(data);
    // eslint-disable-next-line
  }, [data]);

  const setData = (data) => {
    if (data) {
      const {
        fatfResidence,
        adverseMedia,
        lawEnforcement,
        financialRegulator,
        previouslySanction,
        pepScoreSetting,
        fatfNationality,
        baselResidence,
        cpiResidence,
        fatfGoverment,
        baselGoverment,
        cpiGoverment,
        baselNationality,
        cpiNationality
      } = data;

      try {
        let listAMLCFTData = [];
        if (!isEmpty(pepScoreSetting)) {
          listAMLCFTData.push(pepScoreSetting);
        }

        if (!isEmpty(previouslySanction)) {
          listAMLCFTData.push(previouslySanction);
        }

        if (!isEmpty(financialRegulator)) {
          listAMLCFTData.push(financialRegulator);
        }

        if (!isEmpty(lawEnforcement)) {
          listAMLCFTData.push(lawEnforcement);
        }

        if (!isEmpty(adverseMedia)) {
          listAMLCFTData.push(adverseMedia);
        }

        let sumAML = calculatorRebase(listAMLCFTData);

        let listResidence = [fatfResidence, baselResidence, cpiResidence];
        let sumResidence = calculatorRebase(listResidence);

        let listGoverment = [fatfGoverment, baselGoverment, cpiGoverment];
        let sumGoverment = calculatorRebase(listGoverment);

        let listNationality = [
          fatfNationality,
          baselNationality,
          cpiNationality
        ];
        let sumNationality = calculatorRebase(listNationality);
        let SUM = sumAML + sumResidence + sumGoverment + sumNationality;

        const listChart = [
          {
            name: `${parseFloat((sumGoverment / SUM) * 100).toFixed(2)}`,
            value: parseFloat((sumGoverment / SUM) * 100),
            color: "#1EB4FD",
            keyLabel: "governmentId"
          },
          {
            name: `${parseFloat((sumNationality / SUM) * 100).toFixed(2)}`,
            value: parseFloat((sumNationality / SUM) * 100),
            color: "#F05796",
            keyLabel: "nationality"
          }
        ];

        if (sumResidence) {
          let sumAML_Obj = {
            name: `${parseFloat((sumResidence / SUM) * 100).toFixed(2)}`,
            value: parseFloat((sumResidence / SUM) * 100),
            color: "#426AB4",
            keyLabel: "residence"
          };
          listChart.push(sumAML_Obj);
        }

        if (adverseMedia) {
          if (adverseMedia.isActive) {
            let adverseMedia_obj = {
              name: `${parseFloat((adverseMedia.weight / SUM) * 100).toFixed(
                2
              )}`,
              value: parseFloat((adverseMedia.weight / SUM) * 100),
              color: "#A541A3",
              keyLabel: "adverseMedia"
            };
            listChart.push(adverseMedia_obj);
          }
        }

        if (lawEnforcement) {
          if (lawEnforcement.isActive) {
            let lawEnforcement_obj = {
              name: `${parseFloat(
                (checkIsEmpty(lawEnforcement.weight) / SUM) * 100
              ).toFixed(2)}`,
              value: parseFloat((lawEnforcement.weight / SUM) * 100),
              color: "#3ACD83",
              keyLabel: "lawEnforcement"
            };
            listChart.push(lawEnforcement_obj);
          }
        }

        if (financialRegulator) {
          if (financialRegulator.isActive) {
            let financialRegulator_obj = {
              name: `${parseFloat(
                (financialRegulator.weight / SUM) * 100
              ).toFixed(2)}`,
              value: parseFloat(
                (checkIsEmpty(financialRegulator.weight) / SUM) * 100
              ),
              color: "#FAC02C",
              keyLabel: "financialRegulator"
            };
            listChart.push(financialRegulator_obj);
          }
        }

        if (previouslySanction) {
          if (previouslySanction.isActive) {
            let previouslySanction_obj = {
              name: `${parseFloat(
                (previouslySanction.weight / SUM) * 100
              ).toFixed(2)}`,
              value: parseFloat(
                (checkIsEmpty(previouslySanction.weight) / SUM) * 100
              ),
              color: "#F47744",
              keyLabel: "previouslySanctioned"
            };
            listChart.push(previouslySanction_obj);
          }
        }

        if (pepScoreSetting) {
          if (pepScoreSetting.isActive) {
            let pepScoreSetting_obj = {
              name: `${parseFloat((pepScoreSetting.weight / SUM) * 100).toFixed(
                2
              )}`,
              value: parseFloat(
                (checkIsEmpty(pepScoreSetting.weight) / SUM) * 100
              ),
              color: "#F4473E",
              keyLabel: "pepScoreSetting"
            };
            listChart.push(pepScoreSetting_obj);
          }
        }

        setListDataChart(listChart);
      } catch (error) {
        setListDataChart([]);
      }
    }
  };

  const checkIsEmpty = (value) => {
    return value ? value : 0;
  };

  const calculatorRebase = (list) => {
    try {
      var getWatt = list.reduce(
        (acc, curr) =>
          parseInt(acc) +
          parseInt(curr.weight && curr.isActive ? curr.weight : 0),
        0
      );
      return getWatt;
    } catch (error) {}
  };

  const onPressChartOption = (select, index) => {
    const position = findIndex(listDataChart, (o) => {
      return o.keyLabel === select.keyLabel;
    });

    if (position > -1) {
      setSelectOption(index);
      setActiveIndex(position);
      setActiveShape(true);
    }
  };

  const CustomTooltip = (props) => {
    const { activeIndex, active, position } = props;
    let activeCurrent = active;
    try {
      if (!active && selectOption === -1) {
        return null;
      } else {
        activeCurrent = true;
      }
    } catch (error) {}
    setActiveShape(activeCurrent);

    return (
      !position && (
        <div className={styles.chartTooltip}>
          <text>{listDataChart[activeIndex]?.name}%</text>
        </div>
      )
    );
  };

  const onMouseAction = () => {
    setActiveShape(false);
  };

  const renderActiveShape = (props) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill
    } = props;
    let outerRadiusActive = activeShape ? outerRadius + 20 : outerRadius;
    if (activeShape) {
      return (
        <>
          <g style={{ opacity: 0.2 }}>
            <Sector
              cx={cx}
              cy={cy}
              innerRadius={innerRadius}
              outerRadius={outerRadiusActive}
              startAngle={startAngle}
              endAngle={endAngle}
              fill={fill}
            />
          </g>
          <Sector
            cx={cx}
            cy={cy}
            style={{ zIndex: 2 }}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            startAngle={startAngle}
            endAngle={endAngle}
            fill={fill}
          />
        </>
      );
    } else {
      return (
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      );
    }
  };

  const labelLine = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, outerRadius, stroke, margin = 30, strokeWidth = 1 } = props;
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

  const getLabelFromKey = (keyLabel) => {
    let indexLabel =
      listOption && listOption.findIndex((i) => i.keyLabel === keyLabel);

    return listOption && indexLabel !== -1 ? listOption[indexLabel].label : "";
  };

  const label = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      margin = 30,
      lineWidth = 22,
      textPadding = 12,
      strokeWidth = 1,
      textStyle = { "max-width": 30, "background-color": "red" }
    } = props;

    const { cx, cy, outerRadius, fill, payload } = props;
    const midAngle = props.midAngle;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + margin) * cos;
    const sy = cy + (outerRadius + margin) * sin;
    const ex = sx + (cos >= 0 ? 1 : -1) * lineWidth;
    const ey = sy;
    const textAnchor = cos >= 0 ? "start" : "end";
    if (props.value > 0) {
      return (
        <g>
          <path
            d={`M${sx},${sy}L${ex},${ey}`}
            stroke={fill}
            strokeWidth={strokeWidth}
            fill="none"
          />

          <text
            x={ex + (cos >= 0 ? 1 : -1) * textPadding}
            y={ey}
            textAnchor={textAnchor}
            fill={props.color}
            dominantBaseline="central"
            fontFamily={fontFamily || "Arial"}
            {...textStyle}
          >
            {`${payload.name}% `}
            {getLabelFromKey(payload.keyLabel)}
          </text>
        </g>
      );
    }
    return null;
  };

  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
      setSelectOption(-1);
    },
    [setActiveIndex]
  );

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    payload,
    color,
    startAngle,
    endAngle
  }) => {
    const RADIAN = Math.PI / 180;
    const diffAngle = endAngle - startAngle;
    const delta = (360 - diffAngle) / 15 - 1;
    const radius = innerRadius + (outerRadius - innerRadius);
    const x = cx + (radius + delta) * Math.cos(-midAngle * RADIAN);
    const y = cy + (radius + delta * delta) * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill={color}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontWeight="normal"
      >
        {`${payload.name}% `}
        {getLabelFromKey(payload.keyLabel)}
      </text>
    );
  };

  const renderCustomizedLabelLine = (props) => {
    let {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      color,
      startAngle,
      endAngle
    } = props;
    const RADIAN = Math.PI / 180;
    const diffAngle = endAngle - startAngle;
    const radius = innerRadius + (outerRadius - innerRadius);
    let path = "";
    for (let i = 0; i < (360 - diffAngle) / 15; i++) {
      path += `${cx + (radius + i) * Math.cos(-midAngle * RADIAN)},${
        cy + (radius + i * i) * Math.sin(-midAngle * RADIAN)
      } `;
    }
    return <polyline points={path} stroke={color} fill="none" />;
  };

  const checkPercent = Object.values(listDataChart).findIndex(
    (item) => parseInt(item.name) > 90
  );

  return (
    <>
      <ResponsiveContainer
        width={width || (screenObj.width > 1280 ? 780 : 630)}
        height={height || 431}
      >
        <PieChart height={431} ref={ref}>
          <Pie
            data={listDataChart}
            activeIndex={activeIndex}
            isAnimationActive={false}
            activeShape={renderActiveShape}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            label={checkPercent > 0 ? renderCustomizedLabel : label}
            labelLine={checkPercent > 0 ? renderCustomizedLabelLine : labelLine}
            onMouseEnter={onPieEnter}
            onMouseLeave={onMouseAction}
          >
            {listDataChart?.map((entry, index) => {
              if (parseInt(entry.value) > 0) {
                return <Cell key={`cell-${index}`} fill={entry.color} />;
              }
              return null;
            })}
          </Pie>
          <Tooltip
            active={true}
            position={
              activeIndex !== -1 && selectOption !== -1 && { x: 280, y: 180 }
            }
            wrapperStyle={{
              visibility: activeIndex !== -1 ? "visible" : "hidden"
            }}
            content={<CustomTooltip activeIndex={activeIndex} />}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className={styles.chartContainer}>
        <List>
          {listOption?.map((item, index) => {
            return (
              <ListItem
                key={index}
                selected={selectOption === index ? true : false}
                button
                onClick={() => onPressChartOption(item, index)}
              >
                <div
                  className={styles.chartItemColor}
                  style={{ backgroundColor: item.color }}
                />
                <text className={styles.chartTextDescription}>
                  {item.label}
                </text>
              </ListItem>
            );
          })}
        </List>
      </div>
    </>
  );
});

export default Chart;
