//@flow
import Chip from "@mui/material/Chip";
import { makeStyles } from "@mui/styles";
import Check from "@material-ui/icons/Check";
import Close from "@material-ui/icons/Close";
import { Typography } from "@mui/material";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import { toRem } from "@protego/sdk/utils/measurements";
import { ReactComponent as LivenessExpiredIcon } from "assets/icons/liveness/LivenessExpiredIcon.svg";
import { ReactComponent as LivenessKYCPassedIcon } from "assets/icons/liveness/LivenessKYCPassedIcon.svg";
import { ReactComponent as LivenessKYCProgessIcon } from "assets/icons/liveness/LivenessKYCProgessIcon.svg";
import { ReactComponent as LivenessKYCTestFailedIcon } from "assets/icons/liveness/LivenessKYCTestFailedIcon.svg";
import { ReactComponent as LivenessPassedIcon } from "assets/icons/liveness/LivenessPassedIcon.svg";
import { ReactComponent as LivenessPeddingIcon } from "assets/icons/liveness/LivenessPeddingIcon.svg";
import { ReactComponent as LivenessProgessIcon } from "assets/icons/liveness/LivenessProgessIcon.svg";
import { ReactComponent as LivenessTestFailedIcon } from "assets/icons/liveness/LivenessTestFailedIcon.svg";
import { APPROVED, REJECTED } from "constants/ActionTypes";
import {
  FACE_COMPARE_STATUS,
  LIVENESS_KYC_STATUS,
  VERIFY_STATUS,
} from "constants/LivenessTest";
import { LIVENESS_PASSED, TEXT_HIGH } from "constants/ThemeColors";
import React from "react";
import { getKycStatusTranslate } from "util/kycStatus";

const useStyles = makeStyles(() => ({
  icon: {
    "& .MuiSvgIcon-root": {
      width: toRem(18),
    },
  },
  hideChip: {
    display: "flex",
    alignItems: "center",
    fontWeight: 500,
    "& .MuiChip-root": {
      height: "auto",
    },
    "& .MuiChip-icon": {
      marginLeft: 0,
    },
  },
}));

const getColorStatus = (_status) => {
  if (_status.key === APPROVED) {
    return LIVENESS_PASSED;
  }
  if (_status.key === REJECTED) {
    return TEXT_HIGH;
  }
  return _status.color;
};
const LivenessStatus = ({ status, shortMode, disabledChip = false }) => {
  const styles = useStyles();

  const _status = VERIFY_STATUS[status] || VERIFY_STATUS.URL_GENERATED;
  const color = disabledChip ? getColorStatus(_status) : _status.color;

  const label = shortMode
    ? _status.label2 || _status.label
    : _status.label || VERIFY_STATUS.PROCESSING.label;

  const getIconChip = (val) => {
    if (val === APPROVED) {
      return <Check />;
    }
    if (val === REJECTED) {
      return <Close />;
    }
    if (val === "LIVENESS_PASSED") {
      return <LivenessPassedIcon />;
    }

    if (val === "EXPIRED" || val === "RETRY") {
      return <LivenessExpiredIcon />;
    }
    if (val === "PROCESSING") {
      return <LivenessProgessIcon />;
    }
    if (val === "LIVENESS_FAILED") {
      return <LivenessTestFailedIcon />;
    }
    if (val === "WAIT_FOR_APPROVAL") {
      return <LivenessPeddingIcon />;
    }
    return "";
  };

  const getIconLivenessChip = (val) => {
    if (val === APPROVED) {
      return <Check />;
    }
    if (val === REJECTED) {
      return <Close />;
    }

    return "";
  };
  if (disabledChip) {
    return (
      <span className={styles.hideChip}>
        <Chip
          icon={
            <div
              style={{
                color: color,
              }}
            >
              {getIconChip(_status.key)}
            </div>
          }
          label={
            <span style={{ color: color, fontSize: toRem(16) }}>
              {getIconChip(_status.key) ? (
                <IntlMessages id={label} />
              ) : (
                <IntlMessages id={"appModule.hyphen"} />
              )}
            </span>
          }
        />
      </span>
    );
  }
  return (
    <span className={styles.icon}>
      <Chip
        // icon={
        //   <div style={{ color: color }}>{getIconLivenessChip(_status.key)}</div>
        // }
        label={
          <Typography variant="Subtitle5">
            <span style={{ color: color }}>
              <IntlMessages id={label} />
            </span>
          </Typography>
        }
        style={{
          backgroundColor: _status.background,
          height: toRem(30),
        }}
      />
    </span>
  );
};

export const CompareStatus = ({ status }) => {
  const _status = FACE_COMPARE_STATUS[status] || FACE_COMPARE_STATUS.PROCESSING;
  const color = _status.color || "default";

  return (
    <span>
      <Chip
        label={
          <strong style={{ color: color }}>
            <IntlMessages id={_status.label} />
          </strong>
        }
        style={{ backgroundColor: _status.background }}
      />
    </span>
  );
};
export const CompareStatusKYC = ({ status, unresolved, type }) => {
  const statusTranslate = getKycStatusTranslate(status);
  const color = LIVENESS_KYC_STATUS[status].color;
  const styles = useStyles();

  const getIconChip = (val) => {
    if (val === APPROVED) {
      return <Check />;
    }
    if (val === REJECTED) {
      return <Close />;
    }
    if (val === "POSITIVE_MATCH" || val === "NO_MATCH") {
      return <LivenessKYCPassedIcon />;
    }

    if (val === "EXPIRED" || val === "RETRY") {
      return <LivenessExpiredIcon />;
    }
    if (val === "COMPLETED") {
      return <LivenessKYCProgessIcon />;
    }
    if (val === "UNRESOLVED") {
      return <LivenessKYCTestFailedIcon />;
    }
    if (val === "WAIT_FOR_APPROVAL") {
      return <LivenessPeddingIcon />;
    }
    return "";
  };

  return (
    <div className={styles.hideChip} style={{ color: color }}>
      <div className="mr-1 mb-1">{getIconChip(status)}</div>
      <div>
        {status && statusTranslate ? (
          <span>
            <IntlMessages id={statusTranslate} />
          </span>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default LivenessStatus;
