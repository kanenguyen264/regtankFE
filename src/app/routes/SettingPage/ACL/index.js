import { PageHeadingProvider } from "@protego/sdk/RegtankUI/v1/PageHeading";
import { SETTING_ACL_LIST, SETTING_ACL_TABLE_ACCESS } from "constants/routes";
import React, { memo } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { compose } from "recompose";
import ACLDetail from "./ACLDetail";
import ACLList from "./ACLList";

const mapStateToProps = (state) => ({
  loading: state.kyc.loading,
});

const ACLSettings = ({ loading }) => {
  return (
    <PageHeadingProvider>
      <Switch>
        <Route path={SETTING_ACL_LIST} component={ACLList} exact />
        <Route path={SETTING_ACL_TABLE_ACCESS} component={ACLDetail} exact />
      </Switch>
    </PageHeadingProvider>
  );
};
export default compose(connect(mapStateToProps, null))(memo(ACLSettings));
