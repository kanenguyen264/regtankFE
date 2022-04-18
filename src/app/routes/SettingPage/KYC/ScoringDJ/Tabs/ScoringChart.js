import React from "react";
import ReactDOM from "react-dom";
import { svgToPng } from "util/images";
import Chart from "../Weight/Chart";
import { useSelector } from "react-redux";
import { listOptionScoringSetting } from "constants/ChartListOption";
import { useIntl } from "react-intl";

/**
 *
 * @param {ScoringDto} model
 */
export function useSettingScoringChart(model) {
  const lang = useSelector((state) => state.settings.locale);
  const { formatMessage } = useIntl();
  const options = listOptionScoringSetting.map((item) => {
    return {
      ...item,
      label: formatMessage({ id: item.label })
    };
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useMemo(
    () =>
      new Promise(async (resolve) => {
        if (typeof model === "undefined" || model === null) {
          resolve(null);
          return;
        }
        const helperDiv = window.document.createElement("tmp");
        const storeChart = async (ref) => {
          if (ref && ref.container) {
            let svg = ref.container.children[0];
            let pngData = await svgToPng(svg, 780, 431);
            helperDiv.remove();
            resolve(pngData);
          }
        };
        ReactDOM.render(
          <Chart
            data={model.weightSetting}
            ref={storeChart}
            listOption={options}
            width={780}
            height={431}
          />,
          helperDiv
        );
      }),
    // eslint-disable-next-line
    [model, lang]
  );
}
