import React, { forwardRef } from "react";
import { Cell, Label, Pie, PieChart, ResponsiveContainer } from "recharts";
import { filter } from "lodash";

const fontBase = "Arial";
const Chart = forwardRef((props, ref) => {
  const { data } = props;
  let dataDefault = filter(
    data.datasets[0].backgroundColor.map((res, i) => {
      return {
        value: data.datasets[0].data[i],
        color: res
      };
    }),
    function (o) {
      return o.value;
    }
  );
  let dataShow = [];
  if (dataDefault.length > 0) {
    dataShow = dataDefault;
  } else {
    dataShow = [
      {
        value: 100,
        color: "#e5e5e5"
      }
    ];
  }

  function CustomLabel({ data }) {
    return (
      <text y="100" font-family={fontBase} offset="5" x="175" text-anchor="middle">
        <tspan
          fill="#000000"
          font-size="30px"
          x="175"
          dy="1em"
          font-weight="500"
        >
          {data.textNumber}
        </tspan>
        <tspan fill="#C1C1C1" font-size="25px" x="175" dy="1em">
          {data.text[0]}
        </tspan>
        <tspan fill="#C1C1C1" font-size="25px" x="175" dy="1em">
          {data.text[1]}
        </tspan>
      </text>
    );
  }
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    fill
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 1.85;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        font-family="Yahei"
        key={index}
        x={x}
        y={y}
        fill={fill}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  return (
    <>
      <ResponsiveContainer height={330} width={350}>
        <PieChart height={450} ref={ref}>
          <Pie
            data={dataShow}
            cy={290 / 2}
            startAngle={90}
            endAngle={-270}
            innerRadius={80}
            outerRadius={110}
            fill="#8884d8"
            paddingAngle={0}
            dataKey="value"
            isAnimationActive={props.isAnimationActive}
            label={dataDefault.length > 0 ? renderCustomizedLabel : false}
          >
            <Label
              width={30}
              position="center"
              content={<CustomLabel data={data.centerText} />}
            ></Label>

            {dataShow.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </>
  );
});

export default Chart;
