import { PDFViewer } from "@react-pdf/renderer";
import { CaseDetailReport } from "app/reports";
import React from "react";
import data from "./data";

const CaseReportExample = (props) => {
  return (
    <PDFViewer>
      <CaseDetailReport {...data} />
    </PDFViewer>
  );
};

export default CaseReportExample;
