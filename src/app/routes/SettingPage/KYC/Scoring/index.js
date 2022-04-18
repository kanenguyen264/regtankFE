import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import List from "./list";
import ScoringDetail from "./scoring";
import {
  SETTING_SCORING_ROUTE_ARCHIVE,
  SETTING_SCORING_ROUTE_INDEX,
  SETTING_SCORING_ROUTE_DETAIL,
  SETTING_DJ_SCORING_ROUTE_INDEX,
} from "constants/routes";
import { withACL } from "../../../../../acl";

const ScoringPage = ({ ACL }) => {
  return (
    <Switch>
      <Route path={SETTING_DJ_SCORING_ROUTE_INDEX} component={List} exact />
      <Route path={SETTING_SCORING_ROUTE_INDEX} component={List} exact />
      <Route path={SETTING_SCORING_ROUTE_ARCHIVE} component={List} exact />
      <Route
        path={SETTING_SCORING_ROUTE_DETAIL}
        render={(props) => (
          <ScoringDetail
            {...props}
            disabled={!ACL.isAllowedPermissions("SETTING_KYC_EDIT")}
          />
        )}
        exact
      ></Route>
      <Redirect exact to={`/app/page-not-found`} />
    </Switch>
  );
};

export default withACL(ScoringPage);
