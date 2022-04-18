import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper/LoadingWrapper";

import { PageHeadingProvider } from "@protego/sdk/RegtankUI/v1/PageHeading";
import {
  KYB_ROUTE_KYB_ARCHIVE_LIST,
  KYB_ROUTE_KYB_SCREEN,
  KYB_ROUTE_KYB_SCREEN_DETAIL,
  KYB_ROUTE_KYB_SCREEN_RESULT,
  KYB_ROUTE_KYB_GROUP_LIST,
  KYB_ROUTE_MY_KYB,
  KYB_ROUTE_RISK_ASSESSMENT,
} from "constants/routes";
import React, { memo } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { Route, Switch } from "react-router-dom";
import { compose } from "recompose";
import ScreenKYBForm from "./components/ScreenKYBForm";
import ScreeningResultDetail from "./KYBMatchDetail";
import KYBRiskAssessment from "./KYBRiskAssessment";
import KYBScreeningResult from "./KYBScreeningResult";
import KYBList from "./MyKYB/KYBList";

const mapStateToProps = (state) => ({
  loading: state.kyb.loading,
});

const KYBPage = ({ loading }) => {
  const _handleCustomUrl = (index, subPath) => {
    if (subPath === "kyb") {
      return [null, KYB_ROUTE_MY_KYB];
    }
    if (subPath === "screen-kyb") {
      return [<IntlMessages id="screen-kyb" />, KYB_ROUTE_MY_KYB];
    }
    return null;
  };

  return (
    <PageHeadingProvider customUrlResolver={_handleCustomUrl}>
      <LoadingWrapper loading={loading} size={"3rem"}>
        <Switch>
          <Route
            path={KYB_ROUTE_KYB_SCREEN_RESULT}
            component={KYBScreeningResult}
            exact
          />
          <Route
            path={KYB_ROUTE_KYB_SCREEN_DETAIL}
            component={ScreeningResultDetail}
            exact
          />

          <Route path={KYB_ROUTE_KYB_SCREEN} component={ScreenKYBForm} />
          <Route
            path={KYB_ROUTE_RISK_ASSESSMENT}
            exact
            component={KYBRiskAssessment}
          />
          <Route
            path={[
              KYB_ROUTE_KYB_GROUP_LIST,
              KYB_ROUTE_KYB_ARCHIVE_LIST,
              KYB_ROUTE_MY_KYB,
            ]}
            exact
            component={KYBList}
          />
          <Route exact path={["/app/kyb-screen"]}>
            <Redirect to={KYB_ROUTE_KYB_SCREEN} />
          </Route>
        </Switch>
      </LoadingWrapper>
    </PageHeadingProvider>
  );
};

export default compose(connect(mapStateToProps, null))(memo(KYBPage));
