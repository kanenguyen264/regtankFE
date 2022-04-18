import React from "react";
import CustomScrollbars from "util/hocs/CustomScrollbars";
import Navigation from "components/Navigation";
import { makeStyles } from "@material-ui/core/styles";
import { ReactComponent as DashboardIcon } from "assets/images/icons/DashboardIcon.svg";
import { ReactComponent as CaseIcon } from "assets/images/icons/CaseIcon.svg";
import { ReactComponent as KytIcon } from "assets/images/icons/KytIcon.svg";
import { ReactComponent as KycIcon } from "assets/images/icons/KycIcon.svg";
import { ReactComponent as KybIcon } from "assets/images/icons/KybIcon.svg";
import { ReactComponent as AuditIcon } from "assets/images/icons/AuditIcon.svg";
import { ReactComponent as StaffIcon } from "assets/images/icons/StaffIcon.svg";
import { ReactComponent as SettingsIcon } from "assets/images/icons/SettingsIcon.svg";
import { ReactComponent as SupportTicketIcon } from "assets/images/icons/SupportTicketIcon.svg";
import { ReactComponent as ReportIcon } from "assets/images/icons/ReportIcon.svg";
import {
  KYC_ROUTE_KYC_SCREEN,
  KYC_ROUTE_MY_KYC,
  KYB_ROUTE_KYB_SCREEN,
  KYB_ROUTE_MY_KYB,
  DJ_KYC_ROUTE_MY_KYC,
  DJ_KYC_ROUTE_KYC_SCREEN,
  REPORT_KYC_ACURIS,
  REPORT_KYC_DJ,
  CASE_MANAGEMENT_INDEX_ROUTE,
} from "constants/routes";
import { useSelector, shallowEqual } from "react-redux";
import { VERSION_BUILD, VERSION_WEB } from "constants/Version";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { canAccessKYT, canAccessLiveness } from "../../util/permision";
import { withACL } from "../../acl";
import { ReactComponent as LivenessSettingIcon } from "assets/icons/LVSidebar.svg";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  navigation: {
    "& .side-nav-menu": {
      fontFamily: "Montserrat",
      fontSize: "14px",
      [theme.breakpoints.up(1900)]: {
        fontSize: "16px",
      },
      "& .nav-section": {
        "& svg": {
          width: "24px",
          height: "24px",
          zIndex: 0,
          "& path": {
            fill: ThemeColors.default,
          },
        },
        "& .nav-text": {
          color: ThemeColors.default,
        },
      },
      "& .nav-menu-item": {
        "&.secondaryParent": {
          "& .nav-text": {
            lineHeight: "20px",
            fontWeight: 600,
          },
        },
        "&:not(.secondaryParent):hover": {
          "& a": {
            fontWeight: 600,
            "& .nav-text": {
              color: ThemeColors.textItemActiveSidebar,
              fontWeight: 600,
            },
          },
        },
        "& a": {
          "&.active": {
            color: ThemeColors.textItemActiveSidebar,
            fontWeight: 600,
            "& > .nav-text": {
              color: ThemeColors.textItemActiveSidebar,
              fontWeight: 600,
            },
          },
          fontWeight: 500,
          lineHeight: "20px",
          "& .nav-text": {
            lineHeight: "20px",
          },
        },
      },
      "& .nav-collapse-btn": {
        fontWeight: 500,
      },
      "& .active:before": {
        borderRadius: toRem(8),
        width: "100%",
        backgroundColor: ThemeColors.bgActiveSidebar,
      },
      "& .active:after": {
        width: 0,
        height: 0,
        left: 10,
      },
      "& a:hover:before, & a:focus:before": {
        borderRadius: toRem(8),
        width: "100%",
        backgroundColor: ThemeColors.bgActiveSidebar,
      },
      "& a:hover": {
        "& svg:nth-child(1) path": {
          fill: ThemeColors.textItemActiveSidebar,
        },
      },
      "& .nav-collapse-btn:hover": {
        "& svg:nth-child(1) path": {
          fill: ThemeColors.textItemActiveSidebar,
        },
      },
      "& .active": {
        "& svg:nth-child(1) path": {
          fill: ThemeColors.textItemActiveSidebar,
        },
      },
      "& .open .active:after": {
        backgroundColor: ThemeColors.dotsActiveColorSidebar,
        left: 10,
        width: 8,
        height: 8,
      },
      "& .nav-collapse.open": {
        backgroundColor: ThemeColors.bgSidebar,
        "& .nav-collapse-btn": {
          backgroundColor: ThemeColors.bgSidebar,
        },
        "& div:nth-child(2)": {
          padding: "unset !important",
          "& .nav-collapse.open": {
            "& a": {
              marginLeft: "32px",
              fontWeight: 500,
              paddingTop: "15px",
              paddingBottom: "15px",
              "&> span.nav-text": {
                top: 0,
                fontWeight: 600,
              },
            },
            "& a:after": {
              left: "53px",
            },
          },
        },
        "& .hasOneChildren:nth-child(2)": {
          "& a:after": {
            left: 25,
          },
          "& .nav-text": {
            marginLeft: 34,
          },
        },
        "& .firstParent:nth-child(2)": {
          display: "block",
        },
        "& a.item-header .nav-text": {
          left: 35,
          position: "relative",
        },
        "& a.item-header:after": {
          left: 30,
        },
        "& .firstParent:nth-child(1)": {
          "svg path": {
            fill: ThemeColors.textItemActiveSidebar,
          },
        },
        "& > .firstParent": {
          "&.hasOneChildren": {
            "& + .nav-collapse-item": {
              "& .nav-menu-item > a": {
                paddingLeft: "64px",
                fontWeight: 600,
                "&.active": {
                  "&:after": {
                    left: "52px",
                  },
                },
                "& > span.nav-text": {
                  top: "0px",
                  fontWeight: 600,
                },
              },
            },
          },
          "& + .nav-collapse-item": {
            "& > * > * > .MuiList-root > .nav-menu-item > a": {
              paddingLeft: "48px",
              "&.active": {
                "&:after": {
                  left: "36px",
                },
              },
              "& > span.nav-text": {
                top: "0px",
                left: "0",
              },
            },
          },
        },
      },
      "& .firstParent:nth-child(2)": {
        display: "none",
      },
      "& .nav-collapse": {
        "& .nav-arrow": {
          right: "20px",
          fontSize: 24,
        },
      },
    },
  },
  menuFooter: {
    fontSize: toRem(12),
    color: ThemeColors.default,
    padding: "27px 16px 24px 24px",
    lineHeight: "16px",
    letterSpacing: "0.1px",
    position: "fixed",
    zIndex: 1,
    width: "264px",
    backgroundColor: ThemeColors.bgSidebar,
    bottom: 0,
    left: 0,
  },
}));

