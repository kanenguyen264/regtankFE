import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";
import React, { Fragment } from "react";
import { Route } from "react-router";
import FilterLevel from "./FilterLevel";
import FilterLevelDJ from "./FilterLevelDJ";
import ScoringList from "./Scoring";
import ScoringListDJ from "./ScoringDJ";
import { withACL } from "../../../../acl";
import {
  SETTING_SCORING_ROUTE_ARCHIVE,
  SETTING_SCORING_ROUTE_INDEX,
  SETTING_SCORING_ROUTE_DETAIL,
  SETTING_DJ_SCORING_ROUTE_INDEX,
  SETTING_DJ_SCORING_ROUTE_ARCHIVE,
  SETTING_DJ_SCORING_ROUTE_DETAIL,
} from "constants/routes";
import clsx from "clsx";
import styles from "../SettingsPage.module.scss";

const Header = () => {
  return (
    <Fragment>
      <PageHeading
        title={<IntlMessages id={"setting.kyc.header"} />}
        customUrlResolver={(index, sub) => {
          switch (sub) {
            case "kyc":
              return [null, null, null, true];
            case "scoring":
              return [null, null, null, true];
            case "setting":
              return [
                <IntlMessages id={"setting.kyc.breadcrumb.settings"} />,
                null,
                false,
              ];
            case "acuris":
              return [<IntlMessages id={"url.acurisKyc"} />, null, false];
            case "dow-jones":
              return [
                <IntlMessages id={"setting.menu.down.jones"} />,
                null,
                false,
              ];
            case "archive":
              return [
                <IntlMessages id={"setting.kyc.breadcrumb.archive.list"} />,
                null,
                false,
              ];

            default:
              break;
          }
        }}
      />
    </Fragment>
  );
};

const SettingKYC = ({ ACL }) => {
  const isEditable = ACL.isAllowedPermissions("SETTING_KYC_EDIT");
  return (
    <Fragment>
      <Route path={["/app/setting/kyc/acuris(/archive)?"]} exact>
        <Header />
        <FilterLevel disabled={!isEditable} />
      </Route>
      <Route path={["/app/setting/kyc/dow-jones(/archive)?"]} exact>
        <Header />
        <FilterLevelDJ />
      </Route>
      <Route
        path={[
          SETTING_SCORING_ROUTE_INDEX,
          SETTING_SCORING_ROUTE_ARCHIVE,
          SETTING_SCORING_ROUTE_DETAIL,
        ]}
        exact
      >
        <ScoringList disabled={!isEditable} />
      </Route>
      <Route
        path={[
          SETTING_DJ_SCORING_ROUTE_INDEX,
          SETTING_DJ_SCORING_ROUTE_ARCHIVE,
          SETTING_DJ_SCORING_ROUTE_DETAIL,
        ]}
        exact
      >
        <ScoringListDJ />
      </Route>
    </Fragment>
  );
};

export default withACL(SettingKYC);
