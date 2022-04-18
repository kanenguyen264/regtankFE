import { IconButton } from "@mui/material";
import { Check, Close } from "@mui/icons-material";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import { ReactComponent as PenIcon } from "assets/icons/ic_pen.svg";
import clsx from "clsx";
import ChangeStatusDialog from "components/ChangeApproval/ChangeStatus/ChangeStatusDialog";
import { APPROVED, REJECTED } from "constants/ViewLogType";
import React from "react";
import styles from "./styles.module.scss";
import ActivityLogDialog from "components/ActivityLogDialog";
import { useIntl } from "react-intl";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
const ChangeApproval = (props) => {
  const {
    status,
    onPressChange,
    id,
    approval,
    openChangeStatus,
    setOpenChangeStatus,
    enableViewLog,
    loading = false,
  } = props;
  const intl = useIntl();
  const { formatMessage } = intl;
  const [stateApproval, setStateApproval] = React.useState(approval);
  const [isFirstChangeState, setIsFirstChangeState] = React.useState(false);
  const [openViewLog, setOpenViewLog] = React.useState(false);
  React.useEffect(() => {
    setStateApproval(approval);
  }, [approval]);

  React.useEffect(() => {
    let statusCurrent = approval ? approval : status;
    if (statusCurrent === APPROVED || statusCurrent === REJECTED) {
      setIsFirstChangeState(false);
      setStateApproval(statusCurrent);
      return;
    } else {
      setStateApproval("");
      setIsFirstChangeState(true);
    }
  }, [status, approval]);

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
          status={stateApproval}
          loading={loading}
        />
      )}
      {openViewLog && (
        <ActivityLogDialog
          isOpen={openViewLog}
          onClose={() => setOpenViewLog(false)}
          refId={id}
          title={formatMessage({ id: "kyc.view.log.activity.log" })}
        />
      )}
      {enableViewLog && (
        <span
          onClick={() => setOpenViewLog(true)}
          className={styles.textViewLog}
        >
          <IntlMessages id={"kyc.risk.scoring.view.log"} />
        </span>
      )}
      {(stateApproval === REJECTED || isFirstChangeState) && (
        <Button
          disabled={stateApproval === REJECTED && true}
          // startIcon={stateApproval === REJECTED && <Close />}
          onClick={() => onPressChangeStatus(REJECTED)}
          className={clsx(styles.btnIsReject, "mr-3")}
          variant="containedError"
          color="error"
        >
          {stateApproval === REJECTED ? (
            <IntlMessages id="kyc.risk.scoring.Rejected" />
          ) : (
            <IntlMessages id="kyc.risk.scoring.Reject" />
          )}
        </Button>
      )}
      {(stateApproval === APPROVED || isFirstChangeState) && (
        <Button
          disabled={stateApproval === APPROVED && true}
          onClick={() => onPressChangeStatus(APPROVED)}
          // className={clsx(
          //   styles.btnPrimary,
          //   stateApproval === APPROVED && styles.btnIsApprove
          // )}
          // startIcon={stateApproval === APPROVED && <Check />}
          variant="containedSuccess"
        >
          {stateApproval === APPROVED ? (
            <IntlMessages id="kyc.risk.scoring.Approved" />
          ) : (
            <IntlMessages id="kyc.risk.scoring.Approve" />
          )}
        </Button>
      )}
      {!isFirstChangeState && (
        <IconButton onClick={() => setOpenChangeStatus(!openChangeStatus)}>
          <PenIcon />
        </IconButton>
      )}
    </div>
  );
};

export default ChangeApproval;
