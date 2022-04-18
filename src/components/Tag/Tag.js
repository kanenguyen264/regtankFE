import makeStyles from "@material-ui/core/styles/makeStyles";
import clsx from "clsx";
import React from "react";

const SMALL = "small";
const useStyles = makeStyles((theme) => ({
  KeywordStyle: {
    paddingLeft: theme.typography.pxToRem(20),
    paddingRight: theme.typography.pxToRem(20),
    paddingTop: theme.typography.pxToRem(4),
    paddingBottom: theme.typography.pxToRem(4),
    borderRadius: theme.typography.pxToRem(12),
    marginRight: theme.typography.pxToRem(6),
    marginTop: theme.typography.pxToRem(4),
    marginBottom: theme.typography.pxToRem(4),
    fontSize: `${theme.typography.pxToRem(12)} !important`,
    display: "inline-block"
  },
  KeywordStyleSmall: {
    paddingLeft: theme.typography.pxToRem(10),
    paddingRight: theme.typography.pxToRem(10)
  }
}));

const Tag = function Keyword({ keywords, size, color, brColor, name }) {
  const classes = useStyles();

  return (
    <span
      style={{
        backgroundColor: brColor,
        color: color,
        whiteSpace: "nowrap"
      }}
      className={clsx(
        classes.KeywordStyle,
        size === SMALL && classes.KeywordStyleSmall
      )}
    >
      {name}
    </span>
  );
};

export default Tag;
