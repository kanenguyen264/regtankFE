import React from "react";
import { Link } from "react-router-dom";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import { ReactComponent as Img403 } from "assets/images/403.svg";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { toRem } from "@protego/sdk/utils/measurements";

const useStyles = makeStyles(() => ({
  pageImg: {
    boxSizing: "border-box",
    width: toRem(400),
    marginBottom: toRem(40)
  },
  pageTitle: {
    fontSize: toRem(24),
    fontWeight: "500",
    lineHeight: toRem(22),
    color: "#7B7B7B",
    marginBottom: `${toRem(16)} !important`
  },
  pageContent: {
    fontSize: toRem(17),
    lineHeight: toRem(22),
    color: "#7B7B7B",
    marginBottom: toRem(40)
  },
  pageControls: {
    fontSize: toRem(17),
    padding: `${toRem(15)} ${toRem(20)}`,
    lineHeight: toRem(20),
    background: "#0080FF",
    border: "1.5px solid #0078F0",
    boxShadow: "0 2px 4px rgba(34, 59, 96, 0.)",
    borderRadius: "6px",
    color: "#FFF",
    display: "block",
    margin: "auto",
    width: toRem(150),
    "&:hover": {
      textDecoration: "none",
      color: "#fff"
    }
  }
}));

const Error403 = ({
  title = <IntlMessages id="extraPages.403Title" />,
  msg = <IntlMessages id="extraPages.403Msg" />
}) => {
  const styles = useStyles();
  return (
    <div
      className={clsx(
        "page-error-container animated slideInUpTiny animation-duration-3",
        styles.pageWrap
      )}
    >
      <div className="page-error-content">
        <div className="error-code animated zoomInDown">
          <Img403 className={clsx(styles.pageImg)} />
        </div>
        <h2
          className={clsx(
            "text-center fw-regular title bounceIn animation-delay-10 animated",
            styles.pageTitle
          )}
        >
          {title}
        </h2>
        <p
          className={clsx(
            "text-center fw-regular title bounceIn animation-delay-10 animated",
            styles.pageContent
          )}
        >
          {msg}
        </p>
        <p className="text-center zoomIn animation-delay-20 animated">
          <Link
            className={clsx(
              "text-center zoomIn animation-delay-20 animated",
              styles.pageControls
            )}
            to="/"
          >
            <IntlMessages id="extraPages.back" />
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Error403;
