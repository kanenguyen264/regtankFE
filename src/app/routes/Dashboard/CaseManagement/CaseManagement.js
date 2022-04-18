import IntlMessages from "@protego/sdk/UI/IntlMessages";
import JRCard from "@protego/sdk/UI/JRCard/JRCard";
import styles from "app/routes/Dashboard/Dashboard.module.scss";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis
} from "recharts";

function CaseManagement(props) {
  const intl = useIntl();
  const { data } = props;
  const refBarChart = useRef(null);
  const locale = useSelector((state) => state.settings.locale);
  const [list, setList] = useState([]);

  useEffect(() => {
    createChart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, locale]);

  const createChart = () => {
    const dataObjectKyt = {
      name: intl.formatMessage({ id: "dashboard.withKYT" }),
      withKyt: data?.withKyt,
      valuePercent: getPercent(data?.withKyt, data?.total)
    };

    const dataObjectWithoutKyc = {
      name: intl.formatMessage({ id: "dashboard.withoutKYT" }),
      withoutKyt: data?.withoutKyt,
      valuePercent: getPercent(data?.withoutKyt, data?.total)
    };

    const dataObjectTotal = {
      name: intl.formatMessage({ id: "dashboard.totalCases" }),
      withKyt: data?.withKyt,
      withoutKyt: data?.withoutKyt,
      valuePercent: "100%"
    };

    const listData = [];
    listData?.push(dataObjectKyt);
    listData?.push(dataObjectWithoutKyc);
    listData?.push(dataObjectTotal);
    setList(listData);
  };

  const getPercent = (value, total) => {
    const ratio = total > 0 ? value / total : 0;
    let ratioPercent = ratio * 100;
    return `${Math.round(ratioPercent)}%`;
  };

  const draw = ({ x, y, width, height, fill, withKyt, withoutKyt }) => {
    return (
      <g>
        {!withKyt || !withoutKyt ? (
          <rect x={x} y={y} width={width} height={height} rx={10} fill={fill} />
        ) : withKyt && fill === "#B05FF8" ? (
          <g>
            <defs>
              <clipPath id="round-corner1">
                <rect
                  x={x}
                  y={y - 10}
                  width={width}
                  height={height + 10}
                  rx="10"
                />
              </clipPath>
            </defs>
            <rect
              clipPath="url(#round-corner1)"
              x={x}
              y={y}
              width={width}
              height={height}
              fill={fill}
            />
          </g>
        ) : (
          <g>
            <defs>
              <clipPath id="round-corner2">
                <rect x={x} y={y} width={width} height={height + 10} rx="10" />
              </clipPath>
            </defs>
            <rect
              x={x}
              y={y}
              clipPath="url(#round-corner2)"
              width={width}
              height={height}
              fill={fill}
            />
          </g>
        )}
      </g>
    );
  };

  return (
    <JRCard
      disableShadow
      className={clsx(styles.cardDashBoardCase, "flex-grow-1 d-flex")}
    >
      <div className="d-flex flex-column flex-grow-1">
        <div className={clsx(styles.titleLg, "mb-2")}>
          <IntlMessages id={"dashboard.case.CaseManagement"} />
        </div>
        <div className="mb-3" style={{ fontSize: 14 }}>
          <IntlMessages id={"dashboard.case.case"} />
        </div>

        <div
          className="flex-grow-1"
          ref={refBarChart}
          style={{ margin: "0 0 -1rem -1rem" }}
        >
          <ResponsiveContainer>
            <BarChart data={list} barGap={0}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                tickMargin={10}
                fontSize={16}
                tickLine={false}
                axisLine={false}
                fontWeight={400}
                stroke="#202020"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickCount={10}
                allowDecimals={false}
                width={30}
                fontSize={14}
              />
              <Bar
                fill="#B05FF8"
                dataKey="withKyt"
                stackId="a"
                maxBarSize={40}
                barSize={40}
                isAnimationActive={false}
                shape={draw}
              >
                <LabelList dataKey="valuePercent" position="top" />
              </Bar>
              <Bar
                fill="#2979FF"
                dataKey="withoutKyt"
                stackId="a"
                maxBarSize={40}
                barSize={40}
                isAnimationActive={false}
                shape={draw}
              >
                <LabelList dataKey="valuePercent" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </JRCard>
  );
}

export default CaseManagement;
