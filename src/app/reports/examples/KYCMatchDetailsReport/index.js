import { PDFViewer } from "@react-pdf/renderer";
import { KYCMatchDetailsReport } from "app/reports";
import React from "react";
import data from "./data";

const KYTReport = (props) => {
  return (
    <PDFViewer>
      <KYCMatchDetailsReport {...data} />
    </PDFViewer>
  );
};

export default KYTReport;
