import IntlMessages from "@protego/sdk/UI/IntlMessages";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";

import React, { Fragment } from "react";
import {
  REPORT_KYC_ACURIS,
  REPORT_KYT,
  REPORT_KYB,
  REPORT_KYC_DJ,
} from "constants/routes";
import ReportKYB from "./KYBReport";
import ReportKYT from "./KYTReport";
import ReportKYCAcuris from "./KYCReportAcuris";
import KYCReportDJ from "./KYCReportDJ";
import { Route, Switch } from "react-router";
const ReportPage = (props) => {
  const { match } = props;
  return (
    <Fragment>
      <PageHeading
        title={<IntlMessages id={"url.report"} />}
        match={match}
        customUrlResolver={(index, subPath, isLast) => {
          if (index === 1) {
            return [null, null, false];
          }
          if (subPath === "kyc-acuris") {
            return [
              <IntlMessages id="report.url.kyc.kycAcuris" />,
              null,
              false,
            ];
          }
          if (subPath === "kyc-dow-jones") {
            return [
              <IntlMessages id="report.url.kyc.kyc-dow-jones" />,
              null,
              false,
            ];
          }
          if (subPath === "kyb") {
            return [<IntlMessages id="report.url.kyb" />, null, false];
          }
          if (subPath === "kyt") {
            return [<IntlMessages id="report.url.kyt" />, null, false];
          }
        }}
      />

      <Switch>
        <Route exact path={REPORT_KYC_DJ}>
          <KYCReportDJ />
        </Route>
        <Route exact path={REPORT_KYC_ACURIS}>
          <ReportKYCAcuris />
        </Route>
        <Route exact path={REPORT_KYB}>
          <ReportKYB />
        </Route>
        <Route exact path={REPORT_KYT}>
          <ReportKYT />
        </Route>
      </Switch>
    </Fragment>
  );
};

export default ReportPage;
