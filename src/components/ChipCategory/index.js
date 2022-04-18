import Tooltip from "@protego/sdk/RegtankUI/v1/Tooltip";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import React, { Fragment } from "react";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";
import MoreHoriz from "@mui/icons-material/MoreHoriz";

const SMALL = "small";
const useStyles = makeStyles((theme) => ({
  KeywordStyle: {
    paddingLeft: toRem(9),
    paddingRight: toRem(9),
    borderRadius: toRem(100),
    marginRight: toRem(6),
    fontSize: toRem(10),
    fontWeight: 600,
    display: "inline-block",
    backgroundColor: ThemeColors.grayBorder,
    color: ThemeColors.grayText,
    maxWidth: toRem(120),
    height: toRem(20),
    textAlign: "center",
  },
  KeywordStyleSmall: {
    paddingLeft: toRem(10),
    paddingRight: toRem(10),
  },
  MoreList: {
    paddingLeft: toRem(22),
    marginBottom: "0",

    "& li": {
      fontSize: toRem(14),
      lineHeight: toRem(20),
    },
  },
}));

const ChipCategory = function ChipCategory({
  keywords,
  hideTooltip,
  size,
  multiLanguage,
  className = "",
  limit = null,
}) {
  const classes = useStyles();
  return (
    <>
      {keywords &&
        keywords.map((item, index) => {
          // limit === null || index <= limit
          if (!item || (limit !== null && index >= limit)) {
            return null;
          }
          return (
            <Tooltip
              key={index}
              title={item?.name}
              arrow
              disableHoverListener={hideTooltip}
            >
              <span
                className={clsx(
                  classes.KeywordStyle,
                  size === SMALL && classes.KeywordStyleSmall,
                  className
                )}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: toRem(20),
                    textAlign: "center",
                  }}
                >
                  {item?.shortName}
                </span>
              </span>
            </Tooltip>
          );
        })}
      {limit && limit < keywords.length && (
        <Tooltip
          placement="top-start"
          title={
            <ul className={classes.MoreList}>
              {keywords.map((item) => (
                <li>{item?.name}</li>
              ))}
            </ul>
          }
        >
          <span
            className={clsx(
              classes.KeywordStyle,
              size === SMALL && classes.KeywordStyleSmall,
              className
            )}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                height: toRem(20),
                textAlign: "center",
              }}
            >
              <MoreHoriz />
            </span>
          </span>
        </Tooltip>
      )}
      {(!keywords || keywords.length === 0) && "-"}
    </>
  );
};

export default ChipCategory;