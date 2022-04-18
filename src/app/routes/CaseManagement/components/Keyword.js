import { makeStyles } from "@mui/styles";
import Tooltip from "@Protego/sdk/RegtankUI/v1/Tooltip";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import clsx from "clsx";
import React, { Fragment } from "react";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
const data = {
  "AM": {
    bgColor: "rgba(127, 109, 236, 0.2)",
    txtColor: "#7F6DEC",
    title: <IntlMessages id="caseManagement.keyword.am.title"/>,
    description: <IntlMessages id="caseManagement.keyword.am.description"/>,
  },
  "PR": {
    bgColor: "rgba(192, 109, 236, 0.2)",
    txtColor: "#C06DEC",
    title: <IntlMessages id="caseManagement.keyword.pr.title"/>,
    description: <IntlMessages id="caseManagement.keyword.pr.description"/>,
  },
  "PEP": {
    bgColor: "rgba(0, 189, 210, 0.2)",
    txtColor: "#00BDD2",
    title: <IntlMessages id="caseManagement.keyword.pep.title"/>,
    description: <IntlMessages id="caseManagement.keyword.pep.description"/>,
  },
  "FE": {
    bgColor: "rgba(0, 210, 160, 0.2)",
    txtColor: "#00D2A0",
    title: <IntlMessages id="caseManagement.keyword.fe.title"/>,
    description: <IntlMessages id="caseManagement.keyword.fe.description"/>,
  },
};

const useStyles = makeStyles(() => ({
  KeywordStyle: {
    padding: `${toRem(4)} ${toRem(9)}`,
    borderRadius: '100px',
    fontWeight: '600',
    fontSize: `${toRem(10)}`,
    lineHeight: `${toRem(12)}`,
    textAlign: 'center',
    textTransform: 'uppercase',
    margin: `0 ${toRem(2)}`,
    minWidth: toRem(41),
    display: "inline-block"
  },
}));

const Keyword = function Keyword({
  keywords,
  hideTooltip,
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
              title={data[item].description}
              arrow
              disableHoverListener={hideTooltip}
            >
              <span
                style={{
                  backgroundColor: data[item].bgColor,
                  color: data[item].txtColor,
                }}
                className={clsx(classes.KeywordStyle)}
              >
                {data[item].title}
              </span>
            </Tooltip>
          );
        })}
      {(!keywords || keywords.length === 0) && "-"}
    </Fragment>
  );
};

export default Keyword;
