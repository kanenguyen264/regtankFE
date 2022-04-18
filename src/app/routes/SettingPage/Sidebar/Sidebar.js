import { makeStyles } from "@mui/styles";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";
import React from "react";
import { NavLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    minHeight: `calc(100% + ${toRem(60)})`,
    margin: `${toRem(-30)} ${toRem(-40)}`,
    "& ::-webkit-scrollbar": {
      width: toRem(4),
    },
    /* Handle */
    "& :hover::-webkit-scrollbar-thumb": {
      backgroundColor: ThemeColors.bgSidebar,
    },
  },
  sidebar: {
    width: (props) => props.sideBarWidth,
    height: `calc(100vh - 82px)`,
    flexShrink: 0,
    backgroundColor: ThemeColors.bgSidebar,
    paddingTop: "109px",
    paddingBottom: "34px",
    paddingLeft: 0,
    position: "absolute",
    top: 0,
    zIndex: 1201,
    "overflow-y": "auto",
    left: "68px",
  },
  sidebarContainer: {
    height: `100vh`,
    marginTop: 0,
    [theme.breakpoints.up(1900)]: {
      marginTop: 0,
    },
    "& .MuiList-subheader": {
      paddingBottom: 0,
      "&:last-child": {
        paddingBottom: "20px",
      },
    },
    "& .MuiListSubheader-root": {
      fontWeight: 600,
      fontSize: toRem(14),
      lineHeight: toRem(18),
      letterSpacing: toRem(0.2),
      color: ThemeColors.default,
      padding: `${toRem(16)} ${toRem(16)} ${toRem(12)} ${toRem(16)}`,
      backgroundColor: ThemeColors.bgSidebar,
      marginBottom: toRem(4),
    },
    "& .MuiListItem-root": {
      padding: `${toRem(12)} ${toRem(16)}`,
      marginBottom: toRem(4),
      borderRadius: toRem(8),
      "&:hover": {
        backgroundColor: ThemeColors.bgActiveSidebar,
        borderRadius: toRem(8),
        "& .MuiListItemIcon-root": {
          "& > svg > path": {
            fill: ThemeColors.textItemActiveSidebar,
          },
        },
        "& .MuiListItemText-root": {
          "& > span": {
            color: ThemeColors.textItemActiveSidebar,
          },
        },
      },
      "& .MuiListItemIcon-root": {
        minWidth: "unset",
        "& > svg": {
          width: toRem(24),
          height: toRem(24),
          "& path": {
            fill: ThemeColors.textItemSidebar,
          },
        },
      },
      "& .MuiListItemText-root": {
        margin: 0,
        "& > span": {
          fontWeight: 600,
          fontSize: toRem(14),
          lineHeight: toRem(18),
          letterSpacing: toRem(0.2),
          color: ThemeColors.default,
          padding: 0,
          marginLeft: toRem(8),
        },
      },
    },
  },
  content: {
    width: (props) => {
      return `calc((100vw - ${props.sideBarWidth}))`;
    },
    flexGrow: 1,
    padding: `${theme.typography.pxToRem(30)} ${theme.typography.pxToRem(40)}`,
    marginLeft: (props) => {
      return props.sideBarWidth;
    },
  },
  navLinkActive: {
    backgroundColor: ThemeColors.bgActiveSidebar,
    borderRadius: toRem(8),
    "&:hover": {
      backgroundColor: ThemeColors.bgActiveSidebar,
    },
    "& svg path": {
      fill: `${ThemeColors.textItemActiveSidebar} !important`,
    },
    "& span": {
      color: `${ThemeColors.textItemActiveSidebar} !important`,
    },
  },
}));

const SidebarContext = React.createContext({ classes: {} });

const SidebarContainer = (props) => {
  const classes = useStyles(props);

  return (
    <SidebarContext.Provider value={{ classes }}>
      <div className={classes.root}>{props.children}</div>
    </SidebarContext.Provider>
  );
};
SidebarContainer.defaultProps = {
  sideBarWidth: "196px",
};

const SidebarMenu = (props) => {
  const { children } = props,
    { classes } = React.useContext(SidebarContext);

  return (
    <div className={classes.sidebar}>
      <div className={classes.sidebarContainer}>{children}</div>
    </div>
  );
};

const SidebarNavLink = (props) => {
  const { classes } = React.useContext(SidebarContext);

  return <NavLink activeClassName={classes.navLinkActive} {...props} />;
};
const SidebarContent = (props) => {
  const { classes } = React.useContext(SidebarContext);
  return <div className={classes.content}>{props.children}</div>;
};

const Sidebar = {
  Container: SidebarContainer,
  Menu: SidebarMenu,
  NavLink: SidebarNavLink,
  Content: SidebarContent,
};

export default Sidebar;
