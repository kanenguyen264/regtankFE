import { PDFViewer } from "@react-pdf/renderer";
import { KYCRiskScoringReport } from "app/reports";
import withReportProvider from "app/reports/components/withReportProvider";
import { useSettingScoringChart } from "app/routes/SettingPage/KYC/Scoring/components/ScoringChart";
import React, { useEffect, useState } from "react";
import { compose } from "recompose";
import data from "./data";

const KYCRisk = compose(withReportProvider)((props) => {
  const chartDataPromise = useSettingScoringChart(data.scoring);
  const [chartSetting, setChartSetting] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      const imgBase64 = await chartDataPromise;
      setChartSetting(imgBase64);
    };

    fetchImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    chartSetting && (
      <PDFViewer>
        <KYCRiskScoringReport {...data} chartSetting={chartSetting} />
      </PDFViewer>
    )
  );
});

export default KYCRisk;
