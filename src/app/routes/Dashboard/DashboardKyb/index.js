import React, { Fragment, useEffect } from "react";
import KybRiskScoreAnalysis from "./KybRiskScoreAnalysis";
import KybScreenStatistics from "./KybScreenStatistics";
import KybStatus from "./KybStatus";
import { fetchDashboardKYB } from "actions/DashboardAction";
import { useDispatch } from "react-redux";
const DashboardKyc = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    fetchKYB();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const fetchKYB = () => {
    dispatch(fetchDashboardKYB());
  };
  return (
    <Fragment>
      {/* KYC Screening Statistics */}
      <KybScreenStatistics />

      {/* KYC Risk Score Analysis */}
      <KybRiskScoreAnalysis />

      {/* KYC Status */}
      <KybStatus />
    </Fragment>
  );
};

export default DashboardKyc;
