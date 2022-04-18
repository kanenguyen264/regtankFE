import { PageHeadingProvider } from "@protego/sdk/RegtankUI/v1/PageHeading";
import { SETTING_DEPARTMENT } from "constants/routes";
import React from "react";
import { Route, Switch } from "react-router-dom";
import DepartmentList from "./list";
const DepartmentListRouter = () => {
  return (
    <PageHeadingProvider>
      <Switch>
        <Route exact path={SETTING_DEPARTMENT} component={DepartmentList} />
      </Switch>
    </PageHeadingProvider>
  );
};
export default DepartmentListRouter;
