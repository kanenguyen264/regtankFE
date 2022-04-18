import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import List from "./list";
import ScoringDetail from "./scoring";
import {
  SETTING_DJ_SCORING_ROUTE_ARCHIVE,
  SETTING_DJ_SCORING_ROUTE_DETAIL,
  SETTING_DJ_SCORING_ROUTE_INDEX,
  PAGE_NOT_FOUND
} from "constants/routes";

const ScoringPage = () => {
  return (
    <Switch>
      <Route path={SETTING_DJ_SCORING_ROUTE_INDEX} component={List} exact />
      <Route path={SETTING_DJ_SCORING_ROUTE_INDEX} component={List} exact />
      <Route path={SETTING_DJ_SCORING_ROUTE_ARCHIVE} component={List} exact />
      <Route
        path={SETTING_DJ_SCORING_ROUTE_DETAIL}
        render={(props) => (
          <ScoringDetail
            {...props}
          />
        )}
        exact
      ></Route>
      <Redirect exact to={PAGE_NOT_FOUND} />
    </Switch>
  );
};

export default ScoringPage;
