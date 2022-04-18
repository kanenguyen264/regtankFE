import React, { Fragment } from "react";
import KytRiskScoreAnalysis from "./KytRiskScoreAnalysis";
import KytScreenStatistics from "./KytScreenStatistics";
import KytAssetAttribution from "./KytAssetAttribution";
import { fetchDashboardKYT } from "actions/DashboardAction";
import { useDispatch } from "react-redux";
const DashboardKyc = () => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    fetchKYT();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  const fetchKYT = () => {
    dispatch(fetchDashboardKYT());
  };

  return (
    <Fragment>
      {/* KYT Screening Statistics */}
      <KytScreenStatistics />

      {/* KYTRisk Score Analysis */}
      <KytRiskScoreAnalysis />

      {/* KYT Status */}
      <KytAssetAttribution />
    </Fragment>
  );
};

export default DashboardKyc;
