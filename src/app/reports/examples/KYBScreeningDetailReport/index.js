import { PDFViewer } from "@react-pdf/renderer";
import { KYBScreeningDetailsReport } from "app/reports";
import React from "react";
import data from "./data";

const KYBReport = (props) => {
  return (
    <PDFViewer>
      <KYBScreeningDetailsReport {...data} />
    </PDFViewer>
  );
};

export default KYBReport;
