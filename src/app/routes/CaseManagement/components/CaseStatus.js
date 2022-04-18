import IntlMessages from "@protego/sdk/UI/IntlMessages";
import PropTypes from "prop-types";
import React from "react";
// import styles from "./ScreenStatusBadge.module.scss";
import clsx from "clsx";
import { makeStyles, withStyles } from "@mui/styles";
import { compose } from "recompose";
import { KYC_STATUS } from "constants/KycStatus";
import { KYB_STATUS } from "constants/KybStatus";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";

const styles = {
  status: {
    padding: `${toRem(4)} ${toRem(12)}`,
    borderRadius: "24px",
    fontWeight: "500",
    fontSize: toRem(14),
    lineHeight: toRem(16),
    display: "inline-block",
  },
  UNRESOLVED: { background: "#EEEEEE", color: "#666666" },
  NO_MATCH: { background: "#EEEEEE", color: "#666666" },
  POSITIVE_MATCH: { background: "rgba(0, 128, 255, 0.2)", color: "#004E9B" },
  APPROVED: { background: "#F0FAF3", color: "#21A453" },
  COMPLETED: { background: "#F0FAF3", color: "#21A453" },
  REJECTED: { background: "#FBEFEE", color: "#D44333" },
};

const getKycStatusTranslate = (status) => {
  if (!status) {
    return;
  }
  switch (status) {
    case KYC_STATUS.UNRESOLVED:
      return "appModule.kyc.status.UNRESOLVED";
    case KYC_STATUS.COMPLETED:
      //   return "appModule.kyc.status.COMPLETED";
      return "kyc.change.note.approved";
    case KYC_STATUS.APPROVED:
      return "kyc.change.note.approved";
    case KYC_STATUS.REJECTED:
      return "kyc.change.note.rejected";
    case KYC_STATUS.NO_MATCH:
      //   return "appModule.kyc.status.NO_MATCH";
      return "appModule.kyc.status.UNRESOLVED";
    case KYC_STATUS.POSITIVE_MATCH:
      // return "appModule.kyc.status.UNRESOLVED";
      return "appModule.kyc.status.POSITIVE";

    default:
      return "";
  }
};

const getKybStatusTranslate = (status) => {
  if (!status) {
    return;
  }
  switch (status) {
    case KYB_STATUS.PENDING:
      //   return "appModule.kyb.status.PENDING";
      return "appModule.kyb.status.UNRESOLVED";
    case KYB_STATUS.UNRESOLVED:
      return "appModule.kyb.status.UNRESOLVED";
    case KYB_STATUS.COMPLETED:
      //   return "my.kyb.status.COMPLETED";
      return "kyc.change.note.approved";
    case KYC_STATUS.APPROVED:
      return "kyc.change.note.approved";
    case KYC_STATUS.REJECTED:
      return "kyc.change.note.rejected";
    case KYC_STATUS.NO_MATCH:
      //   return "appModule.kyc.status.NO_MATCH";
      return "appModule.kyb.status.UNRESOLVED";
    case KYC_STATUS.POSITIVE_MATCH:
        return "appModule.kyc.status.POSITIVE";
    default:
      return "";
  }
};

const CaseStatus = ({ status, unresolved, type, classes }) => {
  // const classes = caseStatus();
  let statusTranslate;
  if (type === "kyb") {
    statusTranslate = getKybStatusTranslate(status);
  } else {
    statusTranslate = getKycStatusTranslate(status);
  }

  return (
    <div className={classes.root}>
      <div className={clsx(classes.status, classes[status])}>
        {status && statusTranslate ? <IntlMessages id={statusTranslate} /> : ""}
        {/* {unresolved > 0 && <div className={styles.Badge}>{unresolved}</div>} */}
      </div>
    </div>
  );
};

CaseStatus.propTypes = {
  status: PropTypes.string,
  unresolved: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.string,
};

CaseStatus.defaultProps = {
  type: "kyc",
};

export default compose(withStyles(styles))(CaseStatus);
