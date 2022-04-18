import PropTypes from "prop-types";
import React from "react";
import { Doughnut } from "react-chartjs-2";

const optionDefault = {
  responsive: true,
  legend: {
    display: false
  },
  cutoutPercentage: 75,
  borderWidth: 0,
  animation: {
    animateScale: true,
    animateRotate: true
  },
  centerText: {
    colorNumber: "#252525",
    colorText: "#A3A3A3",
    fontStyle: "Roboto",
    textNumber: 0
  }
};

const getTooltipsPercent = (labelTooltips, enabled) => {
  return {
    tooltips: {
      enabled: enabled,
      mode: "point",
      intersect: false,
      displayColors: false,
      callbacks: {
        beforeLabel: function (tooltipItem, data) {
          let datasetLabel = data.labels[tooltipItem.index];
          return `${datasetLabel}`;
        },
        label: function (tooltipItem, data) {
          let label =
            data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          if (labelTooltips) {
            label += `% ${data.labelTooltips[tooltipItem.index]}`;
          }
          return label;
        }
      }
    }
  };
};

const getTooltipsTotal = () => {
  return {
    tooltips: {
      mode: "point",
      intersect: false,
      displayColors: false,
      callbacks: {
        label: function (tooltipItem, data) {
          let label =
            data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          return label;
        }
      }
    }
  };
};

const getTooltipsSanction = () => {
  return {
    tooltips: {
      enabled: false
    }
  };
};

function roundRect(ctx, x, y, width, height, radius, fill, stroke = false) {
  if (typeof stroke == "undefined") {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 5;
  }
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (stroke) {
    ctx.stroke();
  }
  if (fill) {
    ctx.fill();
  }
}

const plugins = [
  {
    beforeDraw: (chart) => {
      if (chart.config.data.centerText) {
        //Get ctx from string
        const ctx = chart.chart.ctx;
        ctx.save();
        const centerConfig = chart.config.data.centerText;

        //Get options from the center object in options
        const screenObj = window.screen;

        const fontStyle = centerConfig.fontStyle || "Roboto";
        const arrText = centerConfig.text;
        const color = centerConfig.colorText || "#A3A3A3";
        const sidePadding = centerConfig.sidePadding || 20;
        const sidePaddingCalculated =
          (sidePadding / 100) * (chart.innerRadius * 2);

        //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
        const elementWidth = chart.innerRadius * 2 - sidePaddingCalculated;
        let stringWidth = 80;

        arrText.forEach((text) => {
          const textWith = ctx.measureText(text).width;
          if (textWith > stringWidth) {
            stringWidth = textWith;
          }
        });

        // Find out how much the font can grow in width.
        const widthRatio = elementWidth / stringWidth;

        const newFontSize = Math.floor(14 * widthRatio);
        const elementHeight = chart.innerRadius * 2;

        // Pick a new font size so it will not be larger than the height of label.
        const fontSizeToUse = Math.min(newFontSize, elementHeight);

        //Set font settings to draw it correctly.
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        let pos = 2;
        let posNumber = 2.3;
        let rowHeight = 0.35;
        const typeChart = chart.config.data.type;

        switch (typeChart) {
          case "percent":
            rowHeight = 0.37;
            posNumber = 2.7;
            pos = 2.3;
            break;

          case "sanction":
            rowHeight = 0.38;
            break;

          default:
            break;
        }

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const centerXnumb = (chart.chartArea.left + chart.chartArea.right) / 2;
        const centerYnumb =
          (chart.chartArea.top + chart.chartArea.bottom) / posNumber;
        ctx.font = `38px ${fontStyle}`;

        if (screenObj.width <= 1680 && screenObj.width > 1366) {
          ctx.font = `30px ${fontStyle}`;
        }

        if (screenObj.width <= 1366) {
          ctx.font = `26px ${fontStyle}`;
        }

        if (screenObj.width <= 1280) {
          ctx.font = `20px ${fontStyle}`;
        }
        //For number
        ctx.fillStyle = centerConfig.colorNumber || color;
        if (typeChart === "sanction") {
          ctx.font = `700 ${fontSizeToUse}px ${fontStyle}`;
          ctx.fillText(centerConfig.textNumber, centerXnumb, centerYnumb);
        } else {
          ctx.fillText(centerConfig.textNumber, centerXnumb, centerYnumb);
        }

        let centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
        if (typeChart === "sanction") {
          const textCenter = arrText[0];
          pos = 2;
          const centerY = (chart.chartArea.top + chart.chartArea.bottom) / pos;

          //Draw text in center
          ctx.fillStyle = "#E0EEDD";
          const textSanctionWith = ctx.measureText(textCenter).width;

          const metrics = ctx.measureText(textCenter);

          const fontHeight =
            metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
          const boxWidth = textSanctionWith + textSanctionWith / 4;
          const boxHight = fontHeight + fontHeight / 4;

          roundRect(
            ctx,
            centerX - boxWidth / 2,
            centerY + 5,
            boxWidth,
            boxHight,
            boxHight / 2,
            true,
            false
          );
          ctx.fillStyle = color;
          ctx.font = `400 ${fontSizeToUse}px ${fontStyle}`;
          ctx.fillText(textCenter, centerX, centerY + boxHight / 2 + 5);
        } else {
          arrText.map((txt, index) => {
            pos = pos - rowHeight;
            const centerY =
              (chart.chartArea.top + chart.chartArea.bottom) / pos;
            ctx.font = fontSizeToUse + "px " + fontStyle;
            ctx.fillStyle = color;
            //Draw text in center
            ctx.fillText(txt, centerX, centerY);
            return txt;
          });
        }

        ctx.restore();
      }
    }
  }
];

const DoughnutChart = ({ data, type }) => {
  const { labelTooltips, isEmpty } = data;
  let options = {};
  switch (type) {
    case "percent":
      options = getTooltipsPercent(labelTooltips, !isEmpty);
      break;
    case "total":
      options = getTooltipsTotal();
      break;
    case "sanction":
      options = getTooltipsSanction();
      break;
    default:
      break;
  }
  options = {
    ...optionDefault,
    ...options
  };
  return (
    <>
      <Doughnut
        data={{ ...data, type }}
        options={options}
        height={190}
        plugins={plugins}
      />
    </>
  );
};

DoughnutChart.propTypes = {
  data: PropTypes.object,
  type: PropTypes.string
};

export default DoughnutChart;
