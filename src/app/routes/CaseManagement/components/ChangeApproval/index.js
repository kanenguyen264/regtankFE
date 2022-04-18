import { Check, Close } from "@mui/icons-material";
import { Button } from "@mui/material";
import EditButton from "@protego/sdk/RegtankUI/v1/Button/EditButton";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import clsx from "clsx";
import { APPROVED, REJECTED } from "constants/ViewLogType";
import React from "react";
import ChangeStatusDialog from "./ChangeStatus/ChangeStatusDialog";
import styles from "./styles.module.scss";

const ChangeApproval = (props) => {
  const {
    status,
    onPressChange,
    id,
    openChangeStatus,
    setOpenChangeStatus,
    loading = false,
  } = props;

  const onPressChangeStatus = (status, note) => {
    onPressChange(status, note);
  };

  return (
    <div className={"d-flex align-items-center"}>
      {openChangeStatus && (
        <ChangeStatusDialog
          kycId={id}
          isOpen={openChangeStatus}
          onClose={() => setOpenChangeStatus(false)}
          onPressChange={onPressChangeStatus}
          status={status}
          loading={loading}
        />
      )}
      <Button
        disabled={status === REJECTED || status === APPROVED}
        startIcon={status === REJECTED && <Close />}
        onClick={() => onPressChangeStatus(REJECTED)}
        className={clsx(
          styles.btnPrimary,
          styles.btnIsReject,
          "mr-2",
          { "d-none": status === APPROVED }
        )}
        variant="contained"
        color="secondary"
      >
        <IntlMessages
          id={
            status === REJECTED
              ? "kyc.risk.scoring.Rejected"
              : "kyc.risk.scoring.Reject"
          }
        />
      </Button>
      <Button
        disabled={status === APPROVED || status === REJECTED}
        onClick={() => onPressChangeStatus(APPROVED)}
        className={clsx({
          [styles.btnPrimary]: status === APPROVED,
          "d-none": status === REJECTED,
          "mr-2": status === APPROVED
        })}
        variant="contained"
        color={"success"}
        startIcon={status === APPROVED && <Check />}
      >
        <IntlMessages
          id={
            status === APPROVED
              ? "kyc.risk.scoring.Approved"
              : "kyc.risk.scoring.Approve"
          }
        />
      </Button>
      {(status === REJECTED || status === APPROVED) && (
        <EditButton
          className={"ml-10"}
          onClick={() => setOpenChangeStatus(!openChangeStatus)}
          style={{marginLeft: toRem(6)}}
        />
      )}
    </div>
  );
};

export default ChangeApproval;
