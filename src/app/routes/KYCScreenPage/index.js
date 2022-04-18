import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper/LoadingWrapper";
import { PageHeadingProvider } from "@protego/sdk/RegtankUI/v1/PageHeading";
import {
  KYC_ROUTE_KYC_ARCHIVE_LIST,
  KYC_ROUTE_KYC_GROUP_LIST,
  KYC_ROUTE_KYC_SCREEN,
  KYC_ROUTE_KYC_SCREEN_DETAIL,
  KYC_ROUTE_KYC_SCREEN_RESULT,
  KYC_ROUTE_KYC_SCREEN_SCORING,
  KYC_ROUTE_MY_KYC,
} from "constants/routes";
import React, { memo } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { compose } from "recompose";
import ScreeningResultDetail from "./KYCMatchDetail/KYCMatchDetail";
import KYCRiskScoringPage from "./KYCRiskScoringPage/RiskScoringPage";
import KYCScreeningResult from "./KYCScreeningResult";
import KYCList from "./MyKYC/KYCList";
import ScreenKYCForm from "./ScreenKYCForm";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@protego/sdk/RegtankUI/v1/MuiTheme/theme";
import { StylesProvider, createGenerateClassName } from "@mui/styles";
const mapStateToProps = (state) => ({
  loading: state.kyc.loading,
});
const generateClassName = createGenerateClassName({
  productionPrefix: "reg",
  seed: "reg",
});
const KYCPage = ({ loading }) => {
  const _handleCustomUrl = (index, subPath) => {
    if (subPath === "kyc") {
      return [<IntlMessages id="url.acurisKyc" />, KYC_ROUTE_MY_KYC];
    }
    if (subPath === "screen-kyc") {
      return [<IntlMessages id="screen-kyc" />, KYC_ROUTE_KYC_SCREEN];
    }
    return null;
  };

  return (
    <StylesProvider generateClassName={generateClassName}>
      <ThemeProvider theme={theme}>
        <PageHeadingProvider customUrlResolver={_handleCustomUrl}>
          <LoadingWrapper loading={loading} size={"3rem"}>
            <Switch>
              <Route
                path={KYC_ROUTE_KYC_SCREEN_SCORING}
                component={KYCRiskScoringPage}
              />
              <Route
                path={KYC_ROUTE_KYC_SCREEN_DETAIL}
                component={ScreeningResultDetail}
                exact
              />

              <Route
                path={KYC_ROUTE_KYC_SCREEN_RESULT}
                component={KYCScreeningResult}
                exact
              />
              <Route path={KYC_ROUTE_KYC_SCREEN} component={ScreenKYCForm} />
              <Route
                path={[
                  KYC_ROUTE_KYC_GROUP_LIST,
                  KYC_ROUTE_KYC_ARCHIVE_LIST,
                  KYC_ROUTE_MY_KYC,
                ]}
                exact
                component={KYCList}
              />
            </Switch>
          </LoadingWrapper>
        </PageHeadingProvider>
      </ThemeProvider>
    </StylesProvider>
  );
};
export default compose(connect(mapStateToProps, null))(memo(KYCPage));
