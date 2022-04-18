import { toRem } from "@protego/sdk/utils/measurements";
import clsx from "clsx";
import React, { forwardRef, useEffect } from "react";
import { Cell, Label, Pie, PieChart, ResponsiveContainer } from "recharts";
import styles from "./PieChart.module.scss";

const Chart = forwardRef((props, ref) => {
  const { data, type, disableValue, showBlacklist } = props;
  const angleDefault = { value: 10, color: "#EEEEEE" };
  let dataDefault = [];
  for (let i = 0; i < 10; i++) {
    dataDefault.push({ value: 10, color: "#EEEEEE" });
  }
  const [dataShow, setDataShow] = React.useState(dataDefault);
  useEffect(() => {
    if (type === "total") {
      const dataTemp = dataShow.map((item, index) => {
        switch (data.textLevel) {
          case "HIGH":
            if (index > 6 && index < 10) {
              item.color = data.centerText.colorText;
            } else {
              item = angleDefault;
            }
            break;
          case "MEDIUM":
            if (index >= 3 && index < 7) {
              item.color = data.centerText.colorText;
            } else {
              item = angleDefault;
            }
            break;
          case "LOW":
            if (index >= 0 && index < 3) {
              item.color = data.centerText.colorText;
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
    }
    if (type === "sanction") {
      const dataTemp = dataShow.map((item, index) => {
        item.color = data.centerText.colorText;
        return item;
      });
      setDataShow(dataTemp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, type]);

  function CustomLabelBL({ data }) {
    return (
      <svg x="75" y="103">
        <text y="35" font-family="Arial" offset="5" x="50" text-anchor="middle">
          <tspan fill="#252525" font-size="15px">
            {"Blacklisted"}
          </tspan>
        </text>
        <svg
          width="200"
          height="80"
          viewBox="0 0 55 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            width="28"
            height="8"
            rx="4"
            cx="500"
            cy="50"
            fill="#2D3959"
            fill-opacity="0.2"
          ></rect>
        </svg>
      </svg>
    );
  }
  return (
    <>
      <ResponsiveContainer height={150}>
        <PieChart height={150} ref={ref}>
          <Pie
            data={dataShow}
            cy={"70%"}
            startAngle={180}
            endAngle={0}
            innerRadius={80}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={0}
            dataKey="value"
            blendStroke
            isAnimationActive={props.isAnimationActive}
          >
            <Label
              value={data.centerText.text[0]}
              fill={data.centerText.colorText}
              position="centerBottom"
              fontSize="25px"
              fontWeight="700"
              fontFamily="Arial"
            />
            {showBlacklist && (
              <Label
                width={30}
                position="center"
                content={<CustomLabelBL data={data.centerText} />}
              ></Label>
            )}

            {dataShow.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {!disableValue && (
        <div style={{ marginTop: toRem(13) }}>
          {type === "total" ? (
            <div
              style={{ width: "100%", fontSize: toRem(48), fontWeight: "700" }}
            >
              <center>
                <span style={{ color: data.centerText.colorNumber }}>
                  {data.centerText.textNumber}
                </span>
              </center>
            </div>
          ) : (
            <div className={styles.KeywordWrap}>
              <div className={clsx(styles.Root, data.centerText.className)}>
                {data.centerText.textNumber}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
});

export default Chart;
