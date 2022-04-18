import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@material-ui/core";
import IntlMessages from "@protego/sdk/UI/IntlMessages";

import { PageHeadingProvider } from "@protego/sdk/RegtankUI/v1/PageHeading";
import { ReactComponent as IcSettingKYC } from "assets/icons/IcSettingKyc.svg";
import { ReactComponent as IcSettingKYT } from "assets/icons/IcSettingKyt.svg";
import { ReactComponent as IcSettingKYB } from "assets/icons/IcSettingKyb.svg";
import { ReactComponent as ReleaseNotes } from "assets/icons/ReleaseNotes.svg";
import { ReactComponent as SettingsIcon } from "assets/icons/SettingsIcon.svg";
import { ReactComponent as BlackListIcon } from "assets/icons/IcBlackList.svg";
import { ReactComponent as IcSecurity } from "assets/icons/IcSecurity.svg";
import { ReactComponent as IcACL } from "assets/icons/IcSettingACL.svg";
import { ReactComponent as IcDepartment } from "assets/icons/IcDepartment.svg";
import React, { Fragment } from "react";
import { Redirect, Route, Switch } from "react-router";
import SettingKYB from "./KYB";
import SettingKYC from "./KYC";
import SettingKYT from "./KYT";
import ReleaseNotesPage from "./ReleaseNotes";
import GeneralSettingsPage from "./GeneralSettings";
import ACLSettingsPage from "./ACL";
import styles from "./SettingsPage.module.scss";
import Sidebar from "./Sidebar/Sidebar";
import SettingBlackList from "./BlackList";
import DepartmentPage from "./Department";
import Security from "./Security";
import { useSelector, shallowEqual } from "react-redux";
import { canAccessKYT, canAccessLiveness } from "../../../util/permision";
import { withACL } from "../../../acl";
import { ROLE_TYPE_ADMIN } from "constants/Role";
import LivenessSetting from "./Liveness/index";
import { ReactComponent as LivenessSettingIcon } from "assets/icons/LVSidebar.svg";
import Navigation from "components/Navigation";
import { makeStyles } from "@material-ui/styles";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import PageNotFound from "app/routes/ErrorPages/routes/404";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";
const makeSettingNavs = (title, Icon, to, component = null, children) => ({
  title,
  Icon,
  to,
  component,
  children,
});

const useStyles = makeStyles({
  navBar: {
    marginBottom: "4px",
    cursor: "pointer",
    "& .side-nav-menu": {
      fontFamily: "Montserrat",
      fontWeight: 600,
      "& .nav-menu-item": {
        marginBottom: "4px",
        "& svg": {
          width: "24px",
          height: "24px",
        },
        "& .nav-arrow": {
          right: 5,
          position: "absolute !important",
          fontSize: 20,
        },
      },
      "& .nav-collapse-btn": {
        marginTop: 0,
        "& svg": {
          width: "20px",
          height: "20px",
          position: "relative",
        },
      },
      "& .nav-collapse.open .nav-collapse-btn": {
        backgroundColor: ThemeColors.bgSidebar,
        marginBottom: "4px",
      },
      "& .nav-collapse.open": {
        backgroundColor: ThemeColors.bgSidebar,
        "& div:nth-child(2)": {
          padding: "unset",
          display: "block",
          "& .MuiList-root": {
            "& > .nav-menu-item": {
              "& > a": {
                paddingLeft: "64px",
                borderRadius: "8px",
                paddingRight: "8px",
                paddingTop: "15px",
                paddingBottom: "15px",
                "&.active, &:hover, &:focus": {
                  backgroundColor: ThemeColors.bgActiveSidebar,
                  "& > .nav-text": {
                    color: ThemeColors.textItemActiveSidebar,
                  },
                  "&:before": {
                    width: "100%",
                    borderRadius: "8px",
                    backgroundColor: ThemeColors.bgActiveSidebar,
                  },
                  "&:after": {
                    borderRadius: "50%",
                    left: "52px",
                    transform: "translate(-50%, -50%)",
                    top: "50%",
                    backgroundColor: ThemeColors.dotsActiveColorSidebar,
                  },
                },
                "& > .nav-text": {
                  fontWeight: 600,
                  fontSize: toRem(14),
                  lineHeight: toRem(18),
                  letterSpacing: "0.2px",
                  color: ThemeColors.textItemSidebar,
                },
              },
            },
          },
        },
        "& svg path": {
          fill: ThemeColors.textItemActiveSidebar,
        },
      },
      "& .nav-collapse": {
        "& div:nth-child(2)": {
          display: "none",
        },
      },
      "& .nav-collapse-btn:hover": {
        borderRadius: 8,
        backgroundColor: ThemeColors.bgSidebar,
        marginTop: 0,
        marginBottom: "4px",
        "& svg path": {
          fill: ThemeColors.textItemActiveSidebar,
        },
      },
      "& .nav-collapse-item .MuiList-root:": {},
    },
  },
});

