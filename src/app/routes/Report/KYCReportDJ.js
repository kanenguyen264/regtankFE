import React from "react";
import ReportTable from "./components/ReportTable";
import { KYC_REPORT_DJ } from "constants/ReportTypesKYCDJ";

const KYCReportDJ = () => {
  return <ReportTable reportName="KYC_DJ" dataFieldReport={KYC_REPORT_DJ} />;
};

export default KYCReportDJ;
