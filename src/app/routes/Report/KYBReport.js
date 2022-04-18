import React from "react";
import ReportTable from "./components/ReportTable";
import { KYB_REPORT } from "constants/ReportTypesKYB";

const ReportKYB = () => {
  return <ReportTable reportName="KYB" dataFieldReport={KYB_REPORT} />;
};

export default ReportKYB;
