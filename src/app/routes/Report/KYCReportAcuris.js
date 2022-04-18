import React from "react";
import ReportTable from "./components/ReportTable";
import { KYC_REPORT } from "constants/ReportTypesKYCAcuris";

const KYCReportAcuris = () => {
  return <ReportTable reportName="KYC_ACURIS" dataFieldReport={KYC_REPORT} />;
};

export default KYCReportAcuris;
