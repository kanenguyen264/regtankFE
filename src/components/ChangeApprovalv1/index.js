import { IconButton } from "@mui/material";
import { Check, Close } from "@mui/icons-material";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import { ReactComponent as PenIcon } from "assets/icons/ic_pen.svg";
import clsx from "clsx";
import ChangeStatusDialog from "components/ChangeApprovalv1/ChangeStatus/ChangeStatusDialog";
import { APPROVED, REJECTED } from "constants/ViewLogType";
import React from "react";
import styles from "./styles.module.scss";
import ActivityLogDialog from "components/ActivityLogDialog";
import { useIntl } from "react-intl";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import { ReactComponent as Edit } from "assets/icons/IcPenBold.svg";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
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
    hideStatusSelect = false.valueOf,
    title = "",
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
          hideStatusSelect
          title
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
          onClick={() => onPressChangeStatus(REJECTED)}
          className={clsx(styles.btnIsReject, "mr-3")}
          variant="containedError"
          startIcon={stateApproval === REJECTED && <ClearIcon />}
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
          className={!isFirstChangeState && "mr-3"}
          disabled={stateApproval === APPROVED && true}
          onClick={() => onPressChangeStatus(APPROVED)}
          variant="containedSuccess"
          startIcon={stateApproval === APPROVED && <CheckIcon />}
        >
          {stateApproval === APPROVED ? (
            <IntlMessages id="kyc.risk.scoring.Approved" />
          ) : (
            <IntlMessages id="kyc.risk.scoring.Approve" />
          )}
        </Button>
      )}
      {!isFirstChangeState && (
        <Button
          aria-label="edit-risk-scoring"
          disableRipple
          disableFocusRipple
          onClick={() => setOpenChangeStatus(!openChangeStatus)}
          variant={"outlinedIcon"}
          className={clsx(styles.editButton)}
        >
          <Edit />
        </Button>
      )}
    </div>
  );
};

export default ChangeApproval;
