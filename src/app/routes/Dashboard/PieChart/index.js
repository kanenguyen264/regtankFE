import IntlMessages from "@protego/sdk/UI/IntlMessages";
import React, { Fragment, useState } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
} from "recharts";
import styles from "./PieChart.module.scss";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";

const screenObj = window.screen;

const getValueHeightChartFromScreenSize = (value) => {
  if (screenObj.width >= 1280 && screenObj.width < 1680) {
    /**
     * 1280x768
     */
    return value - 50;
  }
  if (screenObj.width <= 1366 && screenObj.width > 1280) {
    //1366 x 768:
    return value - 70;
  }
  if (screenObj.width <= 1920 && screenObj.width >= 1680) {
    /**
     * monitor >1680
     */
    return value - 30;
  }

  /**
   * 13in
   */
  return value;
};

const getValueWithPieChartFromScreenSize = (value) => {
  if (screenObj.width >= 1280 && screenObj.width < 1680) {
    /**
     * 1280x768
     */
    return value - 90;
  }
  if (screenObj.width <= 1366 && screenObj.width > 1280) {
    //1366 x 768:
    return value - 110;
  }
  if (screenObj.width <= 1920 && screenObj.width >= 1680) {
    /**
     * monitor >1680
     */
    return value - 80;
  }

  /**
   * 13in
   */
  return value;
};

const PieChartComponent = ({ data, listCaption }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeShape, setActiveShape] = useState(false);
  const [selectOption, setSelectOption] = useState(-1);

  const CustomTooltip = ({ activeIndex, active }) => {
    const selectedName = <IntlMessages id={data[activeIndex]?.name ?? ""} />;
    const selectedColor = data[activeIndex]?.color ?? "#F4F4F4";
    const selectTextTooltipColor =
      data[activeIndex]?.colorTextTooltip ?? ThemeColors.white;
    const selectedLabel = data[activeIndex]?.label ?? 0;
    const selectedValue = data[activeIndex]?.value ?? "";
    const selectedColorValue = data[activeIndex]?.colorTooltip ?? "#D8D8D8";
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
      <div
        className={styles.chartTooltip}
        style={{ background: selectedColor, color: selectTextTooltipColor }}
      >
        <div className={styles.tooltip}>
          <div className={styles.leftTooltip} style={{ marginLeft: toRem(8) }}>
            <div>{selectedName}</div>
            <div>{parseFloat(selectedLabel).toFixed(1)} %</div>
          </div>

          <div
            className={styles.valueTooltip}
            style={{
              background: selectedColorValue,
              width: toRem(40),
              height: toRem(40),
              borderRadius: "8px",
            }}
          >
            {+selectedValue >= 100 ? "99+" : selectedValue}
          </div>
        </div>
      </div>
    );
  };

  const renderActiveShape = ({
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
  }) => {
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

  const onMouseAction = () => {
    setActiveShape(false);
  };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
    setSelectOption(-1);
  };

  return (
    <Fragment>
      <ResponsiveContainer
        width={"100%"}
        height={getValueHeightChartFromScreenSize(260)}
      >
        <PieChart>
          <Pie
            stroke="none"
            legendType="circle"
            data={data}
            dataKey="value"
            startAngle={180}
            endAngle={-180}
            cornerRadius={100}
            innerRadius={getValueWithPieChartFromScreenSize(160)}
            outerRadius={getValueWithPieChartFromScreenSize(180)}
            paddingAngle={-10}
            labelLine={false}
            isAnimationActive={true}
            onMouseEnter={onPieEnter}
            activeShape={renderActiveShape}
            onMouseLeave={onMouseAction}
          >
            {data?.map((entry, index) => (
              <Cell key={`slice-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            active={true}
            position={
              activeIndex !== -1 && selectOption !== -1 && { x: 280, y: 180 }
            }
            wrapperStyle={{
              visibility: activeIndex !== -1 ? "visible" : "hidden",
              color: ThemeColors.white,
            }}
            content={<CustomTooltip activeIndex={activeIndex} />}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className={styles.captionContainer}>
        {listCaption?.map((item, index) => {
          return (
            <div key={index} className={styles.caption}>
              <div
                className={styles.colorCaption}
                style={{ backgroundColor: item.color }}
              />
              <div className={styles.contentCaption}>
                <IntlMessages id={item.label} />
              </div>
            </div>
          );
        })}
      </div>
    </Fragment>
  );
};

export default PieChartComponent;
