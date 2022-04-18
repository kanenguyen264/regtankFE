import React from "react";
import { withRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "./Header/index";
import SideBar from "containers/SideBar/index";
import { COLLAPSED_DRAWER, FIXED_DRAWER } from "constants/ActionTypes";
import { isIOS, isMobile } from "react-device-detect";
import styles from "./Vertical.module.scss";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { LayoutContext } from "../AppLayouts";

// const isMinWidth1900 = useMediaQuery('(min-width:1900px)');

const useStyles = makeStyles((theme) => {
  return {
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      "& .app-logo": {
        width: theme.props.AppLayout.sidebarWidth - 16 * 2,
        [theme.breakpoints.up("sm")]: {
          width: theme.props.AppLayout.sidebarWidth - 24 * 2,
        },
      },
    },
    drawerOuter: {
      "&.app-sidebar": {
        width: 264,
        minWidth: 264,
        maxWidth: 264,
        zIndex: 10000,
        [theme.breakpoints.up(1900)]: {
          width: 264,
          minWidth: 264,
          maxWidth: 264,
        },
      },
    },
    drawer: {
      flexShrink: 0,
      width: 264,
      [theme.breakpoints.up(1900)]: {
        width: 264,
      },
    },
    drawerPaper: {
      width: 264,
      [theme.breakpoints.up(1900)]: {
        width: 264,
      },
    },
  };
});

const Vertical = (props) => {
  const { drawerType } = useSelector(({ settings }) => settings);

  const drawerStyle = drawerType.includes(FIXED_DRAWER)
      ? "fixed-drawer"
      : drawerType.includes(COLLAPSED_DRAWER)
      ? "collapsible-drawer"
      : "mini-drawer",
    classes = useStyles();

  //set default height and overflow for iOS mobile Safari 10+ support.
  if (isIOS && isMobile) {
    document.body.classList.add("ios-mobile-view-height");
  } else if (document.body.classList.contains("ios-mobile-view-height")) {
    document.body.classList.remove("ios-mobile-view-height");
  }

  return (
    <LayoutContext.Provider value={{ classes }}>
      <div className={clsx(styles.AppContainer, drawerStyle)}>
        <div className="app-header">
          <Header />
        </div>
        <div className={styles.AppMainContainer}>
          <SideBar />
          <main className="app-main-content-wrapper">
            <div className="app-main-content">{props.children}</div>
          </main>
        </div>
      </div>
    </LayoutContext.Provider>
  );
};

export default withRouter(Vertical);