const navigationMenus = [
  {
    name: "sidebar.main",
    type: "section",
    children: [
      {
        name: "sidebar.dashboard",
        type: "item",
        icon: <DashboardIcon />,
        link: "/app/dashboard",
        order: 1,
      },
      {
        name: "sidebar.onboarding",
        type: "item",
        order: 6,
        "data-cy": "route-liveness",
        icon: <LivenessSettingIcon />,
        link: "/app/liveness",
      },
      {
        name: "sidebar.kyc",
        active: "sidebar.kyc",
        type: "collapse",
        icon: <KycIcon />,
        order: 3,
        classes: { text: "firstParent" },
        children: [
          {
            name: "sidebar.kyc.acuris",
            type: "collapse",
            isAlwaysOpen: true,
            classes: { text: "secondaryParent" },
            children: [
              {
                name: "sidebar.kyc.acuris.kyc-screen",
                type: "item",
                link: KYC_ROUTE_KYC_SCREEN,
              },
              {
                name: "sidebar.kyc.acuris.my-kyc",
                type: "item",
                link: KYC_ROUTE_MY_KYC,
              },
            ],
          },
          {
            name: "sidebar.kyc.dow-jones",
            type: "collapse",
            isAlwaysOpen: true,
            classes: { text: "secondaryParent" },
            children: [
              {
                name: "sidebar.kyc.dow-jones.kyc-screen",
                type: "item",
                link: DJ_KYC_ROUTE_KYC_SCREEN,
              },
              {
                name: "sidebar.kyc.dow-jones.my-kyc",
                type: "item",
                link: DJ_KYC_ROUTE_MY_KYC,
              },
            ],
          },
        ],
      },
      {
        name: "sidebar.kyb",
        type: "collapse",
        icon: <KybIcon />,
        classes: { text: "firstParent hasOneChildren" },
        order: 4,
        active: "sidebar.kyb",
        children: [
          {
            name: "sidebar.kyb.kyb-screen",
            type: "item",
            link: KYB_ROUTE_KYB_SCREEN,
          },
          {
            name: "sidebar.kyb.my-kyb",
            type: "item",
            link: KYB_ROUTE_MY_KYB,
          },
        ],
      },
      {
        name: "sidebar.kyt",
        type: "collapse",
        order: 5,
        active: "sidebar.kyt",
        icon: <KytIcon />,
        classes: { text: "firstParent hasOneChildren" },
        "data-cy": "route-kyt",
        children: [
          {
            name: "sidebar.kyt.kyt-screen",
            type: "item",
            link: "/app/kyt/kyt-screen",
          },
          {
            name: "sidebar.kyt.my-kyt",
            type: "item",
            link: "/app/kyt/my-kyt",
            "data-cy": "route-my-kyt",
          },
        ],
      },
      // {
      //   name: "sidebar.caseManagement",
      //   type: "item",
      //   icon: <CaseIcon />,
      //   link: CASE_MANAGEMENT_INDEX_ROUTE,
      //   order: 2,
      // },
      {
        name: "sidebar.case",
        type: "item",
        icon: <CaseIcon />,
        link: "/app/case",
        order: 2,
      },
      {
        name: "sidebar.report",
        type: "collapse",
        icon: <ReportIcon />,
        classes: { text: "firstParent" },
        order: 11,
        children: [
          {
            name: "sidebar.kyc",
            type: "collapse",
            isAlwaysOpen: true,
            classes: { text: "secondaryParent" },
            children: [
              {
                name: "sidebar.kyc.acuris",
                type: "item",
                link: REPORT_KYC_ACURIS,
              },
              {
                name: "sidebar.kyc.dow-jones",
                type: "item",
                link: REPORT_KYC_DJ,
              },
            ],
          },
          {
            name: "sidebar.kyb",
            type: "item",
            isAlwaysOpen: true,
            link: "/app/report/kyb",
            classes: { text: "item-header" },
          },
          {
            name: "sidebar.kyt",
            type: "item",
            isAlwaysOpen: true,
            link: "/app/report/kyt",
            classes: { text: "item-header" },
          },
        ],
      },
      {
        name: "sidebar.audit",
        type: "item",
        icon: <AuditIcon />,
        link: "/app/audit",
        order: 7,
      },
      {
        name: "sidebar.staff",
        type: "item",
        icon: <StaffIcon />,
        link: "/app/staff",
        order: 8,
      },
      {
        name: "sidebar.support",
        type: "item",
        icon: <SupportTicketIcon />,
        link: "/app/support",
        order: 9,
      },
      {
        name: "sidebar.setting",
        type: "item",
        icon: <SettingsIcon />,
        link: "/app/setting",
        order: 10,
      },
    ],
  },
];

