import React from "react";
import { Tooltip } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";

const useStyles = makeStyles((theme) => ({
  customTooltip: {
    transform: "none!important",
    padding: "0",
    borderRadius: "10px",
    margin: `${toRem(13)} 0`,
    "& p": {
      fontSize: toRem(14),
      lineHeight: toRem(20),
    },
    "& .custom-tooltip": {
      padding: `${toRem(6)} ${toRem(10)}`,
      maxWidth: toRem(320),
    },
  },
  customArrow: {
    marginTop: `${toRem(-7)} !important`,
    marginBottom: `${toRem(-7)} !important`,
  },
}));

const CustomTooltip = (props) => {
  const classes = useStyles();
  return (
    <Tooltip
      classes={{
        tooltip: classes.customTooltip,
        arrow: classes.customArrow,
      }}
      {...props}
    >
      {props.children}
    </Tooltip>
  );
};

export default CustomTooltip;
