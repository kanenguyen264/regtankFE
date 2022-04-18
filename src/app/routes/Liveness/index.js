import React, { Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import asyncComponent from "util/hocs/asyncComponent";
import styles from "./Liveness.module.scss";

const Liveness = ({ match }) => (
  <div className={styles.LivenessWrapper}>
    <Switch>
      <Route
        path={`${match.url}/`}
        exact
        component={asyncComponent(() => import("./Listing"))}
      />
      <Route
        path={`${match.url}/:requestId`}
        exact
        component={asyncComponent(() => import("./Detailv1"))}
      />
    </Switch>
  </div>
);

export default Liveness;
