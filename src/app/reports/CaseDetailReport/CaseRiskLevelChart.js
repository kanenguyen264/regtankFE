import React from "react";
import ReactDOM from "react-dom";
import { svgToPng } from "util/images";
import RiskLevel from "components/Chart/PieChartCase";

export function useCaseRiskLevelChart() {
  return ({ model }) =>
    new Promise(async (resolve) => {
      if (typeof model === "undefined" || model === null) {
        resolve(null);
        return;
      }
      const helperDiv = window.document.createElement("tmp");
      window.document.body.appendChild(helperDiv);
      let chartRef = null;
      const storeChart = async (ref) => {
        if (ref && ref.container) {
          chartRef = ref;
          const svg = chartRef.container.children[0];
          const pngData = await svgToPng(svg, 350, 300);

          resolve(pngData);
          helperDiv.remove();
        }
      };

      ReactDOM.render(
        <div style={{ width: "300px" }}>
          <RiskLevel
            type={"total"}
            data={model}
            ref={storeChart}
            disableValue={true}
            isAnimationActive={false}
          />
        </div>,
        helperDiv
      );
    });
}
