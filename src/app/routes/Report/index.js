// export { default } from "./router";

import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper/LoadingWrapper";

import { PageHeadingProvider } from "@protego/sdk/RegtankUI/v1/PageHeading";
import {
  REPORT_KYB,
  REPORT_KYC,
  REPORT_KYT,
  REPORT_KYC_ACURIS,
  REPORT_KYC_DJ,
} from "constants/routes";
import React, { memo } from "react";
import { Route, Switch } from "react-router-dom";
import List from "./ReportPage";
const ReportPage = ({ loading }) => {
  return (
    <PageHeadingProvider>
      <LoadingWrapper loading={loading} size={"3rem"}>
        <Switch>
          <Route
            path={[
              REPORT_KYB,
              REPORT_KYT,
              REPORT_KYC,
              REPORT_KYC_ACURIS,
              REPORT_KYC_DJ,
            ]}
            exact
            component={List}
          />
        </Switch>
      </LoadingWrapper>
    </PageHeadingProvider>
  );
};
export default memo(ReportPage);
