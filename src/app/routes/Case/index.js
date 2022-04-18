import React, { memo } from "react";
import { Route, Switch } from "react-router-dom";
import CaseList from "./router/CaseList";
import CaseDetail from "./router/CaseDetail";
import {
  CASE_ROUTE__INDEX,
  CASE_ROUTE_ARCHIVE_LIST,
  CASE_ROUTE_DETAIL,
  CASE_ROUTE_GROUP_LIST,
} from "./routes";
import { connect } from "react-redux";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper/LoadingWrapper";

const mapStateToProps = (state) => ({
  loading: state.case.loading,
});

const CasePage = ({ loading }) => {
  return (
    <LoadingWrapper loading={loading} size={"3rem"}>
      <Switch>
        <Route
          path={[
            CASE_ROUTE_GROUP_LIST,
            CASE_ROUTE_ARCHIVE_LIST,
            CASE_ROUTE__INDEX,
          ]}
          exact
          component={CaseList}
        />
        <Route path={CASE_ROUTE_DETAIL} component={CaseDetail} />
      </Switch>
    </LoadingWrapper>
  );
};

export default connect(mapStateToProps, null)(memo(CasePage));
