import { Grid, Link as MuiLink, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CopyButton from "@protego/sdk/UI/CopyButton/CopyButton";
import { toRem } from "@protego/sdk/utils/measurements";
import clsx from "clsx";
import Keyword from "components/Keyword";
import { RISK_SCORE, TRANSACTION } from "constants/Keywords";
import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { LINK } from "../../constants/ThemeColors";
import { useIntl } from "react-intl";

const useReferenceIdStyle = makeStyles((theme) => {
  return {
    root: {
      cursor: "pointer",
      width: ({ width }) => {
        return toRem(width);
      },
      "& .MuiCopyButton-root": {
        width: ({ width }) => {
          return toRem(13);
        },
        position: "relative",
        whiteSpace: "nowrap",
        "& .copy-text": {
          display: "block",
        },
        "& button": {
          position: "absolute",
          top: "-7px",
          right: 0,
          "& svg": {
            height: toRem(16),
            width: toRem(13),
          },
        },
        "& .MuiCopyButton-copyButton": {
          height: toRem(30),
          paddingLeft: 0
        },
      },
      "& .limitText": {
        width: `inherit`,
        display: "inline-block",
        color: LINK.base,
        marginRight: toRem(5),
        "& a": {
          color: LINK.base,
        },
      },
    },
  };
});

const useTooltipStyles = makeStyles((theme) => ({
  tooltip: {
    maxWidth: "none",
    fontWeight: "400",
    lineHeight: "1.43",
    minWidth: ({ width }) => {
      return toRem(width - 10);
    },
    "& a": {
      color: LINK.tooltipText,
    },
  },
  arrow: {
    left: "8px !important",
  },
}));

const ReferenceId = (props) => {
  const { formatMessage } = useIntl();
  const {
    text,
    limitText,
    width,
    href,
    isRouter = false,
    target = "",
    linkStyle,
    disableCopy,
    disableHref,
    enableNewTransactionMonitoring,
    enableNewRiskMonitoring,
    coppyText = formatMessage({ id: "appModule.tooltip.copy" }),
  } = props;

  const referenceIdStyle = useReferenceIdStyle({ width });
  const tooltipStyles = useTooltipStyles({ width });

  if (disableCopy) {
    return (
      <Grid container classes={referenceIdStyle} >
        <Tooltip
          classes={tooltipStyles}
          title={text}
          arrow
          interactive
          placement="top-start"
        >
          <div
            style={{
              // textAlign: "center",
              width: "inherit",
            }}
          >
            {href && href.length ? (
              isRouter ? (
                <Link
                  to={disableHref && href}
                  className={clsx("limitText", linkStyle)}
                >
                  {limitText}
                </Link>
              ) : (
                <MuiLink
                  href={href}
                  target={target}
                  className={clsx("limitText", linkStyle)}
                >
                  {limitText}
                </MuiLink>
              )
            ) : (
              <span>{limitText}</span>
            )}
          </div>
        </Tooltip>
      </Grid>
    );
  }

  return (
    <Grid container classes={referenceIdStyle}>
      <div className={"d-flex"} style={{ width: "inherit", paddingRight: toRem(5) }}>
        <Tooltip
          classes={tooltipStyles}
          title={text}
          arrow
          interactive
          placement="top-start"
        >
          {href && href.length ? (
            isRouter ? (
              <span className={clsx("limitText", linkStyle)}>
                <Link to={href}>{limitText}</Link>
              </span>
            ) : (
              <MuiLink
                href={href}
                target={target}
                className={clsx("limitText", linkStyle)}
              >
                {limitText}
              </MuiLink>
            )
          ) : (
            <span className={clsx("limitText", linkStyle)}>{limitText}</span>
          )}
        </Tooltip>
        <CopyButton component={"span"} tooltip={coppyText}>
          <div style={{ display: "none" }}>{text}</div>
        </CopyButton>
      </div>
    </Grid>
  );
};

ReferenceId.propTypes = {
  text: PropTypes.string.isRequired,
  isTooltip: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  href: PropTypes.string,
  isRouter: PropTypes.bool,
  linkStyle: PropTypes.string,
};

ReferenceId.defaultProps = {
  width: "100%",
};

export default ReferenceId;
