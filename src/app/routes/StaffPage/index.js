import React from "react";
import { Route, Switch } from "react-router-dom";
import StaffList from "./StaffList";
import StaffDetail from "./StaffDetail";

const StaffPage = ({ match }) => (
  <div>
    <Switch>
      <Route path={`${match.url}/`} component={StaffList} exact />
      <Route path={`${match.url}/:id`} component={StaffDetail} exact />
    </Switch>
  </div>
);

export default StaffPage;
