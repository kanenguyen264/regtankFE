import React from "react";
import ReportTable from "./components/ReportTable";
import { KYT_REPORT } from "constants/ReportTypesKYT";

const ReportKYT = () => {
  return <ReportTable reportName="KYT" dataFieldReport={KYT_REPORT} />;
};

export default ReportKYT;
