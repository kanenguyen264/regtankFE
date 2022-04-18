import { Toolbar } from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import { toggleCollapsedNav, updateWindowWidth } from "actions/Setting";
import clsx from "clsx";
import {
  COLLAPSED_DRAWER,
  FIXED_DRAWER,
  HORIZONTAL_NAVIGATION,
} from "constants/ActionTypes";
import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import { LayoutContext } from "../AppLayout/AppLayouts";
import SideBarContent from "./SideBarContent";
import { ReactComponent as LogoRegtankIcon } from "assets/images/icons/LogoBlackSidebar.svg";

const SideBar = compose(withRouter)(function SideBar() {
  const dispatch = useDispatch();
  const { navCollapsed, drawerType, width, navigationStyle } = useSelector(
    ({ settings }) => settings
  );
  const { classes: layoutClasses } = useContext(LayoutContext);
  useEffect(() => {
    window.addEventListener("resize", () => {
      dispatch(updateWindowWidth(window.innerWidth));
    });
  }, [dispatch]);

  const onToggleCollapsedNav = (e) => {
    dispatch(toggleCollapsedNav());
  };

  let drawerStyle = drawerType.includes(FIXED_DRAWER)
    ? "d-xl-flex"
    : drawerType.includes(COLLAPSED_DRAWER)
    ? ""
    : "d-flex";
  let type = "permanent";
  if (
    drawerType.includes(COLLAPSED_DRAWER) ||
    (drawerType.includes(FIXED_DRAWER) && width < 1200)
  ) {
    type = "temporary";
  }

  if (navigationStyle === HORIZONTAL_NAVIGATION) {
    drawerStyle = "";
    type = "temporary";
  }

  return (
    <div
      className={clsx(
        `app-sidebar d-none ${drawerStyle}`,
        layoutClasses.drawerOuter
      )}
    >
      <Drawer
        className={clsx("app-sidebar-content", layoutClasses.drawer)}
        variant={type}
        open={type.includes("temporary") ? navCollapsed : true}
        onClose={onToggleCollapsedNav}
        classes={{
          paper: clsx("side-nav", layoutClasses.drawerPaper),
        }}
      >
        <Link className="logoRegTank" to="/app/dashboard">
          <LogoRegtankIcon />
        </Link>
        <SideBarContent />
      </Drawer>
    </div>
  );
});

export default SideBar;
