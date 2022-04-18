import { Typography } from "@mui/material";
import { ProtegoContext } from "@protego/sdk/core/ProtegoProvider/ProtegoProvider";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import {
  DJ_ACTION_KYC_TOGGLE_OM,
} from "actions/DJAction";
import { ReactComponent as IcQuestion } from "assets/icons/IcQuestion.svg";
import React from "react";
import { FormattedHTMLMessage } from "react-intl";
import { useDispatch } from "react-redux";
import { snackActions } from "util/snackbarUtils";
import styles from "../KYCScreeningResult.module.scss";
const OnGoingMonitoringDialog = ({ onClose, selected, enableOM }) => {
  const currentScreeningResult = selected[0];
  const [open, setOpen] = React.useState(true);
  const {
    omStartPeriod,
    omEndPeriod,
    kycId,
    setSwitchOM,
  } = currentScreeningResult;

  const dispatch = useDispatch();

  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  };

  const handleSave = async () => {
    handleClose();
    try {
      await dispatch(DJ_ACTION_KYC_TOGGLE_OM({ enabled: enableOM, kycId }));
      snackActions.success(
        <FormattedHTMLMessage
          id="djkyc.dialog.disabledOnGoingMonitoring.success"
          values={{ total: "1" }}
        />
      );
      setSwitchOM(false);
    } catch (error) {
      snackActions.error(<IntlMessages id="appModule.generic.errorMessage" />);
    }
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      allowCloseOnTitle
      title={{
        text: (
          <Typography variant="title">
            <IntlMessages id="Confirmation" />
          </Typography>
        ),
        icon: <IcQuestion />,
      }}
      actionsCustom={
        <div className="d-flex justify-content-end">
          <Button variant="outlinedSecondary" onClick={handleClose}>
            <Typography variant="Subtitle1">
              <IntlMessages id="cancel" />
            </Typography>
          </Button>
          <Button
            className={"ml-3"}
            variant="contained"
            type="submit"
            onClick={handleSave}
          >
            <IntlMessages id="disable" />
          </Button>
        </div>
      }
    >
      <div className={styles.textOm}>
        <Typography variant="subtitleGray">
          <FormattedHTMLMessage
            id="djkyc.dialog.onGoingMonitoring.confirmDisable"
            values={{ kycId }}
          />
        </Typography>
      </div>
    </Dialog>
  );
};

const useOnGoingMonitoringPrompt = (props) => {
  const { addComponent, removeComponent } = React.useContext(ProtegoContext);
  return (selected, enableOM) => {
    return new Promise((resolve) => {
      const onClose = () => {
        removeComponent({ key: "disableOM" });
        resolve();
      };

      addComponent({
        key: "disableOM",
        component: (
          <OnGoingMonitoringDialog
            selected={selected}
            onClose={onClose}
            enableOM={enableOM}
          />
        ),
      });
    });
  };
};

export default useOnGoingMonitoringPrompt;

