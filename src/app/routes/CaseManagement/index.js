import React, { memo } from "react";
import { Route, Switch } from "react-router-dom";
import CaseList from "./CaseList";
import CaseDetail from "./CaseDetail";
import NewCase from "./NewCase";
import {
  CASE_MANAGEMENT_CREATE_ROUTE,
  CASE_MANAGEMENT_INDEX_ROUTE,
  CASE_MANAGEMENT_DETAIL_ROUTE,
} from "./routes";
import { connect } from "react-redux";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper";
import { ThemeProvider } from "@mui/material/styles";
import { StylesProvider, createGenerateClassName } from "@mui/styles";
import MuiTheme from "@protego/sdk/RegtankUI/v1/MuiTheme/theme";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

const mapStateToProps = (state) => ({
  loading: state.caseManagement.loading,
});

const generateClassName = createGenerateClassName({
  productionPrefix: "reg",
  seed: "reg",
});

const CasePage = ({ loading }) => {
  return (
    <StylesProvider generateClassName={generateClassName}>
      <ThemeProvider theme={MuiTheme}>
        <LoadingWrapper loading={loading} size={"3rem"}>
          <Switch>
            <Route
              path={CASE_MANAGEMENT_INDEX_ROUTE}
              component={CaseList}
              exact
            />
            <Route path={CASE_MANAGEMENT_CREATE_ROUTE} component={NewCase} />
            <Route path={CASE_MANAGEMENT_DETAIL_ROUTE} component={CaseDetail} />
          </Switch>
        </LoadingWrapper>
      </ThemeProvider>
    </StylesProvider>
  );
};

export default connect(mapStateToProps, null)(memo(CasePage));
