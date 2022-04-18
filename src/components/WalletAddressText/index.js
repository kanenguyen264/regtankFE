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

const useWalletAddressStyle = makeStyles((theme) => {
  return {
    root: {
      cursor: "pointer",
      width: ({ width }) => {
        return toRem(width);
      },
      "& .MuiCopyButton-root": {
        width: ({ width }) => {
          return toRem(width);
        },
        position: "relative",
        whiteSpace: "nowrap",
        "& .copy-text": {
          width: `calc(100% - ${toRem(30)})`,
          textOverflow: "ellipsis",
          display: "block",
          overflow: "hidden",
          float: "left",
          color: LINK.base,
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

  const walletAddressStyle = useWalletAddressStyle({ width });
  const tooltipStyles = useTooltipStyles({ width });

  if (disableCopy) {
    return (
      <Grid container classes={walletAddressStyle}>
        <Tooltip
          classes={tooltipStyles}
          title={text}
          arrow
          interactive
          placement="top-start"
        >
          <div
            style={{
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textAlign: "center",
              width: "inherit",
            }}
          >
            {href && href.length ? (
              isRouter ? (
                <Link
                  to={disableHref && href}
                  className={clsx("copy-text", linkStyle)}
                >
                  {text}
                </Link>
              ) : (
                <MuiLink
                  href={href}
                  target={target}
                  className={clsx("copy-text", linkStyle)}
                >
                  {text}
                </MuiLink>
              )
            ) : (
              <span>{text}</span>
            )}
          </div>
        </Tooltip>
      </Grid>
    );
  }

  return (
    <Grid container classes={walletAddressStyle}>
      <div className={"d-flex flex-column"}>
        <CopyButton component={"span"} tooltip={coppyText}>
          <Tooltip
            classes={tooltipStyles}
            title={text}
            arrow
            interactive
            placement="top-start"
          >
            {href && href.length ? (
              isRouter ? (
                <Link to={href} className={clsx("copy-text", linkStyle)}>
                  {text}
                </Link>
              ) : (
                <MuiLink
                  href={href}
                  target={target}
                  className={clsx("copy-text", linkStyle)}
                >
                  {text}
                </MuiLink>
              )
            ) : (
              <div>
                <span className="copy-text">{text}</span>
              </div>
            )}
          </Tooltip>
        </CopyButton>
        <span>
          <Keyword
            hideTooltip={true}
            size={"small"}
            multiLanguage
            keywords={[
              enableNewTransactionMonitoring && TRANSACTION,
              enableNewRiskMonitoring && RISK_SCORE,
            ]}
          />
        </span>
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
