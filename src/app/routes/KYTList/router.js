import { PageHeadingProvider } from "@protego/sdk/RegtankUI/v1/PageHeading";
import {
  KYT_ROUTE_ARCHIVE_LIST,
  KYT_ROUTE_MY_KYT,
  KYT_ROUTE_GROUP_LIST,
} from "constants/routes";
import React from "react";
import { Route, Switch } from "react-router-dom";
import KYTList from "./KYTList";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper/LoadingWrapper";
import { useSelector } from "react-redux";

/**
 * @deprecated
 */
const KYTPage = () => {
  const loading = useSelector((state) => state.kyt.loading);
  return (
    <PageHeadingProvider>
      <LoadingWrapper loading={loading} size={"3rem"}>
        <Switch>
          {/* <Route path={KYT_ROUTE_WATCH_LIST} component={KYTWatchList} /> */}
          <Route
            exact
            path={[
              KYT_ROUTE_MY_KYT,
              KYT_ROUTE_GROUP_LIST,
              KYT_ROUTE_ARCHIVE_LIST,
            ]}
            component={KYTList}
          />
        </Switch>
      </LoadingWrapper>
    </PageHeadingProvider>
  );
};
export default KYTPage;
