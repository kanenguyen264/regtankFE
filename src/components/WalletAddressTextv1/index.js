import {
  Grid,
  Link as MuiLink,
  Tooltip,
  Typography,
  SvgIcon,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import CopyButton from "@protego/sdk/RegtankUI/v1/CopyButton";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import clsx from "clsx";
import Keyword from "components/Keyword";
import { RISK_SCORE, TRANSACTION } from "constants/Keywords";
import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { LINK } from "../../constants/ThemeColors";
import { useIntl } from "react-intl";
import { ReactComponent as CopyIcon } from "assets/images/icons/CopyIcon.svg";

const useWalletAddressTextStyle = makeStyles((theme) => {
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

const WalletAddressText = (props) => {
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

  const referenceIdStyle = useWalletAddressTextStyle({ width });
  const tooltipStyles = useTooltipStyles({ width });

  if (disableCopy) {
    return (
      <Grid container classes={referenceIdStyle}>
        <Tooltip
          classes={tooltipStyles}
          title={text}
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
        style={{ width: "min-content", paddingRight: toRem(10) }}
      >
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
        <CopyButton
          component={"span"}
          tooltip={coppyText}
          copyIcon={<SvgIcon component={CopyIcon} viewBox="0 0 18 16" />}
        >
          <div style={{ display: "none" }}>{text}</div>
        </CopyButton>
        {/* <span>
          <Keyword
            hideTooltip={true}
            size={"small"}
            multiLanguage
            keywords={[
              enableNewTransactionMonitoring && TRANSACTION,
              enableNewRiskMonitoring && RISK_SCORE,
            ]}
          />
        </span> */}
      </div>
    </Grid>
  );
};
WalletAddressText.propTypes = {
  text: PropTypes.string.isRequired,
  isTooltip: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  href: PropTypes.string,
  isRouter: PropTypes.bool,
  linkStyle: PropTypes.string,
};

WalletAddressText.defaultProps = {
  width: "100%",
};

export default WalletAddressText;
