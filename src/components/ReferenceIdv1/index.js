import { Grid, Link as MuiLink, SvgIcon, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import CopyButton from "@protego/sdk/RegtankUI/v1/CopyButton";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import Tooltip from "@protego/sdk/RegtankUI/v1/Tooltip";
import clsx from "clsx";
import Keyword from "components/Keyword";
import { RISK_SCORE, TRANSACTION } from "constants/Keywords";
import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { LINK } from "../../constants/ThemeColors";
import { useIntl } from "react-intl";
import { ReactComponent as CopyIcon } from "assets/images/icons/CopyIcon.svg";

const useReferenceIdStyle = makeStyles((theme) => {
  return {
    root: {
      cursor: "pointer",
      width: ({ width }) => {
        return toRem(width);
      },
      "& .MuiSvgIcon-root": {
        height: toRem(18),
        width: toRem(16),
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
            height: toRem(18),
            width: toRem(16),
          },
        },
        "& .MuiCopyButton-copyButton": {
          paddingLeft: 0,
        },
      },
      "& .limitText": {
        width: "min-content",
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

const useTooltipStyles = makeStyles(() => ({
  arrow: {
    right: `${toRem(0)} !important`,
    left: `${toRem(-10)} !important`,
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
      <Grid container classes={referenceIdStyle}>
        <Tooltip
          title={<Typography variant="body1">{text}</Typography>}
          arrow
          interactive
          placement="top-start"
        >
          <div
            style={{
              textAlign: "center",
              width: "min-content",
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
      <div
        className={"d-flex align-items-center"}
        // style={{ width: "inherit", paddingRight: toRem(10) }}
      >
        <Tooltip
          classes={tooltipStyles}
          title={<Typography variant="body1">{text}</Typography>}
          arrow
          interactive
          placement="top-start"
        >
          <div>
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
          </div>
        </Tooltip>
        <CopyButton
          component={"span"}
          tooltip={coppyText}
          copyIcon={<SvgIcon component={CopyIcon} viewBox="0 0 18 16" />}
        >
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
