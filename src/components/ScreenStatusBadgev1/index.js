import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import PropTypes from "prop-types";
import React from "react";
import { getKybStatusTranslate, getKycStatusTranslate } from "util/kycStatus";
import styles from "./ScreenStatusBadge.module.scss";
import clsx from "clsx";
import Tooltip from "@protego/sdk/RegtankUI/v1/Tooltip";
import { Typography } from "@mui/material";

const ScreenStatusBadge = ({ status, unresolved, type }) => {
  let statusTranslate;
  if (type === "kyb") {
    statusTranslate = getKybStatusTranslate(status);
  } else {
    statusTranslate = getKycStatusTranslate(status);
  }

  return (
    <div className={clsx(styles.KeywordWrap, "screenStatusBageWrapper")}>
      <div
        className={clsx(
          styles.Root,
          styles["status-" + status],
          "screenStatusBage"
        )}
      >
        {status && statusTranslate ? <IntlMessages id={statusTranslate} /> : ""}
        {unresolved > 99 ? (
          <div className={styles.Badge}>
            <Tooltip
              arrow
              placement="top"
              title={
                <Typography variant="body1">
                  <IntlMessages id={unresolved} />
                </Typography>
              }
            >
              <span
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {"99+"}
              </span>
            </Tooltip>
          </div>
        ) : unresolved < 99 && unresolved > 0 ? (
          <div className={styles.Badge}>{unresolved}</div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

ScreenStatusBadge.propTypes = {
  status: PropTypes.string,
  unresolved: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.string,
};

ScreenStatusBadge.defaultProps = {
  type: "kyc",
};

export default ScreenStatusBadge;
