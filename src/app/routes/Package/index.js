import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Package from "./routers/Package";

const PackageRoute = function PackagePage({ match }) {
  return (
    <Switch>
      <Route
        key={"package-route"}
        exact
        path={`${match.url}`}
        component={Package}
      />
      <Redirect to={`/app/page-not-found`} />
    </Switch>
  );
};

export default PackageRoute;
