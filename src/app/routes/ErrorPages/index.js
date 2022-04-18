import React, { Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import asyncComponent from "util/hocs/asyncComponent";

const Pages = ({ match }) => (
  <Fragment>
    <Switch>
      <Route
        path={`${match.url}/page-not-found`}
        component={asyncComponent(() => import("./routes/404"))}
      />
    </Switch>
  </Fragment>
);

export default Pages;
