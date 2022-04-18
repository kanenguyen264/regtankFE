import { List, ListItem } from "@material-ui/core";
import { isEmpty } from "lodash";
import React, { useState, useEffect, useCallback, forwardRef } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
} from "recharts";
import { findIndex } from "lodash";
import styles from "../../../SettingsPage.module.scss";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import { RED, SPRING_BUD, RISK_SCORE_CHART_COLOR } from "constants/ThemeColors";
import {calculatorRebase} from './Table';

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
        baselResidence,
        cpiResidence,
        fatfGoverment,
        baselGoverment,
        cpiGoverment,
        fatfNationality,
        baselNationality,
        cpiNationality,
        activePep,
        inActivePep,
        ool,
        siCorruption,
        siFinancialCrime,
        siOrganizedCrime,
        siTaxCrime,
        siTrafficking,
        siTerror,
        siltCorruption,
        siltFinancialCrime,
        siltOrganizedCrime,
        siltTaxCrime,
        siltTrafficking,
        siltTerror
      } = data;

      try {
        //AML
        let listAMLCFTData = [];
        if (!isEmpty(activePep)) {
          listAMLCFTData.push(activePep);
        }
        if (!isEmpty(inActivePep)) {
          listAMLCFTData.push(inActivePep);
        }

        if (!isEmpty(ool)) {
          listAMLCFTData.push(ool);
        }

        listAMLCFTData.push(
          siCorruption,
          siFinancialCrime,
          siOrganizedCrime,
          siTaxCrime,
          siTrafficking,
          siltCorruption,
          siltFinancialCrime,
          siltOrganizedCrime,
          siltTaxCrime,
          siltTrafficking,
          siTerror,
          siltTerror
        );
        let sumAML = calculatorRebase(listAMLCFTData);

        //Residence
        let listResidence = [fatfResidence, baselResidence, cpiResidence];
        let sumResidence = calculatorRebase(listResidence);

        //Goverment
        let listGoverment = [fatfGoverment, baselGoverment, cpiGoverment];
        let sumGoverment = calculatorRebase(listGoverment);

        //Nationality
        let listNationality = [
          fatfNationality,
          baselNationality,
          cpiNationality,
        ];
        let sumNationality = calculatorRebase(listNationality);
        let SUM = sumAML + sumResidence + sumGoverment + sumNationality;

        const listChart = [
          {
            name: `${parseFloat((sumGoverment / SUM) * 100).toFixed(2)}`,
            value: parseFloat((sumGoverment / SUM) * 100),
            color: RISK_SCORE_CHART_COLOR.GOVERNMENT,
            keyLabel: "governmentId",
          },
          {
            name: `${parseFloat((sumNationality / SUM) * 100).toFixed(2)}`,
            value: parseFloat((sumNationality / SUM) * 100),
            color: RISK_SCORE_CHART_COLOR.NATIONALITY,
            keyLabel: "nationality",
          },
        ];

        if (sumResidence) {
          let sumResidence_Obj = {
            name: `${parseFloat((sumResidence / SUM) * 100).toFixed(2)}`,
            value: parseFloat((sumResidence / SUM) * 100),
            color: RISK_SCORE_CHART_COLOR.RESIDENCE,
            keyLabel: "residence",
          };
          listChart.push(sumResidence_Obj);
        }

        if (activePep && activePep.isActive) {
          let activePep_obj = {
            name: `${parseFloat((activePep.weight / SUM) * 100).toFixed(2)}`,
            value: parseFloat((activePep.weight / SUM) * 100),
            color: RISK_SCORE_CHART_COLOR.ACTIVE_PEP,
            keyLabel: "activePepScoreSetting",
          };
          listChart.push(activePep_obj);
        }

        if (inActivePep && inActivePep.isActive) {
          let inActivePep_obj = {
            name: `${parseFloat((inActivePep.weight / SUM) * 100).toFixed(2)}`,
            value: parseFloat((inActivePep.weight / SUM) * 100),
            color: RISK_SCORE_CHART_COLOR.INACTIVE_PEP,
            keyLabel: "inactivePepScoreSetting",
          };
          listChart.push(inActivePep_obj);
        }

        if (ool && ool.isActive) {
          let ool_obj = {
            name: `${parseFloat((ool.weight / SUM) * 100).toFixed(2)}`,
            value: parseFloat((ool.weight / SUM) * 100),
            color: RISK_SCORE_CHART_COLOR.OOL,
            keyLabel: "OOL",
          };
          listChart.push(ool_obj);
        }

        if (
          siCorruption ||
          siFinancialCrime ||
          siOrganizedCrime ||
          siTaxCrime ||
          siTrafficking ||
          siTerror
        ) {
          let sumSI = calculatorRebase([
            siCorruption,
            siFinancialCrime,
            siOrganizedCrime,
            siTaxCrime,
            siTrafficking,
            siltTerror
          ]);

          let si_obj = {
            name: `${parseFloat((sumSI / SUM) * 100).toFixed(2)}`,
            value: parseFloat((sumSI / SUM) * 100),
            color: RISK_SCORE_CHART_COLOR.SI,
            keyLabel: "SI",
          };
          listChart.push(si_obj);
        }

        if (
          siltCorruption ||
          siltFinancialCrime ||
          siltOrganizedCrime ||
          siltTaxCrime ||
          siltTrafficking ||
          siltTerror
        ) {
          let sumSILT = calculatorRebase([
            siltCorruption,
            siltFinancialCrime,
            siltOrganizedCrime,
            siltTaxCrime,
            siltTrafficking,
            siltTerror
          ]);
          let silt_obj = {
            name: `${parseFloat((sumSILT / SUM) * 100).toFixed(2)}`,
            value: parseFloat((sumSILT / SUM) * 100),
            color: RISK_SCORE_CHART_COLOR.SILT,
            keyLabel: "SILT",
          };
          listChart.push(silt_obj);
        }

        setListDataChart(listChart);
      } catch (error) {
        setListDataChart([]);
      }
    }
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
      fill,
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
      textStyle = { "max-width": 10, "background-color": RED },
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
            fontFamily={fontFamily || "Roboto"}
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
    endAngle,
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
      endAngle,
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
        width={width || (screenObj.width > 1280 ? 680 : 550)}
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
            fill={SPRING_BUD}
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
              visibility: activeIndex !== -1 ? "visible" : "hidden",
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
                  <IntlMessages id={item.desc} />
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
