import { PDFViewer } from "@react-pdf/renderer";
import { KYCScreeningDetailsReport } from "app/reports";
import React from "react";
import data from "./data";

const KYCReport = (props) => {
  return (
    <PDFViewer>
      <KYCScreeningDetailsReport {...data} />
    </PDFViewer>
  );
};

export default KYCReport;
