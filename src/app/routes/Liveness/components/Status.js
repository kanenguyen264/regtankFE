//@flow
import Chip from "@mui/material/Chip";
import { makeStyles } from "@mui/styles";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { APPROVED, REJECTED } from "constants/ActionTypes";
import { FACE_COMPARE_STATUS, VERIFY_STATUS } from "constants/LivenessTest";
import React from "react";
import "./status.scss";

const useStyles = makeStyles(() => ({
  icon: {
    "& .MuiSvgIcon-root": {
      width: toRem(18),
    },
  },
  labelChip: {
    fontSize: toRem(14),
    fontWeight: 500,
  },
  chip: {
    height: toRem(28),
    paddingTop: toRem(4),
    paddingBottom: toRem(4),
  },
}));

const Status = ({ status, shortMode }) => {
  const styles = useStyles();

  const _status = VERIFY_STATUS[status] || VERIFY_STATUS.URL_GENERATED;
  const color = _status.color || "default";
  const label = shortMode
    ? _status.label2 || _status.label
    : _status.label || VERIFY_STATUS.PROCESSING.label;

  // const getIconChip = (val) => {
  //   if (val === APPROVED) {
  //     return <Check />;
  //   }
  //   if (val === REJECTED) {
  //     return <Close />;
  //   }
  //   return "";
  // };

  return (
    <span className={styles.icon}>
      <Chip
        // icon={<div style={{ color: color }}>{getIconChip(_status.key)}</div>}
        label={
          <strong className={styles.labelChip} style={{ color: color }}>
            <IntlMessages id={label} />
          </strong>
        }
        className={styles.chip}
        style={{ backgroundColor: _status.background }}
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

export default Status;
