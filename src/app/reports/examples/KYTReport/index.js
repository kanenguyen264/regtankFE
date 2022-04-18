import { PDFViewer } from "@react-pdf/renderer";
import { KYTScreeningDetailsReport } from "app/reports";
import React from "react";
import data from "./data";

const KYTReport = (props) => {
  return (
    <PDFViewer>
      <KYTScreeningDetailsReport {...data} />
    </PDFViewer>
  );
};

export default KYTReport;
