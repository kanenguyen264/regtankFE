import makeStyles from "@material-ui/core/styles/makeStyles";
import { ProtegoContext } from "@protego/sdk/core/ProtegoProvider/ProtegoProvider";
import ModalCountDown from "components/ModalCountDown";
import React from "react";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import asyncComponent from "util/hocs/asyncComponent";
import { ProtectedRoute } from "./protectedRoute";
import { compose } from "recompose";
import ModalAccessDenied from "components/ModalAccessDenied";
import PageNotFound from "app/routes/ErrorPages/routes/404";

const useStyles = makeStyles((theme) => ({
  appWrapper: {
    padding: `${theme.typography.pxToRem(24)} ${theme.typography.pxToRem(24)}`,
    height: "100%",
  },
}));

const routes = [
  ["/dashboard", () => import("./Dashboard")],
  ["/user/profile", () => import("./ProfilePage/ProfilePage")],
  ["/staff", () => import("./StaffPage")],
  ["/kyt/kyt-screen/:id?", () => import("./KYTScreenPage/KYTScreenPage")],
  ["/kyt/my-kyt", () => import("./KYTList/router")],
  ["/(kyc|screen-kyc)", () => import("./KYCScreenPage")],
  ["/(dj-kyc|screen-kyc)", () => import("./DJKYCScreenPage")],
  ["/case", () => import("./Case")],
  ["/case-management", () => import("./CaseManagement")],
  ["/package", () => import("./Package")],
  ["/support", () => import("./SupportPage")],
  ["/setting", () => import("./SettingPage")],
  ["/report", () => import("./Report")],
  ["/audit", () => import("./Audit")],
  ["/credit", () => import("./Credit")],
  ["/liveness", () => import("./Liveness")],
  ["/(kyb|screen-kyb)", () => import("./KYBScreenPage")],
  ["/elements", () => import("./elements")],
  ["/page-not-found", () => import("./ErrorPages/routes/404")],
  ["/page-error", () => import("./ErrorPages/routes/500")],
].map(([r, c]) => [r, asyncComponent(c)]);

const Routes = ({ match, location }) => {
  const classes = useStyles();
  const { sessionTimeOut, services } = React.useContext(ProtegoContext);
  const { APIService } = services;
  return (
    <div className={classes.appWrapper}>
      <Switch>
        <Route exact path="/">
          <Redirect to="/app/dashboard" />
        </Route>
        {routes.map(([path, asyncFn], index) => (
          <ProtectedRoute
            key={path + index}
            path={match.url + path}
            component={asyncFn}
          />
        ))}
        <Route exact path="/app">
          <Redirect to="/app/dashboard" />
        </Route>
        <Route path="" component={PageNotFound} />
      </Switch>
      <ModalCountDown open={sessionTimeOut} />
      <ModalAccessDenied open={APIService?.accessDenied} />
    </div>
  );
};

export default compose(withRouter)(Routes);
