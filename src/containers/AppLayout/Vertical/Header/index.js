import { AppBar, Divider, IconButton, Toolbar } from "@mui/material";
import { makeStyles } from "@mui/styles";
import AppBarNotification from "@protego/sdk/RegtankUI/v1/AppBarNotification/AppBarNotification";
import { fetchAllNotificationHeader } from "actions";
import { switchLanguage, toggleCollapsedNav } from "actions/Setting";
import AppNotification from "components/AppNotification";
import UserInfo from "components/UserInfo";
import { COLLAPSED_DRAWER, FIXED_DRAWER } from "constants/ActionTypes";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "constants/pagingSetting";
import { forEach } from "lodash";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import { Dropdown, DropdownToggle } from "reactstrap";
import { parseQuery } from "util/stringQuery";
import { LayoutContext } from "../../AppLayouts";
import styles from "../Header/Header.module.scss";
import { StylesProvider, createGenerateClassName } from "@mui/styles";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import clsx from "clsx";
import { BLACK } from "constants/ThemeColors";
const useStyles = makeStyles((theme) => ({
  logo: {
    height: toRem(40),
    width: theme.props.AppLayout.sidebarWidth,
    objectFit: "contain",
  },
  menuContent: {
    "& > * > *:first-child": {
      paddingLeft: "0px !important",
      paddingRight: "0px !important",
    },
    paddingBottom: toRem(16),
  },
  menuHeader: {
    fontSize: `${toRem(18)} !important`,
    color: `${BLACK} !important`,
    fontWeight: 600,
  },
}));
const generateClassName = createGenerateClassName({
  productionPrefix: "reg",
});

const Index = (props) => {
  const sidebarClasses = useStyles();
  const dispatch = useDispatch();

  const [notificationsCount, setNotificationsCount] = useState(0);
  const [langSwitcher, setLangSwitcher] = useState(false);
  let interval = useRef(null);

  const notificationsPopup = useSelector(
    (state) => state.notifications.notificationsPopup
  );
  const { drawerType, locale, navCollapsed } = useSelector(
    ({ settings }) => settings
  );
  let stylesAppBar = {
    HeaderCover: {
      position: "absolute",
      right: 0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      display: "flex",
    },
  };
  let query = parseQuery();
  query = {
    ...query,
    page: query.page ? query.page : DEFAULT_PAGE,
    size: query.size ? query.size : DEFAULT_PAGE_SIZE,
  };

  useEffect(() => {
    /* 1200656890791682 - Temporarily hides the Language Switcher */
    onSwitchLanguage(locale);
    dispatch(fetchAllNotificationHeader(query));
    interval.current = setInterval(() => {
      dispatch(fetchAllNotificationHeader(query));
    }, 60000); // 30s interval to reload notification

    return () => clearInterval(interval.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let count = 0;
    forEach(notificationsPopup.records, (value) => {
      if (value.read === false) {
        count++;
      }
    });
    setNotificationsCount(count);
  }, [notificationsPopup]);

  const onLangSwitcherSelect = (event) => {
    setLangSwitcher(!langSwitcher);
  };

  const onToggleCollapsedNav = (e) => {
    const val = !navCollapsed;
    dispatch(toggleCollapsedNav(val));
  };

  const onSwitchLanguage = (lang) => {
    dispatch(switchLanguage(lang));
    localStorage.setItem("lang_trans", JSON.stringify(lang));
  };

  const drawerStyle = drawerType.includes(FIXED_DRAWER)
    ? "d-block d-xl-none"
    : drawerType.includes(COLLAPSED_DRAWER)
    ? "d-block"
    : "d-none";

  const { classes } = useContext(LayoutContext);

  const onOpenNotification = () => {
    dispatch(fetchAllNotificationHeader());
  };

  return (
    <StylesProvider generateClassName={generateClassName}>
      <AppBar className={styles.Container} position={"static"}>
        <Toolbar>
          <IconButton
            className={`jr-menu-icon mr-3 ${drawerStyle}`}
            aria-label="Menu"
            onClick={onToggleCollapsedNav}
          >
            <span className="menu-icon" />
          </IconButton>
          <div style={stylesAppBar.HeaderCover} className={styles.PaddingSize}>
            <ul className="header-notifications list-inline ml-auto">
              <li className="list-inline-item">
                <Dropdown
                  className="quick-menu"
                  isOpen={langSwitcher}
                  toggle={onLangSwitcherSelect}
                >
                  <DropdownToggle
                    className="d-inline-block"
                    tag="span"
                    data-toggle="dropdown"
                  >
                    <div>
                      <IconButton
                        className="icon-btn"
                        style={{
                          cursor: "default",
                          backgroundColor: "transparent",
                          padding: 0,
                        }}
                      >
                        <i
                          style={{ borderRadius: 10 }}
                          className={`flag flag-24 flag-${locale.icon}`}
                        />
                      </IconButton>
                    </div>
                  </DropdownToggle>
                </Dropdown>
              </li>
              <li className="list-inline-item mr-1 ml-1">
                <div>
                  <Divider className={styles.Divider} />
                </div>
              </li>
              <li className={clsx("list-inline-item", styles.appBarContainer)}>
                <AppBarNotification
                  onOpen={onOpenNotification}
                  count={notificationsCount}
                  classes={{
                    menuContent: sidebarClasses.menuContent,
                    menuHeader: sidebarClasses.menuHeader,
                    icon: styles.NotificationIcon,
                    badge: styles.NotificationBadge,
                  }}
                >
                  <AppNotification />
                </AppBarNotification>
              </li>
            </ul>
            <UserInfo />
          </div>
        </Toolbar>
      </AppBar>
    </StylesProvider>
  );
};

export default withRouter(Index);
