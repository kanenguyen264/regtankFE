import { makeStyles } from "@mui/styles";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import React, { Fragment } from "react";

const useStyles = makeStyles(() => ({
  root: {
    color: "#ffffff",
    display: "inline-flex",
    width: toRem(36),
    height: toRem(36),
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "9px",
  },
  txt: {
    fontWeight: "500",
    fontSize: `${toRem(16)}`,
    lineHeight: `${toRem(20)}`,
  },
}));

const RiskLevel = function RiskLevel({ value }) {
  const classes = useStyles();
  return (
    <Fragment>
      <div
        className={classes.root}
        style={{ backgroundColor: value?.bgColor || '#4CAF50' }}
      >
        <span className={classes.txt}>{value?.title || '-'}</span>
      </div>
    </Fragment>
  );
};

export default RiskLevel;
