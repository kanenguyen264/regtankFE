import React from "react";
import { toRem } from "@protego/sdk/utils/measurements";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { Box } from "@material-ui/core";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";
export const AntTabs = withStyles({
  root: {
    borderBottom: "1px solid #e8e8e8",
    height: "auto",
    minHeight: "auto",
    overflow: "visible !important",

    "& .MuiTab-root ": {
      padding: `0 ${toRem(8)}`,
      minWidth: "20px",
      minHeight: "auto",
      margin: `0 0 ${toRem(16)} 0`,
      color: ThemeColors.defaultDark,
      fontSize: "12px",
      lineHeight: "16px",
      textAlign: "center",
      letterSpacing: "0.12px",
      fontWeight: "500",
      fontStyle: "normal",
      marginRight: toRem(16),
    },
    "& .MuiTab-root.Mui-selected": {
      fontWeight: "500",
      color: ThemeColors.primary,
    },
  },
  indicator: {
    backgroundColor: ThemeColors.primary,
    borderRadius: "10px",
    display: "inline-block",
  },
  scroller: {
    paddingBottom: "1px",
    marginBottom: "-1px",
  },
})(Tabs);

export const AntTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
    fontWeight: 500,
    marginRight: theme.spacing(4),
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    padding: `0 ${toRem(14)}`,
    "&:hover": {
      color: "#0080FF",
      opacity: 1,
    },
    "&:focus": {
      color: "#0080FF",
    },
  },
  selected: {},
}))((props) => <Tab disableRipple {...props} />);

export const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
