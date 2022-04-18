import { Tooltip } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import clsx from "clsx";
import React, { Fragment } from "react";
import {
  getColorKeyWord,
  getColorTextKeyWord,
  getTextTranslate,
  getTextKeyWork,
} from "util/keyword";

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
    display: "inline-block",
  },
  KeywordStyleSmall: {
    paddingLeft: theme.typography.pxToRem(10),
    paddingRight: theme.typography.pxToRem(10),
  },
}));

const Keyword = function Keyword({
  keywords,
  hideTooltip,
  size,
  multiLanguage,
  screen,
}) {
  const classes = useStyles();
  return (
    <Fragment>
      {keywords &&
        keywords.map((item, index) => {
          if (!item) {
            return null;
          }
          return (
            <Tooltip
              key={index}
              title={
                <IntlMessages
                  id={getTextTranslate(item, screen)}
                ></IntlMessages>
              }
              arrow
              disableHoverListener={hideTooltip}
            >
              <span
                style={{
                  backgroundColor: getColorKeyWord(item),
                  color: getColorTextKeyWord(item),
                }}
                className={clsx(
                  classes.KeywordStyle,
                  size === SMALL && classes.KeywordStyleSmall
                )}
              >
                {multiLanguage ? (
                  <span>
                    {item && <IntlMessages id={getTextTranslate(item)} />}
                  </span>
                ) : (
                  getTextKeyWork(item)
                )}
              </span>
            </Tooltip>
          );
        })}
      {(!keywords || keywords.length === 0) && "-"}
    </Fragment>
  );
};

export default Keyword;
