import IntlMessages from "@protego/sdk/UI/IntlMessages";
import PropTypes from "prop-types";
import React from "react";
import { getKybStatusTranslate, getKycStatusTranslate } from "util/kycStatus";
import styles from "./ScreenStatusBadge.module.scss";
import clsx from "clsx";

const ScreenStatusBadge = ({ status, unresolved, type }) => {
  let statusTranslate;
  if (type === "kyb") {
    statusTranslate = getKybStatusTranslate(status);
  } else {
    statusTranslate = getKycStatusTranslate(status);
  }

  return (
    <div className={clsx(styles.KeywordWrap, "RegStatusBadge-wrap")}>
      <div className={clsx(styles.Root, styles["status-" + status])}>
        {status && statusTranslate ? <IntlMessages id={statusTranslate} /> : ""}
        {unresolved > 0 && <div className={styles.Badge}>{unresolved}</div>}
      </div>
    </div>
  );
};

ScreenStatusBadge.propTypes = {
  status: PropTypes.string,
  unresolved: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.string
};

ScreenStatusBadge.defaultProps = {
  type: "kyc"
};

export default ScreenStatusBadge;
