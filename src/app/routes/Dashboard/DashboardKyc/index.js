import React, { Fragment, useEffect } from "react";
import KycRiskScoreAnalysis from "./KycRiskScoreAnalysis";
import KycScreenStatistics from "./KycScreenStatistics";
import KycStatus from "./KycStatus";
import { fetchDashboardKYC } from "actions/DashboardAction";
import { useDispatch } from "react-redux";
const DashboardKyc = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    fetchKYC();
    // eslint-disable-next-line
  }, [dispatch]);
  const fetchKYC = () => {
    dispatch(fetchDashboardKYC());
  };
  return (
    <Fragment>
      {/* KYC Screening Statistics */}
      <KycScreenStatistics />

      {/* KYC Risk Score Analysis */}
      <KycRiskScoreAnalysis />

      {/* KYC Status */}
      <KycStatus />
    </Fragment>
  );
};

export default DashboardKyc;