const protectedItems = [
  { id: "sidebar.case", role: "CASE_MODULE_VIEW" },
  { id: "sidebar.kyc", role: "KYC_MODULE_VIEW" },
  { id: "sidebar.kyc.kyc-screen", role: "KYC_MODULE_CREATE" },
  { id: "sidebar.kyc.my-kyc", role: "KYC_MODULE_VIEW" },
  { id: "sidebar.kyb", role: "KYB_MODULE_VIEW" },
  { id: "sidebar.kyb.kyb-screen", role: "KYB_MODULE_CREATE" },
  { id: "sidebar.kyb.my-kyb", role: "KYB_MODULE_VIEW" },
  { id: "sidebar.kyt", role: "KYT_MODULE_VIEW" },
  { id: "sidebar.kyt.kyt-screen", role: "KYT_MODULE_CREATE" },
  { id: "sidebar.kyt.my-kyt", role: "KYT_MODULE_VIEW" },
  { id: "sidebar.audit", role: "AUDIT_MODULE_VIEW" },
];

function filterMenu(array, fn) {
  return array.reduce((r, o) => {
    var children = filterMenu(o.children || [], fn);
    if (fn(o)) r.push(Object.assign({}, o, children.length && { children }));
    return r;
  }, []);
}

const SideBarContent = ({ ACL }) => {
  const classes = useStyles();
  const { drawerType, customerMe } = useSelector(
    (state) => state.settings,
    shallowEqual
  );

  const filterDisabledModule = (menu) => {
    let data = Object.assign({}, menu[0]);
    let disabledItems = [];

    if (!data?.children) return menu;

    protectedItems.forEach((item) => {
      if (!ACL.isAllowedPermissions(item.role)) {
        disabledItems.push(item.id);
      }
    });

    data.children = filterMenu(data.children, ({ name }) => {
      if (name === "sidebar.kyt") {
        if (!canAccessKYT(customerMe)) return false;
        return !disabledItems.includes(name);
      }
      if (name === "sidebar.liveness") {
        return canAccessLiveness(customerMe);
        return !canAccessKYT(customerMe) || !disabledItems.includes(name);
      }
      return !disabledItems.includes(name);
    });

    return [data];
  };

  const menuConfig = navigationMenus;
  return (
    <>
      <CustomScrollbars className={`scrollbar ${classes.navigation}`}>
        <div style={{ marginBottom: 5 }}>
          <Navigation
            drawerType={drawerType}
            menuItems={filterDisabledModule(menuConfig)}
          />
        </div>
      </CustomScrollbars>
      <div className={classes.menuFooter}>
        <span>
          RegTank Technology Pte. Ltd
          <br />
          Version {VERSION_WEB} | Build {VERSION_BUILD}
        </span>
      </div>
    </>
  );
};

export default withACL(SideBarContent);
