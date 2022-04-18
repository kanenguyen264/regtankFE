//@flow
import React from "react";
import { compose } from "recompose";
import styles from "./KYCScreenStatusBadge.module.scss";
import { getStatusTranslate, getColorStatus } from "util/kycStatus";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import clsx from "clsx";

const KYCScreenStatusBadge = compose()(
  /**
   *
   * @param {KYCScreenStatusBadgeProps} props
   * @returns {JSX.Element}
   * @constructor
   */
  function KYCScreenStatusBadge(props) {
    const status = getStatusTranslate(props.status);
    return (
      <div className={clsx(styles.KeywordWrap)}>
        <div
          style={{ backgroundColor: getColorStatus(props?.status) }}
          className={styles.Root}
        >
          {status ? <IntlMessages id={status} /> : ""}
          {props.unresolved > 0 && (
            <div className={styles.Badge}>{props.unresolved}</div>
          )}
        </div>
      </div>
    );
  }
);

export default KYCScreenStatusBadge;
