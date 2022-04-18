import { PDFViewer } from "@react-pdf/renderer";
import { KYBMatchDetailsReport } from "app/reports";
import React from "react";
import data from "./data";

const KYTReport = (props) => {
  return (
    <PDFViewer>
      <KYBMatchDetailsReport {...data} />
    </PDFViewer>
  );
};

export default KYTReport;
