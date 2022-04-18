import { PDFViewer } from "@react-pdf/renderer";
import { KYBRiskScoringReport } from "app/reports";
import React from "react";
import data from "./data";

const KYTReport = (props) => {
  return (
    <PDFViewer>
      <KYBRiskScoringReport {...data} />
    </PDFViewer>
  );
};

export default KYTReport;
