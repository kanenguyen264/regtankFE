import * as React from "react";

const RADIAN = Math.PI / 180;

function LineLabel(config = {}) {
  const {
      margin = 30,
      lineWidth = 22,
      textPadding = 12,
      strokeWidth = 1,
      textStyle = {}
    } = config,
    ctx = document.createElement("canvas").getContext("2d");

  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = `normal normal ${textStyle.fontWeight ?? 400} ${
    textStyle.fontSize ?? 14
  }px Roboto`;

  function textWidth(text) {
    return ctx.measureText(text).width;
  }
  function calcAngle({
    cx,
    cy,
    outerRadius,
    midAngle: baseAngle,
    startAngle,
    endAngle,
    payload
  }) {
    const wMin = 0,
      wMax = cx * 2.0,
      hMin = 0,
      hMax = cy * 2.0;
    let midAngle = baseAngle,
      sAngle = startAngle,
      eAngle = endAngle,
      sin = () => Math.sin(-RADIAN * midAngle),
      cos = () => Math.cos(-RADIAN * midAngle),
      fdir = () => (cos() >= 0 ? "right" : "left"),
      fmult = () => (cos() >= 0 ? 1 : -1),
      fsx = () =>
        cx +
        (outerRadius + margin) * cos() +
        fmult() * lineWidth +
        fmult() * textPadding +
        fmult() * textWidth(payload.name);

    let sx = fsx(),
      diff = fdir() === "left" ? sx - wMin : sx - wMax;
    if (diff * fmult() < 0) {
      return midAngle;
    }
    let oldSx = null;
    do {
      sx = fsx();
      const dir = fdir();
      diff = dir === "left" ? sx - wMin : sx - wMax;
      //if outside
      if (diff * fmult() > 0) {
        if (dir === "left") eAngle = midAngle;
        else sAngle = midAngle;
      } else {
        //if inside
        if (
          Math.abs(diff) < 1 ||
          (oldSx != null && Math.abs(oldSx - sx) < 0.001)
        ) {
          midAngle = (sAngle + eAngle) / 2.0;
          break;
        }
        if (dir === "left") {
          sAngle = midAngle;
        } else {
          eAngle = midAngle;
        }
      }
      midAngle = (sAngle + eAngle) / 2.0;
      oldSx = sx;
    } while (true);
    if (Math.abs(diff) < 1) return midAngle;
    else return baseAngle;
  }

  return {
    labelLine: (props) => {
      const { cx, cy, outerRadius, stroke } = props;
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
    },
    label: (props) => {
      const { cx, cy, outerRadius, fill, payload } = props;
      // const midAngle = calcAngle(props);
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
              fill="#333"
              dominantBaseline="central"
              {...textStyle}
            >
              {`${payload.name}`}
            </text>
          </g>
        );
      }
      return null;
    }
  };
}

export default LineLabel;