const getSettingNavs = (routeUrl) => {
  return [
    makeSettingNavs(
      "setting.menu.generalSettings",
      SettingsIcon,
      "/general-settings",
      GeneralSettingsPage
    ),
    makeSettingNavs(
      "setting.menu.onboarding",
      LivenessSettingIcon,
      "/liveness",
      LivenessSetting
    ),
    makeSettingNavs("setting.menu.kyc", IcSettingKYC, "/kyc", SettingKYC, [
      {
        name: "setting.menu.kyc",
        type: "collapse",
        icon: <IcSettingKYC />,
        order: 2,
        children: [
          {
            name: "Acuris",
            type: "item",
            link: routeUrl + "/kyc/acuris",
            order: 2.1,
          },
          {
            name: "DowJones",
            type: "item",
            link: routeUrl + "/kyc/dow-jones",
            order: 2.2,
          },
        ],
      },
    ]),
    makeSettingNavs("setting.menu.kyb", IcSettingKYB, "/kyb", SettingKYB),
    makeSettingNavs("setting.menu.kyt", IcSettingKYT, "/kyt", SettingKYT),
    makeSettingNavs(
      "setting.menu.blacklist",
      BlackListIcon,
      "/blacklist",
      SettingBlackList
    ),
    makeSettingNavs("setting.menu.acl", IcACL, "/acl", ACLSettingsPage),
    makeSettingNavs(
      "setting.menu.department",
      IcDepartment,
      "/department",
      DepartmentPage
    ),
    makeSettingNavs("setting.menu.security", IcSecurity, "/security", Security),
  ];
};

const otherSettingNavs = [
  makeSettingNavs(
    "setting.menu.releaseNotes",
    ReleaseNotes,
    "/others/release-notes",
    ReleaseNotesPage
  ),
];

const SettingsPage = (props) => {
  const { match, ACL } = props;
  const { customerMe } = useSelector((state) => state.settings, shallowEqual);
  const isDisabledModule = (title) => {
    switch (title) {
      case "setting.menu.liveness":
        return !canAccessLiveness(customerMe);
      case "setting.menu.kyc":
        return !ACL.isAllowedPermissions([
          "SETTING_KYC_VIEW",
          "SETTING_MODULE_VIEW",
        ]);
      case "setting.menu.kyb":
        return !ACL.isAllowedPermissions([
          "SETTING_KYB_VIEW",
          "SETTING_MODULE_VIEW",
        ]);
      case "setting.menu.kyt":
        return (
          canAccessKYT(customerMe) &&
          !ACL.isAllowedPermissions(["SETTING_KYT_VIEW", "SETTING_MODULE_VIEW"])
        );
      case "setting.menu.blacklist":
        return !ACL.isAllowedPermissions([
          "SETTING_BLACKLIST_VIEW",
          "SETTING_MODULE_VIEW",
        ]);
      case "setting.menu.acl":
        return !ACL.isAllowedPermissions(ROLE_TYPE_ADMIN);
      case "setting.menu.department":
        return !ACL.isAllowedPermissions([
          "DEPARTMENT_MODULE_VIEW",
          "SETTING_MODULE_VIEW",
        ]);
      case "setting.menu.security":
        return !ACL.isAllowedPermissions([
          "SETTING_SECURITY_VIEW",
          "SETTING_MODULE_VIEW",
        ]);
      default:
        return false;
    }
  };

  const settingNavs = getSettingNavs(match.url);
  const classes = useStyles();

  return (
    <PageHeadingProvider
      customUrlResolver={(index, sub) => {
        if (sub === "setting" || sub === "others") return [null, null, false];
      }}
    >
      <Fragment>
        <Sidebar.Container>
          <Sidebar.Menu>
            <List
              subheader={
                <ListSubheader component={"div"}>
                  <IntlMessages id={"setting.menu.title"} />
                </ListSubheader>
              }
            >
              {settingNavs
                .filter(({ title }) => !isDisabledModule(title))
                .map(({ title, Icon, to, component, children }, index) => {
                  if (children) {
                    return (
                      <div className={classes.navBar}>
                        <Navigation menuItems={children} />
                      </div>
                    );
                  }
                  return (
                    <ListItem
                      button={true}
                      component={Sidebar.NavLink}
                      to={match.url + to}
                      key={index}
                    >
                      <ListItemIcon>
                        <Icon />
                      </ListItemIcon>
                      <ListItemText primary={<IntlMessages id={title} />} />
                    </ListItem>
                  );
                })}
            </List>

            <List
              subheader={
                <ListSubheader component={"div"}>
                  <IntlMessages id={"setting.menu.other.title"} />
                </ListSubheader>
              }
            >
              {otherSettingNavs.map(({ title, Icon, to }, index) => {
                return (
                  <ListItem
                    button={true}
                    component={Sidebar.NavLink}
                    to={match.url + to}
                    key={index}
                  >
                    <ListItemIcon>
                      <Icon />
                    </ListItemIcon>
                    <ListItemText primary={<IntlMessages id={title} />} />
                  </ListItem>
                );
              })}
            </List>
          </Sidebar.Menu>
          <Sidebar.Content>
            <div className={styles.JRCardContainer}>
              <Switch>
                {settingNavs
                  .concat(otherSettingNavs)
                  .filter(({ title }) => !isDisabledModule(title))
                  .map(({ to, component }, index) => {
                    return (
                      <Route
                        path={match.url + to}
                        component={component}
                        key={to + index}
                      />
                    );
                  })}
                <Route
                  exact
                  path={["/app/setting", "/app/setting/general-settings"]}
                >
                  <Redirect to={match.url + "/general-settings"} />
                </Route>
                <Route path="" component={PageNotFound} />
              </Switch>
            </div>
          </Sidebar.Content>
        </Sidebar.Container>
      </Fragment>
    </PageHeadingProvider>
  );
};

export default withACL(SettingsPage);
