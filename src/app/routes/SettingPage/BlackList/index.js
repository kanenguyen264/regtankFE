import { PageHeadingProvider } from "@protego/sdk/RegtankUI/v1/PageHeading";
import {
  SETTING_BLACK_LIST_KYB,
  SETTING_BLACK_LIST_KYC,
  SETTING_BLACK_LIST_KYT,
} from "constants/routes";
import React from "react";
import { Route, Switch } from "react-router-dom";
import BlackListList from "./list";

const BlackListRouter = () => {
  return (
    <PageHeadingProvider>
      <Switch>
        <Route
          exact
          path={[
            SETTING_BLACK_LIST_KYC,
            SETTING_BLACK_LIST_KYB,
            SETTING_BLACK_LIST_KYT,
          ]}
          component={BlackListList}
        />
      </Switch>
    </PageHeadingProvider>
  );
};
export default BlackListRouter;
