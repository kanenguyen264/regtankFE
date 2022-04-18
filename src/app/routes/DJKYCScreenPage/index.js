import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper/LoadingWrapper";

import { PageHeadingProvider } from "@protego/sdk/RegtankUI/v1/PageHeading";
import {
  DJ_KYC_ROUTE_KYC_GROUP_LIST,
  DJ_KYC_ROUTE_MY_KYC,
  DJ_KYC_ROUTE_KYC_SCREEN,
  DJ_KYC_ROUTE_KYC_SCREEN_RESULT,
  DJ_KYC_ROUTE_KYC_SCREEN_DETAIL,
  DJ_KYC_ROUTE_KYC_SCREEN_SCORING,
  DJ_KYC_ROUTE_KYC_ARCHIVE_LIST,
} from "constants/routes";
import React, { memo } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { compose } from "recompose";
import KYCList from "./MyKYC/KYCList";
import ScreenDJKYCForm from "./ScreenDJKYC";
import KYCScreeningResult from "./KYCScreeningResult";
import ScreeningResultDetail from "./KYCMatchDetail/KYCMatchDetail";
import KYCRiskScoringPage from "./KYCRiskScoringPage/RiskScoringPage";

const mapStateToProps = (state) => ({
  loading: state.downJones.loading,
});

const DJKYCPage = ({ loading }) => {
  const _handleCustomUrl = (index, subPath) => {
    if (subPath === "dj-kyc") {
      return [null, DJ_KYC_ROUTE_MY_KYC];
    }
    if (subPath === "screen-kyc") {
      return [<IntlMessages id="screen-kyc" />, DJ_KYC_ROUTE_KYC_SCREEN];
    }
    return null;
  };

  return (
    <PageHeadingProvider customUrlResolver={_handleCustomUrl}>
      <LoadingWrapper loading={loading} size={"3rem"}>
        <Switch>
          <Route
            path={DJ_KYC_ROUTE_KYC_SCREEN_SCORING}
            component={KYCRiskScoringPage}
          />
          <Route
            path={DJ_KYC_ROUTE_KYC_SCREEN_RESULT}
            component={KYCScreeningResult}
            exact
          />
          <Route path={DJ_KYC_ROUTE_KYC_SCREEN} component={ScreenDJKYCForm} />
          <Route
            path={DJ_KYC_ROUTE_KYC_SCREEN_DETAIL}
            component={ScreeningResultDetail}
            exact
          />
          <Route
            path={[
              DJ_KYC_ROUTE_MY_KYC,
              DJ_KYC_ROUTE_KYC_GROUP_LIST,
              DJ_KYC_ROUTE_KYC_ARCHIVE_LIST,
            ]}
            exact
            component={KYCList}
          />
        </Switch>
      </LoadingWrapper>
    </PageHeadingProvider>
  );
};
export default compose(connect(mapStateToProps, null))(memo(DJKYCPage));
